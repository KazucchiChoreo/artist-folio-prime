import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Instagram, Twitter, Youtube, Sparkles, Mic, MessageCircle, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { useLang, pick } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — KAZUTCHI" },
      { name: "description", content: "Booking inquiries and contact form." },
      { property: "og:title", content: "Contact — KAZUTCHI" },
    ],
  }),
  component: ContactPage,
});

type InquiryType = "choreography" | "appearance" | "other";

const T = {
  ja: {
    title: "お問い合わせ",
    eyebrow: "— 06 / CONTACT",
    intro: "下記のフォームよりお気軽にご連絡ください。内容を確認後、ご返信いたします。",
    types: {
      choreography: { label: "振付の依頼", desc: "アーティスト・MV・ステージ・アイドルなどの振付制作" },
      appearance: { label: "出演オファー", desc: "イベント・舞台・メディア出演のご依頼" },
      other: { label: "その他のお問い合わせ", desc: "取材・コラボ・ワークショップ等" },
    },
    fields: {
      name: "お名前", email: "メールアドレス", organization: "会社・団体名", phone: "電話番号",
      eventDate: "希望日 / 公演日", budget: "ご予算", subject: "件名", message: "詳細・ご依頼内容",
    },
    required: "必須", optional: "任意",
    submit: "送信する", sending: "送信中…",
    success: "送信ありがとうございました。改めてご連絡いたします。",
    error: "送信に失敗しました。時間をおいて再度お試しください。",
    social: "SOCIAL",
  },
  en: {
    title: "Contact",
    eyebrow: "— 06 / CONTACT",
    intro: "Please use the form below. We'll get back to you after reviewing your inquiry.",
    types: {
      choreography: { label: "Choreography Inquiry", desc: "Artists, MV, stage productions, idol groups" },
      appearance: { label: "Appearance Offer", desc: "Events, stage, media appearances" },
      other: { label: "Other Inquiry", desc: "Press, collaboration, workshops, etc." },
    },
    fields: {
      name: "Name", email: "Email", organization: "Company / Org.", phone: "Phone",
      eventDate: "Preferred / Event Date", budget: "Budget", subject: "Subject", message: "Details",
    },
    required: "required", optional: "optional",
    submit: "Send", sending: "Sending…",
    success: "Thank you for your message. We'll be in touch.",
    error: "Failed to send. Please try again later.",
    social: "SOCIAL",
  },
  zh: {
    title: "联系",
    eyebrow: "— 06 / CONTACT",
    intro: "请通过下方表单与我们联系，我们会在确认后尽快回复。",
    types: {
      choreography: { label: "编舞委托", desc: "艺人、MV、舞台、偶像团体的编舞制作" },
      appearance: { label: "演出邀请", desc: "活动、舞台、媒体演出邀约" },
      other: { label: "其他咨询", desc: "采访、合作、工作坊等" },
    },
    fields: {
      name: "姓名", email: "邮箱", organization: "公司 / 机构", phone: "电话",
      eventDate: "希望 / 演出日期", budget: "预算", subject: "主题", message: "详细内容",
    },
    required: "必填", optional: "选填",
    submit: "发送", sending: "发送中…",
    success: "感谢您的留言，我们会尽快回复。",
    error: "发送失败，请稍后重试。",
    social: "SOCIAL",
  },
} as const;

