import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { STRINGS, useLang } from "@/lib/i18n";

export const Route = createFileRoute("/record")({
  head: () => ({
    meta: [
      { title: "Record — ARTIST" },
      { name: "description", content: "Releases and recordings." },
      { property: "og:title", content: "Record — ARTIST" },
    ],
  }),
  component: RecordPage,
});

function RecordPage() {
  const { lang } = useLang();
  const { data } = useQuery({
    queryKey: ["records"],
    queryFn: async () => {
      const { data } = await supabase.from("records").select("*").order("release_date", { ascending: false });
      return data ?? [];
    },
  });

  return (
    <>
      <PageHeader eyebrow="— 05 / RECORD" title={lang === "ja" ? "リリース" : "Record"} />
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          {!data || data.length === 0 ? (
            <p className="text-muted-foreground">{STRINGS.noContent[lang]}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {data.map((r) => (
                <article key={r.id}>
                  <div className="aspect-square bg-card overflow-hidden">
                    {r.cover_url && <img src={r.cover_url} alt="" loading="lazy" className="h-full w-full object-cover" />}
                  </div>
                  <p className="text-[11px] tracking-display text-gold mt-4">{r.release_date || ""}</p>
                  <h3 className="text-xl font-display text-foreground mt-2">
                    {lang === "ja" ? r.title_ja || r.title_en : r.title_en || r.title_ja}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {lang === "ja" ? r.format_ja || r.format_en : r.format_en || r.format_ja}
                  </p>
                  {(r.description_ja || r.description_en) && (
                    <p className="text-sm text-muted-foreground mt-3">
                      {lang === "ja" ? r.description_ja || r.description_en : r.description_en || r.description_ja}
                    </p>
                  )}
                  {r.link_url && (
                    <a href={r.link_url} target="_blank" rel="noreferrer" className="inline-block mt-4 text-[11px] tracking-display text-gold hover:underline">
                      LISTEN →
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
