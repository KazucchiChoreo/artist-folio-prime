import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Instagram, Twitter, Youtube, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — ARTIST" },
      { name: "description", content: "Contact and management information." },
      { property: "og:title", content: "Contact — ARTIST" },
    ],
  }),
  component: ContactPage,
});

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
      <PageHeader eyebrow="— 06 / CONTACT" title={lang === "ja" ? "お問い合わせ" : "Contact"} />
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-6 lg:px-10 space-y-12">
          {data?.email && (
            <div>
              <p className="text-[11px] tracking-display text-gold mb-3">EMAIL</p>
              <a href={`mailto:${data.email}`} className="text-2xl font-display text-foreground hover:text-gold inline-flex items-center gap-3">
                <Mail size={20} /> {data.email}
              </a>
            </div>
          )}
          {(data?.management_ja || data?.management_en) && (
            <div>
              <p className="text-[11px] tracking-display text-gold mb-3">MANAGEMENT</p>
              <p className="text-lg text-foreground whitespace-pre-line">
                {lang === "ja" ? data.management_ja || data.management_en : data.management_en || data.management_ja}
              </p>
            </div>
          )}
          {(data?.note_ja || data?.note_en) && (
            <div>
              <p className="text-[11px] tracking-display text-gold mb-3">NOTE</p>
              <p className="text-muted-foreground whitespace-pre-line leading-loose">
                {lang === "ja" ? data.note_ja || data.note_en : data.note_en || data.note_ja}
              </p>
            </div>
          )}
          <div>
            <p className="text-[11px] tracking-display text-gold mb-4">SOCIAL</p>
            <div className="flex gap-6">
              {data?.instagram && (
                <a href={data.instagram} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-gold">
                  <Instagram size={22} />
                </a>
              )}
              {data?.twitter && (
                <a href={data.twitter} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-gold">
                  <Twitter size={22} />
                </a>
              )}
              {data?.youtube && (
                <a href={data.youtube} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-gold">
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
