import { useEffect } from "react";
import { useRouter } from "expo-router";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../store/authStore";
import type { Profile, Role } from "../types";

export function useAuth() {
  const { user, profile, setUser, setProfile, logout: storeLogout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        setProfile(data as Profile | null);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, setProfile]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    storeLogout();
    router.replace("/(auth)/welcome");
  };

  const setRole = async (role: Role) => {
    if (!user) return { error: new Error("Not authenticated") };
    const { error } = await supabase
      .from("profiles")
      .update({ role })
      .eq("id", user.id);
    if (!error) {
      setProfile({ ...profile!, role });
    }
    return { error };
  };

  return {
    user,
    profile,
    isAuthenticated: !!user,
    role: profile?.role ?? null,
    signIn,
    signUp,
    signOut,
    setRole,
  };
}
