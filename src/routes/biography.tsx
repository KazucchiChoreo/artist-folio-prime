import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { useLang, pick } from "@/lib/i18n";

export const Route = createFileRoute("/biography")({
  head: () => ({
    meta: [
      { title: "Biography — KAZUTCHI" },
      { name: "description", content: "About Kazutchi — pro dancer & choreographer." },
      { property: "og:title", content: "Biography — KAZUTCHI" },
    ],
  }),
  component: BiographyPage,
});

const TITLES = {
  ja: "プロフィール",
  en: "Biography",
  zh: "个人简介",
} as const;

function BiographyPage() {
  const { lang } = useLang();
  const { data } = useQuery({
    queryKey: ["biography"],
    queryFn: async () => {
      const { data } = await supabase.from("biography").select("*").limit(1).maybeSingle();
      return data;
    },
  });

  const img = data?.portrait_url || null;
  const name = pick(data, "name", lang) || "Kazutchi";
  const body = pick(data, "body", lang);

  return (
    <>
      <PageHeader eyebrow="— 04 / BIOGRAPHY" title={TITLES[lang]} />
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-10 grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20">
          <div className="aspect-[4/5] overflow-hidden bg-card rounded-md shadow-sm">
          {img && <img src={img} alt={name} className="h-full w-full object-cover" />}
          </div>
          <div>
            <p className="text-[11px] tracking-display text-coral mb-3">PROFILE</p>
            <h2 className="text-3xl md:text-4xl font-display font-normal mb-8">{name}</h2>
            <div className="text-muted-foreground leading-loose whitespace-pre-line">
              {body}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
