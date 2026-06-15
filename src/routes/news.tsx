import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { STRINGS, useLang, t, pick } from "@/lib/i18n";

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "News — KAZUTCHI" },
      { name: "description", content: "Latest news and announcements from Kazutchi." },
      { property: "og:title", content: "News — KAZUTCHI" },
    ],
  }),
  component: NewsPage,
});

function NewsPage() {
  const { lang } = useLang();
  const { data } = useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      const { data } = await supabase.from("news").select("*").order("published_at", { ascending: false });
      return data ?? [];
    },
  });

  return (
    <>
      <PageHeader eyebrow="— 01 / NEWS" title={t(STRINGS.menu.news, lang)} />
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-10">
          {!data || data.length === 0 ? (
            <p className="text-muted-foreground">{t(STRINGS.noContent, lang)}</p>
          ) : (
            <div className="space-y-12">
              {data.map((n) => (
                <article key={n.id} className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-4 md:gap-10 pb-12 border-b hairline">
                  <time className="text-xs tracking-display text-coral pt-1">{n.published_at}</time>
                  <div>
                    <h2 className="text-2xl font-display font-normal text-foreground mb-3">
                      {pick(n, "title", lang)}
                    </h2>
                    {n.image_url && (
                      <img src={n.image_url} alt="" loading="lazy" className="my-4 w-full max-h-96 object-cover rounded" />
                    )}
                    <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                      {pick(n, "body", lang)}
                    </p>
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
