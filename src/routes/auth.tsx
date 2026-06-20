import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { useLang } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Login — ARTIST" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { lang } = useLang();
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user && isAdmin) navigate({ to: "/admin" });
  }, [loading, user, isAdmin, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success(lang === "ja" ? "ログインしました" : "Signed in");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success(lang === "ja" ? "アカウントを作成しました" : "Account created");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader eyebrow="— ADMIN" title={lang === "ja" ? "ログイン" : "Login"} />
      <section className="py-20">
        <div className="mx-auto max-w-md px-6 lg:px-10">
          <p className="text-sm text-muted-foreground mb-8">
            {lang === "ja"
              ? "会員の方はこちらからログイン"
              : "login"}
          </p>
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="text-[11px] tracking-display text-gold">EMAIL</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-2 bg-card border hairline px-4 py-3 text-foreground focus:outline-none focus:ring-1 focus:ring-gold"
              />
            </div>
            <div>
              <label className="text-[11px] tracking-display text-gold">PASSWORD</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-2 bg-card border hairline px-4 py-3 text-foreground focus:outline-none focus:ring-1 focus:ring-gold"
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="w-full bg-gold text-primary-foreground py-3 tracking-display text-sm hover:opacity-90 disabled:opacity-50 transition"
            >
              {busy ? "..." : mode === "signin" ? (lang === "ja" ? "ログイン" : "SIGN IN") : (lang === "ja" ? "登録する" : "SIGN UP")}
            </button>
          </form>
          <button
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="mt-6 text-xs tracking-display text-muted-foreground hover:text-gold"
          >
            {mode === "signin"
              ? lang === "ja" ? "新規登録はこちら →" : "Create an account →"
              : lang === "ja" ? "既にアカウントをお持ちの方 →" : "Sign in instead →"}
          </button>
        </div>
      </section>
    </>
  );
}
