import { create } from "zustand";
import type { Business } from "@/types";

interface BusinessStore {
  business: Business | null;
  loading: boolean;
  setBusiness: (business: Business | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useBusinessStore = create<BusinessStore>((set) => ({
  business: null,
  loading: true,
  setBusiness: (business) => set({ business }),
  setLoading: (loading) => set({ loading }),
}));