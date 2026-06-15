import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { STRINGS, useLang, t, pick } from "@/lib/i18n";

export const Route = createFileRoute("/choreography")({
  head: () => ({
    meta: [
      { title: "Record — KAZUTCHI" },
      { name: "description", content: "Selected works and activities." },
      { property: "og:title", content: "Record — KAZUTCHI" },
    ],
  }),
  component: ChoreographyPage,
});

function ChoreographyPage() {
  const { lang } = useLang();
  const { data } = useQuery({
    queryKey: ["choreography"],
    queryFn: async () => {
      const { data } = await supabase.from("choreography").select("*").order("year", { ascending: false });
      return data ?? [];
    },
  });

  return (
    <>
      <PageHeader eyebrow="— 02 / RECORD" title={t(STRINGS.menu.choreography, lang)} />
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          {!data || data.length === 0 ? (
            <p className="text-muted-foreground">{t(STRINGS.noContent, lang)}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.map((c) => (
                <article key={c.id} className="group">
                  {c.image_url ? (
                    <div className="aspect-[3/4] overflow-hidden bg-card rounded">
                      <img
                        src={c.image_url}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[3/4] bg-warm rounded" />
                  )}
                  <div className="mt-5">
                    <p className="text-[11px] tracking-display text-coral mb-2">{c.year ?? ""}</p>
                    <h3 className="text-xl font-display text-foreground">
                      {pick(c, "title", lang)}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {pick(c, "client", lang)}
                    </p>
                    {pick(c, "description", lang) && (
                      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                        {pick(c, "description", lang)}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
