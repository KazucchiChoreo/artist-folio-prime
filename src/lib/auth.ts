import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminChecked, setAdminChecked] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      setLoading(false);

      if (!u) {
        setIsAdmin(false);
        setAdminChecked(true);
        return;
      }

      setAdminChecked(false);
      supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", u.id)
        .then(({ data: rd }) => {
          setIsAdmin(!!rd?.some((r) => r.role === "admin"));
          setAdminChecked(true);
        })
        .catch(() => {
          setIsAdmin(false);
          setAdminChecked(true);
        });
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  return { user, isAdmin, loading, adminChecked };
}
