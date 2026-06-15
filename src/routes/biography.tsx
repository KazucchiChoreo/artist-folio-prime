import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { useLang } from "@/lib/i18n";
import portrait from "@/assets/portrait.jpg";

export const Route = createFileRoute("/biography")({
  head: () => ({
    meta: [
      { title: "Biography — ARTIST" },
      { name: "description", content: "About ARTIST — biography and background." },
      { property: "og:title", content: "Biography — ARTIST" },
    ],
  }),
  component: BiographyPage,
});

function BiographyPage() {
  const { lang } = useLang();
  const { data } = useQuery({
    queryKey: ["biography"],
    queryFn: async () => {
      const { data } = await supabase.from("biography").select("*").limit(1).maybeSingle();
      return data;
    },
  });

  const img = data?.portrait_url || portrait;
  const name = data ? (lang === "ja" ? data.name_ja || data.name_en : data.name_en || data.name_ja) : "Artist";
  const body = data ? (lang === "ja" ? data.body_ja || data.body_en : data.body_en || data.body_ja) : "";

  return (
    <>
      <PageHeader eyebrow="— 04 / BIOGRAPHY" title={lang === "ja" ? "プロフィール" : "Biography"} />
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-10 grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20">
          <div className="aspect-[4/5] overflow-hidden bg-card">
            <img src={img} alt={name} className="h-full w-full object-cover" />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-light mb-8">{name}</h2>
            <div className="prose prose-invert text-muted-foreground leading-loose whitespace-pre-line">
              {body}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
