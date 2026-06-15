import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { STRINGS, useLang } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/news", key: "news" as const },
  { to: "/appearances", key: "appearances" as const },
  { to: "/choreography", key: "choreography" as const },
  { to: "/biography", key: "biography" as const },
  { to: "/record", key: "record" as const },
  { to: "/contact", key: "contact" as const },
];

export function Header() {
  const { lang, setLang } = useLang();
  const { isAdmin, user } = useAuth();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isHome = pathname === "/";

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-colors duration-300",
        isHome ? "bg-transparent" : "bg-background/80 backdrop-blur-md border-b hairline",
      )}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10 h-16 flex items-center justify-between">
        <Link to="/" className="font-display text-xl tracking-[0.4em] text-foreground">
          ARTIST
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-[11px] tracking-display text-muted-foreground hover:text-gold transition-colors"
              activeProps={{ className: "text-gold" }}
            >
              {STRINGS.menu[item.key][lang]}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              className="text-[11px] tracking-display text-gold hover:opacity-80"
            >
              {STRINGS.menu.admin[lang]}
            </Link>
          )}
          {!user && (
            <Link
              to="/auth"
              className="text-[11px] tracking-display text-muted-foreground hover:text-gold transition-colors"
            >
              {STRINGS.menu.login[lang]}
            </Link>
          )}
          <div className="flex items-center gap-1 text-[11px] tracking-display border-l hairline pl-5">
            <button
              onClick={() => setLang("ja")}
              className={cn("px-1 transition-colors", lang === "ja" ? "text-gold" : "text-muted-foreground hover:text-foreground")}
            >
              JP
            </button>
            <span className="text-muted-foreground/40">/</span>
            <button
              onClick={() => setLang("en")}
              className={cn("px-1 transition-colors", lang === "en" ? "text-gold" : "text-muted-foreground hover:text-foreground")}
            >
              EN
            </button>
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
                className="text-sm tracking-display text-muted-foreground hover:text-gold"
                activeProps={{ className: "text-gold" }}
              >
                {STRINGS.menu[item.key][lang]}
              </Link>
            ))}
            {isAdmin && (
              <Link to="/admin" onClick={() => setOpen(false)} className="text-sm tracking-display text-gold">
                {STRINGS.menu.admin[lang]}
              </Link>
            )}
            {!user && (
              <Link to="/auth" onClick={() => setOpen(false)} className="text-sm tracking-display text-muted-foreground">
                {STRINGS.menu.login[lang]}
              </Link>
            )}
            <div className="flex items-center gap-2 pt-2 border-t hairline text-xs tracking-display">
              <button onClick={() => setLang("ja")} className={lang === "ja" ? "text-gold" : "text-muted-foreground"}>JP</button>
              <span className="text-muted-foreground/40">/</span>
              <button onClick={() => setLang("en")} className={lang === "en" ? "text-gold" : "text-muted-foreground"}>EN</button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
