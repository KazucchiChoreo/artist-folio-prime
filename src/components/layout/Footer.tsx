import { useLang } from "@/lib/i18n";

export function Footer() {
  const { lang } = useLang();
  const tag = { ja: "ダンサー / 振付師", en: "Dancer / Choreographer", zh: "舞者 / 编舞师" }[lang];
  return (
    <footer className="mt-32 border-t hairline bg-card/40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-display tracking-[0.18em] text-xl text-foreground">KAZUTCHI</p>
          <p className="text-[11px] tracking-display text-muted-foreground mt-1">{tag}</p>
        </div>
        <p className="text-[11px] tracking-display text-muted-foreground">
          © {new Date().getFullYear()} KAZUTCHI — ALL RIGHTS RESERVED
        </p>
      </div>
    </footer>
  );
}
