import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { STRINGS, useLang, t, pick } from "@/lib/i18n";

export const Route = createFileRoute("/appearances")({
  head: () => ({
    meta: [
      { title: "Appearances — KAZUTCHI" },
      { name: "description", content: "Upcoming and past performances." },
      { property: "og:title", content: "Appearances — KAZUTCHI" },
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
      <PageHeader eyebrow="— 02 / APPEARANCES" title={t(STRINGS.menu.appearances, lang)} />
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-6 lg:px-10">
          {!data || data.length === 0 ? (
            <p className="text-muted-foreground">{t(STRINGS.noContent, lang)}</p>
          ) : (
            <div className="space-y-px bg-border">
              {data.map((a) => (
                <article key={a.id} className="bg-background py-8 px-2 grid grid-cols-1 md:grid-cols-[140px_1fr_auto] gap-4 md:gap-10 items-start">
                  <time className="text-xs tracking-display text-coral">{a.event_date || "TBA"}</time>
                  <div>
                    <h3 className="text-xl font-display text-foreground">
                      {pick(a, "title", lang)}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {pick(a, "venue", lang)}
                    </p>
                    {pick(a, "description", lang) && (
                      <p className="mt-3 text-muted-foreground whitespace-pre-line">
                        {pick(a, "description", lang)}
                      </p>
                    )}
                  </div>
                  {a.link_url && (
                    <a href={a.link_url} target="_blank" rel="noreferrer" className="text-[11px] tracking-display text-coral hover:underline">
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
