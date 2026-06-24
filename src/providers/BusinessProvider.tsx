"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Business } from "@/types";

interface BusinessContextType {
  business: Business | null;
  loading: boolean;
  error: string | null;
  refreshBusiness: () => Promise<void>;
}

const BusinessContext = createContext<BusinessContextType>({
  business: null,
  loading: true,
  error: null,
  refreshBusiness: async () => {},
});

export function useBusinessContext() {
  return useContext(BusinessContext);
}

export function BusinessProvider({ children }: { children: React.ReactNode }) {
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchBusiness = async () => {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("Not authenticated");
        return;
      }

      const { data, error: bizError } = await supabase
        .from("businesses")
        .select("*")
        .eq("owner_id", user.id)
        .single();

      if (bizError) {
        setError(bizError.message);
        return;
      }

      setBusiness(data);
    } catch {
      setError("Failed to load business data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusiness();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BusinessContext.Provider
      value={{ business, loading, error, refreshBusiness: fetchBusiness }}
    >
      {children}
    </BusinessContext.Provider>
  );
}
