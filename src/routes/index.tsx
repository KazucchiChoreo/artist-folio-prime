import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Slideshow } from "@/components/Slideshow";
import { STRINGS, useLang } from "@/lib/i18n";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ARTIST — Dancer & Choreographer" },
      { name: "description", content: "Official site. Dancer and choreographer based in Japan." },
      { property: "og:title", content: "ARTIST — Dancer & Choreographer" },
      { property: "og:description", content: "Official site. Dancer and choreographer based in Japan." },
    ],
  }),
  component: Home,
});

const MENU = [
  { to: "/news", key: "news" as const, num: "01" },
  { to: "/appearances", key: "appearances" as const, num: "02" },
  { to: "/choreography", key: "choreography" as const, num: "03" },
  { to: "/biography", key: "biography" as const, num: "04" },
  { to: "/record", key: "record" as const, num: "05" },
  { to: "/contact", key: "contact" as const, num: "06" },
];

const FALLBACK = [hero1, hero2, hero3];

function Home() {
  const { lang } = useLang();

  const { data: slides } = useQuery({
    queryKey: ["slideshow"],
    queryFn: async () => {
      const { data } = await supabase
        .from("slideshow_images")
        .select("image_url")
        .order("sort_order", { ascending: true });
      return data ?? [];
    },
  });

  const images = slides && slides.length > 0 ? slides.map((s) => s.image_url) : FALLBACK;

  const { data: latestNews } = useQuery({
    queryKey: ["latest-news"],
    queryFn: async () => {
      const { data } = await supabase
        .from("news")
        .select("id,title_ja,title_en,published_at")
        .order("published_at", { ascending: false })
        .limit(3);
      return data ?? [];
    },
  });

  return (
    <>
      {/* HERO */}
      <section className="relative h-screen w-full">
        <Slideshow images={images} />
        <div className="relative z-10 h-full flex flex-col justify-end pb-32 px-6 lg:px-10 max-w-7xl mx-auto">
          <p className="text-[11px] tracking-display text-gold mb-6 animate-fade-in">
            {lang === "ja" ? "ダンサー / 振付家" : "DANCER / CHOREOGRAPHER"}
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-light text-foreground max-w-4xl animate-fade-in">
            {lang === "ja" ? (
              <>身体で語る、<br />光の奥の物語。</>
            ) : (
              <>Stories told<br />through the body.</>
            )}
          </h1>
        </div>
        <div className="absolute bottom-8 right-6 lg:right-10 z-10 text-[10px] tracking-display text-muted-foreground">
          SCROLL ↓
        </div>
      </section>

      {/* MENU GRID */}
      <section className="py-24 lg:py-32 border-b hairline">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex items-end justify-between mb-16">
            <div>
              <p className="text-[11px] tracking-display text-gold mb-3">— INDEX</p>
              <h2 className="text-3xl md:text-5xl font-display font-light">
                {lang === "ja" ? "作品と活動" : "Works & Activities"}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
            {MENU.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="group relative bg-background hover:bg-card transition-colors duration-500 p-8 lg:p-10 min-h-[220px] flex flex-col justify-between"
              >
                <span className="text-[11px] tracking-display text-gold">{item.num}</span>
                <div>
                  <h3 className="text-2xl lg:text-3xl font-display font-light text-foreground group-hover:text-gold transition-colors">
                    {STRINGS.menu[item.key][lang]}
                  </h3>
                  <div className="mt-4 flex items-center gap-2 text-[11px] tracking-display text-muted-foreground group-hover:text-gold transition-colors">
                    {STRINGS.explore[lang]}
                    <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full bg-gold transition-all duration-700" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* LATEST NEWS strip */}
      {latestNews && latestNews.length > 0 && (
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="flex items-end justify-between mb-10">
              <p className="text-[11px] tracking-display text-gold">— LATEST</p>
              <Link to="/news" className="text-[11px] tracking-display text-muted-foreground hover:text-gold">
                {STRINGS.menu.news[lang]} →
              </Link>
            </div>
            <div className="space-y-px bg-border">
              {latestNews.map((n) => (
                <div key={n.id} className="bg-background py-6 flex flex-col md:flex-row md:items-center gap-3 md:gap-10">
                  <time className="text-xs tracking-display text-gold w-28 shrink-0">
                    {n.published_at}
                  </time>
                  <p className="text-foreground font-display text-lg">
                    {lang === "ja" ? n.title_ja || n.title_en : n.title_en || n.title_ja}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
