import { create } from "zustand";
import type { VoiceSessionState } from "@/types";
import type { TranscriptEntry } from "@/types/database";

interface VoiceStore {
  state: VoiceSessionState;
  transcript: TranscriptEntry[];
  duration: number;
  audioLevel: number;
  setState: (state: VoiceSessionState) => void;
  addTranscript: (entry: TranscriptEntry) => void;
  setDuration: (duration: number) => void;
  setAudioLevel: (level: number) => void;
  reset: () => void;
}

export const useVoiceStore = create<VoiceStore>((set) => ({
  state: "idle",
  transcript: [],
  duration: 0,
  audioLevel: 0,
  setState: (state) => set({ state }),
  addTranscript: (entry) => set((s) => ({ transcript: [...s.transcript, entry] })),
  setDuration: (duration) => set({ duration }),
  setAudioLevel: (audioLevel) => set({ audioLevel }),
  reset: () => set({ state: "idle", transcript: [], duration: 0, audioLevel: 0 }),
}));