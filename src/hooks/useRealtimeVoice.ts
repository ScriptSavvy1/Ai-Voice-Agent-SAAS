"use client";

import { useState, useRef, useCallback } from "react";
import { GoogleGenAI, Modality } from "@google/genai";
import { voiceTools } from "@/ai/tools";
import type { TranscriptEntry } from "@/types/database";
import type { VoiceSessionState } from "@/types";

interface UseRealtimeVoiceOptions {
  businessId: string;
  onTranscriptUpdate?: (transcript: TranscriptEntry[]) => void;
  onStateChange?: (state: VoiceSessionState) => void;
}

export function useRealtimeVoice({ businessId, onTranscriptUpdate, onStateChange }: UseRealtimeVoiceOptions) {
  const [state, setState] = useState<VoiceSessionState>("idle");
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Gemini Live API refs
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const updateState = useCallback((newState: VoiceSessionState) => {
    setState(newState);
    onStateChange?.(newState);
  }, [onStateChange]);

  const addTranscriptEntry = useCallback((entry: TranscriptEntry) => {
    setTranscript((prev) => {
      const updated = [...prev, entry];
      onTranscriptUpdate?.(updated);
      return updated;
    });
  }, [onTranscriptUpdate]);

  const connect = useCallback(async () => {
    try {
      updateState("connecting");
      setError(null);
      setTranscript([]);
      startTimeRef.current = Date.now();

      // 1. Get system instructions from our API
      const sessionRes = await fetch("/api/realtime/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId }),
      });

      if (!sessionRes.ok) {
        throw new Error("Failed to get session config");
      }

      const { instructions, model } = await sessionRes.json();

      // Ensure API key is available (in a real app, use a proxy endpoint for better security)
      // Next.js requires NEXT_PUBLIC_ for client-side access, but we'll use the server
      // to proxy requests if needed. For this demo, we assume the key is accessible or proxied.
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
      if (!apiKey) {
         throw new Error("GEMINI_API_KEY is missing. Please add it to .env.local and prefix with NEXT_PUBLIC_ for client side access during testing.");
      }

      // 2. Initialize Gemini SDK
      const ai = new GoogleGenAI({ apiKey });

      // 3. Setup Audio Capture (16kHz PCM)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: {
        channelCount: 1,
        sampleRate: 16000,
      } });
      streamRef.current = stream;

      const audioCtx = new AudioContext({ sampleRate: 16000 });
      audioContextRef.current = audioCtx;

      // We need an AudioWorklet to capture raw PCM
      // For simplicity in this demo, we'll assume a basic worklet or script processor
      // (ScriptProcessorNode is deprecated but easier to inline without external files)
      const source = audioCtx.createMediaStreamSource(stream);
      sourceNodeRef.current = source;
      
      const processor = audioCtx.createScriptProcessor(4096, 1, 1);
      source.connect(processor);
      processor.connect(audioCtx.destination);

      // 4. Connect to Gemini Live API
      const session = await ai.live.connect({
        model: model,
        config: {
           systemInstruction: { parts: [{ text: instructions }] },
           tools: [{ functionDeclarations: voiceTools }],
           responseModalities: [Modality.AUDIO],
           speechConfig: {
              voiceConfig: {
                 prebuiltVoiceConfig: {
                    voiceName: "Aoede", // Options: Aoede, Charon, Fenrir, Kore, Puck
                 }
              }
           }
        },
      });

      sessionRef.current = session;
      updateState("connected");

      // 5. Handle Audio Input (Mic to Gemini)
      processor.onaudioprocess = (e) => {
         if (state !== "speaking" && sessionRef.current) {
             const inputData = e.inputBuffer.getChannelData(0);
             // Convert Float32 to Int16 PCM
             const pcmData = new Int16Array(inputData.length);
             for (let i = 0; i < inputData.length; i++) {
                 pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
             }
             
             // Send audio chunk
             sessionRef.current.send({
                 realtimeInput: {
                     mediaChunks: [{
                         mimeType: "audio/pcm;rate=16000",
                         data: Buffer.from(pcmData.buffer).toString('base64')
                     }]
                 }
             });
         }
      };

      // 6. Handle Gemini Events
      // The GenAI SDK uses async iteration for messages
      (async () => {
         try {
             for await (const message of session) {
                 if (message.serverContent?.modelTurn?.parts) {
                     for (const part of message.serverContent.modelTurn.parts) {
                         // Handle Audio Output
                         if (part.inlineData && part.inlineData.mimeType.startsWith("audio/pcm")) {
                             updateState("speaking");
                             
                             // Decode Base64 PCM to AudioBuffer and play
                             const binaryStr = atob(part.inlineData.data);
                             const bytes = new Uint8Array(binaryStr.length);
                             for (let i = 0; i < binaryStr.length; i++) {
                                 bytes[i] = binaryStr.charCodeAt(i);
                             }
                             const int16Array = new Int16Array(bytes.buffer);
                             const float32Array = new Float32Array(int16Array.length);
                             for (let i = 0; i < int16Array.length; i++) {
                                 float32Array[i] = int16Array[i] / 0x7FFF;
                             }
                             
                             const outBuffer = audioCtx.createBuffer(1, float32Array.length, 24000); // Gemini out is 24kHz
                             outBuffer.copyToChannel(float32Array, 0);
                             
                             const sourceNode = audioCtx.createBufferSource();
                             sourceNode.buffer = outBuffer;
                             sourceNode.connect(audioCtx.destination);
                             sourceNode.start();
                             
                             sourceNode.onended = () => {
                                 updateState("connected");
                             };
                         }
                         
                         // Handle Text Transcript
                         if (part.text) {
                             addTranscriptEntry({
                                 role: "assistant",
                                 content: part.text,
                                 timestamp: new Date().toISOString()
                             });
                         }
                         
                         // Handle Function Calls
                         if (part.functionCall) {
                             const { name, args } = part.functionCall;
                             
                             // Execute tool on server
                             const toolRes = await fetch("/api/realtime/tools", {
                               method: "POST",
                               headers: { "Content-Type": "application/json" },
                               body: JSON.stringify({
                                 toolName: name,
                                 args: args,
                               }),
                             });

                             const { result } = await toolRes.json();

                             // Send tool result back
                             sessionRef.current.send({
                                 toolResponse: {
                                     functionResponses: [{
                                         id: part.functionCall.id,
                                         name: name,
                                         response: { result }
                                     }]
                                 }
                             });
                         }
                     }
                 }
             }
         } catch (e) {
             console.error("Gemini Session Error:", e);
             setError("Lost connection to AI");
             disconnect();
         }
      })();

      // Duration timer
      timerRef.current = setInterval(() => {
        setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);

    } catch (err) {
      console.error("Connection error:", err);
      setError(err instanceof Error ? err.message : "Connection failed");
      updateState("error");
      disconnect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId, updateState, addTranscriptEntry]);

  const disconnect = useCallback(async () => {
    // Stop timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Close Gemini session
    if (sessionRef.current) {
      // The SDK session object might not have an explicit close, we just stop sending
      sessionRef.current = null;
    }

    // Close Audio Context
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    // Stop mic
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    const finalDuration = startTimeRef.current
      ? Math.floor((Date.now() - startTimeRef.current) / 1000)
      : 0;

    // Save conversation
    if (transcript.length > 0) {
      try {
        await fetch("/api/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            business_id: businessId,
            transcript,
            duration_seconds: finalDuration,
            language: "so",
            appointment_booked: transcript.some((t) =>
              t.content.toLowerCase().includes("booked") ||
              t.content.toLowerCase().includes("appointment") ||
              t.content.includes("balan")
            ),
          }),
        });
      } catch (err) {
        console.error("Failed to save conversation:", err);
      }
    }

    updateState("idle");
    setDuration(0);
  }, [businessId, transcript, updateState]);

  return {
    state,
    transcript,
    duration,
    error,
    connect,
    disconnect,
    isConnected: state !== "idle" && state !== "error",
  };
}