import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { STRINGS, useLang } from "@/lib/i18n";

export const Route = createFileRoute("/choreography")({
  head: () => ({
    meta: [
      { title: "Choreography — ARTIST" },
      { name: "description", content: "Selected choreography works by ARTIST." },
      { property: "og:title", content: "Choreography — ARTIST" },
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
      <PageHeader eyebrow="— 03 / CHOREOGRAPHY" title={lang === "ja" ? "振付作品" : "Choreography"} />
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          {!data || data.length === 0 ? (
            <p className="text-muted-foreground">{STRINGS.noContent[lang]}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.map((c) => (
                <article key={c.id} className="group">
                  {c.image_url ? (
                    <div className="aspect-[3/4] overflow-hidden bg-card">
                      <img
                        src={c.image_url}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[3/4] bg-card" />
                  )}
                  <div className="mt-5">
                    <p className="text-[11px] tracking-display text-gold mb-2">{c.year ?? ""}</p>
                    <h3 className="text-xl font-display text-foreground">
                      {lang === "ja" ? c.title_ja || c.title_en : c.title_en || c.title_ja}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {lang === "ja" ? c.client_ja || c.client_en : c.client_en || c.client_ja}
                    </p>
                    {(c.description_ja || c.description_en) && (
                      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                        {lang === "ja" ? c.description_ja || c.description_en : c.description_en || c.description_ja}
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
