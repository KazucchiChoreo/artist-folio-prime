import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChange だけで管理する（getUser との競合を避ける）
    const { data: sub } = supabase.auth.onAuthStateChange(async (event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        const { data: rd } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", u.id);
        setIsAdmin(!!rd?.some((r) => r.role === "admin"));
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  return { user, isAdmin, loading };
}
