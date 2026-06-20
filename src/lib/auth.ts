import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("onAuthStateChange fired:", event, session?.user?.id);
      const u = session?.user ?? null;
      setUser(u);

      if (!u) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      // setLoading(false) をまず呼んでUIをブロックしないようにする
      setLoading(false);

      // admin判定は非同期で後追いする
      supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", u.id)
        .then(({ data: rd, error }) => {
          console.log("user_roles query result:", { rd, error });
          setIsAdmin(!!rd?.some((r) => r.role === "admin"));
        })
        .catch((err) => {
          console.error("user_roles query threw:", err);
        });
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  return { user, isAdmin, loading };
}
