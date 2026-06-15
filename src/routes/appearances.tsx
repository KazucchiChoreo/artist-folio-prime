import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { STRINGS, useLang } from "@/lib/i18n";

export const Route = createFileRoute("/appearances")({
  head: () => ({
    meta: [
      { title: "Appearances — ARTIST" },
      { name: "description", content: "Upcoming and past performances by ARTIST." },
      { property: "og:title", content: "Appearances — ARTIST" },
    ],
  }),
  component: AppearancesPage,
});

function AppearancesPage() {
  const { lang } = useLang();
  const { data } = useQuery({
    queryKey: ["appearances"],
    queryFn: async () => {
      const { data } = await supabase.from("appearances").select("*").order("event_date", { ascending: false });
      return data ?? [];
    },
  });

  return (
    <>
      <PageHeader eyebrow="— 02 / APPEARANCES" title={lang === "ja" ? "出演情報" : "Appearances"} />
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-6 lg:px-10">
          {!data || data.length === 0 ? (
            <p className="text-muted-foreground">{STRINGS.noContent[lang]}</p>
          ) : (
            <div className="space-y-px bg-border">
              {data.map((a) => (
                <article key={a.id} className="bg-background py-8 grid grid-cols-1 md:grid-cols-[140px_1fr_auto] gap-4 md:gap-10 items-start">
                  <time className="text-xs tracking-display text-gold">{a.event_date || "TBA"}</time>
                  <div>
                    <h3 className="text-xl font-display text-foreground">
                      {lang === "ja" ? a.title_ja || a.title_en : a.title_en || a.title_ja}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {lang === "ja" ? a.venue_ja || a.venue_en : a.venue_en || a.venue_ja}
                    </p>
                    {(a.description_ja || a.description_en) && (
                      <p className="mt-3 text-muted-foreground whitespace-pre-line">
                        {lang === "ja" ? a.description_ja || a.description_en : a.description_en || a.description_ja}
                      </p>
                    )}
                  </div>
                  {a.link_url && (
                    <a href={a.link_url} target="_blank" rel="noreferrer" className="text-[11px] tracking-display text-gold hover:underline">
                      LINK →
                    </a>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