function ContactPage() {
  const { lang } = useLang();
  const t = T[lang];
  const [type, setType] = useState<InquiryType>("choreography");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", organization: "", phone: "",
    event_date: "", budget: "", subject: "", message: "",
  });

  const { data } = useQuery({
    queryKey: ["contact"],
    queryFn: async () => {
      const { data } = await supabase.from("contact_info").select("*").limit(1).maybeSingle();
      return data;
    },
  });

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error(t.error);
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("contact_submissions").insert({
      inquiry_type: type,
      name: form.name.trim(),
      email: form.email.trim(),
      organization: form.organization.trim() || null,
      phone: form.phone.trim() || null,
      event_date: form.event_date || null,
      budget: form.budget.trim() || null,
      subject: form.subject.trim() || null,
      message: form.message.trim(),
      lang,
    });
    setSubmitting(false);
    if (error) {
      toast.error(t.error);
      return;
    }
    // Best-effort: trigger notification email (no-op if not configured yet)
    try {
      await fetch("/api/public/contact-notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, inquiry_type: type, lang }),
      });
    } catch {}
    setDone(true);
    setForm({ name: "", email: "", organization: "", phone: "", event_date: "", budget: "", subject: "", message: "" });
  };

  const typeIcons: Record<InquiryType, React.ReactNode> = {
    choreography: <Sparkles size={18} />,
    appearance: <Mic size={18} />,
    other: <MessageCircle size={18} />,
  };

  const showChoreoFields = type === "choreography";
  const showAppearanceFields = type === "appearance";

  return (
    <>
      <PageHeader eyebrow={t.eyebrow} title={t.title} />
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-6 lg:px-10">
          <p className="text-muted-foreground leading-loose mb-10">{t.intro}</p>

          {/* Inquiry type selector */}
          <div className="grid sm:grid-cols-3 gap-3 mb-10">
            {(["choreography", "appearance", "other"] as InquiryType[]).map((k) => {
              const active = type === k;
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => { setType(k); setDone(false); }}
                  className={`text-left rounded-2xl border p-4 transition-all ${
                    active
                      ? "border-coral bg-coral/5 shadow-sm"
                      : "border-border bg-card hover:border-coral/40"
                  }`}
                >
                  <div className={`flex items-center gap-2 mb-2 ${active ? "text-coral" : "text-foreground"}`}>
                    {typeIcons[k]}
                    <span className="font-display text-base">{t.types[k].label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{t.types[k].desc}</p>
                </button>
              );
            })}
          </div>

          {done ? (
            <div className="rounded-2xl border border-coral/30 bg-coral/5 p-8 text-center">
              <CheckCircle2 className="mx-auto mb-3 text-coral" size={40} />
              <p className="text-foreground">{t.success}</p>
              <Button variant="ghost" className="mt-4" onClick={() => setDone(false)}>
                ↺
              </Button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-5 rounded-2xl border border-border bg-card p-6 sm:p-8">
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label={t.fields.name} required hint={t.required}>
                  <Input required value={form.name} onChange={update("name")} maxLength={200} />
                </Field>
                <Field label={t.fields.email} required hint={t.required}>
                  <Input type="email" required value={form.email} onChange={update("email")} maxLength={320} />
                </Field>
                <Field label={t.fields.organization} hint={t.optional}>
                  <Input value={form.organization} onChange={update("organization")} maxLength={200} />
                </Field>
                <Field label={t.fields.phone} hint={t.optional}>
                  <Input value={form.phone} onChange={update("phone")} maxLength={50} />
                </Field>
                {(showChoreoFields || showAppearanceFields) && (
                  <>
                    <Field label={t.fields.eventDate} hint={t.optional}>
                      <Input type="date" value={form.event_date} onChange={update("event_date")} />
                    </Field>
                    <Field label={t.fields.budget} hint={t.optional}>
                      <Input value={form.budget} onChange={update("budget")} maxLength={100} />
                    </Field>
                  </>
                )}
                <div className="sm:col-span-2">
                  <Field label={t.fields.subject} hint={t.optional}>
                    <Input value={form.subject} onChange={update("subject")} maxLength={200} />
                  </Field>
                </div>
                <div className="sm:col-span-2">
                  <Field label={t.fields.message} required hint={t.required}>
                    <Textarea required rows={6} value={form.message} onChange={update("message")} maxLength={5000} />
                  </Field>
                </div>
              </div>

              <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
                {submitting ? <><Loader2 className="mr-2 animate-spin" size={16} />{t.sending}</> : t.submit}
              </Button>
            </form>
          )}

          {/* Social only — email is intentionally not public */}
          <div className="mt-14">
            <p className="text-[11px] tracking-display text-coral mb-4">{t.social}</p>
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
            {pick(data, "management", lang) && (
              <p className="text-sm text-muted-foreground whitespace-pre-line mt-8 leading-loose">
                {pick(data, "management", lang)}
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function Field({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs tracking-wide text-foreground/80 flex items-center gap-2">
        {label}
        {hint && (
          <span className={`text-[10px] uppercase tracking-display ${required ? "text-coral" : "text-muted-foreground"}`}>
            {hint}
          </span>
        )}
      </Label>
      {children}
    </div>
  );
}
