import { useLang } from "@/lib/i18n";

export function Footer() {
  const { lang } = useLang();
  return (
    <footer className="mt-32 border-t hairline">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-display tracking-[0.4em] text-sm text-foreground">ARTIST</p>
        <p className="text-[11px] tracking-display text-muted-foreground">
          © {new Date().getFullYear()} ARTIST — {lang === "ja" ? "ALL RIGHTS RESERVED" : "ALL RIGHTS RESERVED"}
        </p>
      </div>
    </footer>
  );
}
