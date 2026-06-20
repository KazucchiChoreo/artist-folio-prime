import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { STRINGS, useLang, type Lang } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/news", key: "news" as const },
  { to: "/choreography", key: "choreography" as const },
  { to: "/biography", key: "biography" as const },
  { to: "/contact", key: "contact" as const },
];

const LANGS: { code: Lang; label: string }[] = [
  { code: "ja", label: "JP" },
  { code: "en", label: "EN" },
  { code: "zh", label: "中" },
];

export function Header() {
  const { lang, setLang } = useLang();
  const { isAdmin, user, loading } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isHome = pathname === "/";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setOpen(false);
    navigate({ to: "/" });
  };
  
  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-colors duration-300",
        isHome ? "bg-background/40 backdrop-blur-sm" : "bg-background/85 backdrop-blur-md border-b hairline",
      )}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10 h-16 flex items-center justify-between">
        <Link to="/" className="font-display text-2xl tracking-[0.18em] text-foreground">
          KAZUTCHI
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-[11px] tracking-display text-muted-foreground hover:text-coral transition-colors"
              activeProps={{ className: "text-coral" }}
            >
              {STRINGS.menu[item.key][lang]}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              className="text-[11px] tracking-display text-coral hover:opacity-80"
            >
              {STRINGS.menu.admin[lang]}
            </Link>
          )}
          {!loading && !user && (
            <Link
              to="/auth"
              className="text-[11px] tracking-display text-muted-foreground hover:text-coral transition-colors"
            >
              {STRINGS.menu.login[lang]}
            </Link>
          )}
          {!loading && user && (
            <button
              onClick={handleLogout}
              className="text-[11px] tracking-display text-muted-foreground hover:text-coral transition-colors"
            >
              {STRINGS.menu.logout[lang]}
            </button>
          )}
          <div className="flex items-center gap-1 text-[11px] tracking-display border-l hairline pl-5">
            {LANGS.map((l, i) => (
              <span key={l.code} className="flex items-center">
                {i > 0 && <span className="text-muted-foreground/40 mx-1">/</span>}
                <button
                  onClick={() => setLang(l.code)}
                  className={cn("px-1 transition-colors", lang === l.code ? "text-coral" : "text-muted-foreground hover:text-foreground")}
                >
                  {l.label}
                </button>
              </span>
            ))}
          </div>
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden text-foreground p-2"
          aria-label="Menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-background/95 backdrop-blur-md border-t hairline">
          <nav className="px-6 py-6 flex flex-col gap-4">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="text-sm tracking-display text-muted-foreground hover:text-coral"
                activeProps={{ className: "text-coral" }}
              >
                {STRINGS.menu[item.key][lang]}
              </Link>
            ))}
            {isAdmin && (
              <Link to="/admin" onClick={() => setOpen(false)} className="text-sm tracking-display text-coral">
                {STRINGS.menu.admin[lang]}
              </Link>
            )}
            {!loading && !user && (
              <Link to="/auth" onClick={() => setOpen(false)} className="text-sm tracking-display text-muted-foreground">
                {STRINGS.menu.login[lang]}
              </Link>
            )}
            {!loading && user && (
              <button onClick={handleLogout} className="text-sm tracking-display text-muted-foreground text-left">
                {STRINGS.menu.logout[lang]}
              </button>
            )}
            <div className="flex items-center gap-2 pt-2 border-t hairline text-xs tracking-display">
              {LANGS.map((l, i) => (
                <span key={l.code} className="flex items-center">
                  {i > 0 && <span className="text-muted-foreground/40 mx-1">/</span>}
                  <button onClick={() => setLang(l.code)} className={lang === l.code ? "text-coral" : "text-muted-foreground"}>
                    {l.label}
                  </button>
                </span>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
