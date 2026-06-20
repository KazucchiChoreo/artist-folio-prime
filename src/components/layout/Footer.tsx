import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLang, STRINGS, t } from "@/lib/i18n";

export function Footer() {
  const { lang } = useLang();

  const { data: siteText } = useQuery({
    queryKey: ["site-text"],
    queryFn: async () => {
      const { data } = await supabase.from("site_text").select("*");
      const map: Record<string, { ja: string; en: string; zh: string }> = {};
      data?.forEach((row: any) => {
        map[row.key] = { ja: row.value_ja, en: row.value_en, zh: row.value_zh };
      });
      return map;
    },
  });

  const tag = siteText?.["home.role"] ? t(siteText["home.role"], lang) : t(STRINGS.role, lang);

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
