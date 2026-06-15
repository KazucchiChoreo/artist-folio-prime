import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      if (!mounted) return;
      setUser(data.user ?? null);
      if (data.user) {
        const { data: rd } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", data.user.id);
        if (mounted) setIsAdmin(!!rd?.some((r) => r.role === "admin"));
      }
      if (mounted) setLoading(false);
    };
    init();
    const { data: sub } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (event === "SIGNED_OUT" || !session?.user) {
        setIsAdmin(false);
        return;
      }
      const { data: rd } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id);
      setIsAdmin(!!rd?.some((r) => r.role === "admin"));
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { user, isAdmin, loading };
}
