import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import type { Profile, TechnicianProfile } from "../types";

export interface TechnicianWithProfile extends TechnicianProfile {
  profiles: Profile | null;
}

export interface UseTechniciansFilters {
  category?: string;
  maxRate?: number;
  isAvailable?: boolean;
}

export function useTechnicians(filters: UseTechniciansFilters = {}) {
  const [technicians, setTechnicians] = useState<TechnicianWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from("technician_profiles")
        .select("*, profiles(*)")
        .not("profiles.id", "is", null);

      if (filters.category) {
        query = query.eq("category", filters.category);
      }
      if (filters.maxRate != null) {
        query = query.lte("hourly_rate", filters.maxRate);
      }
      if (filters.isAvailable === true) {
        query = query.eq("is_available", true);
      }

      const { data, error: err } = await query.order("avg_rating", { ascending: false });
      if (err) throw err;
      setTechnicians((data as TechnicianWithProfile[]) ?? []);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setLoading(false);
    }
  }, [filters.category, filters.maxRate, filters.isAvailable]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { technicians, loading, error, refetch: fetch };
}

export function useTechnician(id: string | null) {
  const [technician, setTechnician] = useState<TechnicianWithProfile | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setTechnician(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    void supabase
      .from("technician_profiles")
      .select("*, profiles(*)")
      .eq("id", id)
      .single()
      .then(({ data, error: err }) => {
        if (cancelled) return;
        if (err) setError(err as unknown as Error);
        else setTechnician(data as TechnicianWithProfile);
      })
      .then(
        () => { if (!cancelled) setLoading(false); },
        () => { if (!cancelled) setLoading(false); }
      );
    return () => {
      cancelled = true;
    };
  }, [id]);

  return { technician, loading, error };
}
