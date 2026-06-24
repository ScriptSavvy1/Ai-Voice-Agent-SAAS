"use client";

import { useState, useRef, useCallback } from "react";
import { useVoiceStore } from "@/store/voice";

// ─── PCM Audio Helpers ───────────────────────────────────────

function float32ToPcm16(float32: Float32Array): ArrayBuffer {
  const buffer = new ArrayBuffer(float32.length * 2);
  const view = new DataView(buffer);
  for (let i = 0; i < float32.length; i++) {
    const s = Math.max(-1, Math.min(1, float32[i]));
    view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return buffer;
}

function pcm16ToFloat32(pcm16: ArrayBuffer): Float32Array {
  const view = new DataView(pcm16);
  const float32 = new Float32Array(view.byteLength / 2);
  for (let i = 0; i < float32.length; i++) {
    float32[i] = view.getInt16(i * 2, true) / 0x8000;
  }
  return float32;
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// ─── Downsample from browser's native rate to 16kHz ──────────

function downsample(buffer: Float32Array, fromRate: number, toRate: number): Float32Array {
  if (fromRate === toRate) return buffer;
  const ratio = fromRate / toRate;
  const newLength = Math.round(buffer.length / ratio);
  const result = new Float32Array(newLength);
  for (let i = 0; i < newLength; i++) {
    const idx = Math.round(i * ratio);
    result[i] = buffer[Math.min(idx, buffer.length - 1)];
  }
  return result;
}

// ─── Main Hook ───────────────────────────────────────────────

export function useRealtimeVoice() {
  const [status, setStatus] = useState<"idle" | "connecting" | "connected" | "error">("idle");
  const wsRef = useRef<WebSocket | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const playbackQueueRef = useRef<Float32Array[]>([]);
  const isPlayingRef = useRef(false);
  const businessIdRef = useRef<string>("");

  const {
    setIsConnected,
    setIsListening,
    setIsSpeaking,
    addTranscriptEntry,
  } = useVoiceStore();

  // ─── Audio Playback ──────────────────────────────────────

  const playNextChunk = useCallback(() => {
    if (!audioCtxRef.current || playbackQueueRef.current.length === 0) {
      isPlayingRef.current = false;
      setIsSpeaking(false);
      return;
    }

    isPlayingRef.current = true;
    setIsSpeaking(true);

    const chunk = playbackQueueRef.current.shift()!;
    const buffer = audioCtxRef.current.createBuffer(1, chunk.length, 24000);
    buffer.getChannelData(0).set(chunk);

    const source = audioCtxRef.current.createBufferSource();
    source.buffer = buffer;
    source.connect(audioCtxRef.current.destination);
    source.onended = () => playNextChunk();
    source.start();
  }, [setIsSpeaking]);

  const enqueueAudio = useCallback((pcmBase64: string) => {
    const pcmBuffer = base64ToArrayBuffer(pcmBase64);
    const float32 = pcm16ToFloat32(pcmBuffer);
    playbackQueueRef.current.push(float32);

    if (!isPlayingRef.current) {
      playNextChunk();
    }
  }, [playNextChunk]);

  // ─── Connect ─────────────────────────────────────────────

  const connect = useCallback(async (businessId: string) => {
    if (wsRef.current) return;
    businessIdRef.current = businessId;
    setStatus("connecting");

    try {
      // 1. Get session config from our API
      const res = await fetch("/api/realtime/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId }),
      });

      if (!res.ok) throw new Error("Failed to get session config");
      const config = await res.json();

      // 2. Open WebSocket to Gemini Live API
      const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${config.apiKey}`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        // Send setup message
        const setupMsg = {
          setup: {
            model: `models/${config.model}`,
            generationConfig: {
              responseModalities: ["AUDIO"],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: {
                    voiceName: "Aoede",
                  },
                },
              },
            },
            systemInstruction: {
              parts: [{ text: config.systemPrompt }],
            },
            tools: config.tools,
          },
        };
        ws.send(JSON.stringify(setupMsg));
      };

      ws.onmessage = async (event) => {
        let msg: any;
        
        if (event.data instanceof Blob) {
          const text = await event.data.text();
          msg = JSON.parse(text);
        } else {
          msg = JSON.parse(event.data);
        }

        // Setup complete
        if (msg.setupComplete) {
          setStatus("connected");
          setIsConnected(true);
          setIsListening(true);
          startMicrophone();
          addTranscriptEntry("assistant", "Asalaamu calaykum! Sideen kuu caawin karaa?");
          return;
        }

        // Server content (audio or text)
        const serverContent = msg.serverContent;
        if (serverContent) {
          if (serverContent.modelTurn?.parts) {
            for (const part of serverContent.modelTurn.parts) {
              if (part.inlineData?.data) {
                // Audio response
                enqueueAudio(part.inlineData.data);
              }
              if (part.text) {
                // Text transcript from model
                addTranscriptEntry("assistant", part.text);
              }
            }
          }

          // Turn complete
          if (serverContent.turnComplete) {
            setIsSpeaking(false);
            setIsListening(true);
          }
          return;
        }

        // Tool call from Gemini
        const toolCall = msg.toolCall;
        if (toolCall?.functionCalls) {
          for (const fc of toolCall.functionCalls) {
            // Execute tool on our server
            const toolRes = await fetch("/api/realtime/tools", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ functionCall: { name: fc.name, args: fc.args } }),
            });

            const toolResult = await toolRes.json();

            // Send function response back to Gemini
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({
                toolResponse: {
                  functionResponses: [{
                    id: fc.id,
                    name: fc.name,
                    response: toolResult.functionResponse?.response || { error: "Tool failed" },
                  }],
                },
              }));
            }
          }
          return;
        }
      };

      ws.onerror = (err) => {
        console.error("WebSocket error:", err);
        setStatus("error");
        cleanup();
      };

      ws.onclose = () => {
        setStatus("idle");
        cleanup();
      };

    } catch (err) {
      console.error("Connection error:", err);
      setStatus("error");
      cleanup();
    }
  }, [setIsConnected, setIsListening, setIsSpeaking, addTranscriptEntry, enqueueAudio]);

  // ─── Microphone Capture ──────────────────────────────────

  const startMicrophone = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      streamRef.current = stream;

      const audioCtx = new AudioContext({ sampleRate: 16000 });
      audioCtxRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      sourceRef.current = source;

      // Use ScriptProcessorNode for broad browser compatibility
      const processor = audioCtx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        if (wsRef.current?.readyState !== WebSocket.OPEN) return;

        const inputData = e.inputBuffer.getChannelData(0);
        const downsampled = downsample(inputData, audioCtx.sampleRate, 16000);
        const pcm = float32ToPcm16(downsampled);
        const base64 = arrayBufferToBase64(pcm);

        // Send audio chunk to Gemini
        wsRef.current.send(JSON.stringify({
          realtimeInput: {
            mediaChunks: [{
              mimeType: "audio/pcm;rate=16000",
              data: base64,
            }],
          },
        }));
      };

      source.connect(processor);
      processor.connect(audioCtx.destination);

    } catch (err) {
      console.error("Microphone error:", err);
      setStatus("error");
    }
  }, []);

  // ─── Cleanup ─────────────────────────────────────────────

  const cleanup = useCallback(() => {
    processorRef.current?.disconnect();
    sourceRef.current?.disconnect();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    audioCtxRef.current?.close();
    wsRef.current?.close();

    processorRef.current = null;
    sourceRef.current = null;
    streamRef.current = null;
    audioCtxRef.current = null;
    wsRef.current = null;
    playbackQueueRef.current = [];
    isPlayingRef.current = false;

    setIsConnected(false);
    setIsListening(false);
    setIsSpeaking(false);
  }, [setIsConnected, setIsListening, setIsSpeaking]);

  // ─── Disconnect ──────────────────────────────────────────

  const disconnect = useCallback(async () => {
    // Save conversation before disconnecting
    const transcript = useVoiceStore.getState().transcript;
    if (transcript.length > 0 && businessIdRef.current) {
      try {
        await fetch("/api/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            business_id: businessIdRef.current,
            transcript,
            summary: `Voice call — ${transcript.length} messages`,
            duration_seconds: 0,
            language: "so",
          }),
        });
      } catch (e) {
        console.error("Failed to save conversation:", e);
      }
    }

    cleanup();
    setStatus("idle");
    useVoiceStore.getState().clearTranscript();
  }, [cleanup]);

  return { status, connect, disconnect };
}