import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Instagram, Twitter, Youtube, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { useLang, pick } from "@/lib/i18n";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — KAZUTCHI" },
      { name: "description", content: "Contact and management information." },
      { property: "og:title", content: "Contact — KAZUTCHI" },
    ],
  }),
  component: ContactPage,
});

const TITLES = { ja: "お問い合わせ", en: "Contact", zh: "联系" } as const;

function ContactPage() {
  const { lang } = useLang();
  const { data } = useQuery({
    queryKey: ["contact"],
    queryFn: async () => {
      const { data } = await supabase.from("contact_info").select("*").limit(1).maybeSingle();
      return data;
    },
  });

  return (
    <>
      <PageHeader eyebrow="— 06 / CONTACT" title={TITLES[lang]} />
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-6 lg:px-10 space-y-12">
          {data?.email && (
            <div>
              <p className="text-[11px] tracking-display text-coral mb-3">EMAIL</p>
              <a href={`mailto:${data.email}`} className="text-2xl font-display text-foreground hover:text-coral inline-flex items-center gap-3">
                <Mail size={20} /> {data.email}
              </a>
            </div>
          )}
          {pick(data, "management", lang) && (
            <div>
              <p className="text-[11px] tracking-display text-coral mb-3">MANAGEMENT</p>
              <p className="text-lg text-foreground whitespace-pre-line">
                {pick(data, "management", lang)}
              </p>
            </div>
          )}
          {pick(data, "note", lang) && (
            <div>
              <p className="text-[11px] tracking-display text-coral mb-3">NOTE</p>
              <p className="text-muted-foreground whitespace-pre-line leading-loose">
                {pick(data, "note", lang)}
              </p>
            </div>
          )}
          <div>
            <p className="text-[11px] tracking-display text-coral mb-4">SOCIAL</p>
            <div className="flex gap-6">
              {data?.instagram && (
                <a href={data.instagram} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-coral">
                  <Instagram size={22} />
                </a>
              )}
              {data?.twitter && (
                <a href={data.twitter} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-coral">
                  <Twitter size={22} />
                </a>
              )}
              {data?.youtube && (
                <a href={data.youtube} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-coral">
                  <Youtube size={22} />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
