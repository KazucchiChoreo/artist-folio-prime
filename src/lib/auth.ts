import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("onAuthStateChange fired:", event, session?.user?.id);
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        try {
          const { data: rd, error } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", u.id);
          console.log("user_roles query result:", { rd, error });
          setIsAdmin(!!rd?.some((r) => r.role === "admin"));
        } catch (err) {
          console.error("user_roles query threw:", err);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
      console.log("setLoading(false) called");
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  return { user, isAdmin, loading };
}
