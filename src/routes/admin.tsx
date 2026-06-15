import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2, Plus, Upload, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { uploadImage } from "@/lib/storage";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — ARTIST" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

type Tab = "slideshow" | "news" | "appearances" | "choreography" | "biography" | "records" | "contact";

function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("slideshow");
  const { lang } = useLang();

  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/auth" });
    else if (!isAdmin) {
      toast.error(lang === "ja" ? "管理者権限がありません" : "Not an admin");
      navigate({ to: "/" });
    }
  }, [loading, user, isAdmin, navigate, lang]);

  if (loading || !user || !isAdmin) {
    return <div className="pt-32 px-6 text-muted-foreground">Loading…</div>;
  }

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "slideshow", label: "Slideshow" },
    { key: "news", label: "News" },
    { key: "appearances", label: "Appearances" },
    { key: "choreography", label: "Choreography" },
    { key: "biography", label: "Biography" },
    { key: "records", label: "Records" },
    { key: "contact", label: "Contact" },
  ];

  return (
    <div className="pt-24 pb-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-[11px] tracking-display text-gold">— ADMIN</p>
            <h1 className="text-3xl font-display mt-2">Dashboard</h1>
          </div>
          <button onClick={signOut} className="text-[11px] tracking-display text-muted-foreground hover:text-gold flex items-center gap-2">
            <LogOut size={14} /> LOGOUT
          </button>
        </div>

        <div className="flex flex-wrap gap-1 border-b hairline mb-10">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-3 text-[11px] tracking-display border-b-2 transition-colors ${
                tab === t.key ? "border-gold text-gold" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "slideshow" && <SlideshowAdmin />}
        {tab === "news" && <NewsAdmin />}
        {tab === "appearances" && <AppearancesAdmin />}
        {tab === "choreography" && <ChoreographyAdmin />}
        {tab === "biography" && <BiographyAdmin />}
        {tab === "records" && <RecordsAdmin />}
        {tab === "contact" && <ContactAdmin />}
      </div>
    </div>
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-[11px] tracking-display text-gold">{label}</span>
      <input {...props} className="mt-2 w-full bg-card border hairline px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-gold" />
    </label>
  );
}
function Area({ label, ...props }: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="block">
      <span className="text-[11px] tracking-display text-gold">{label}</span>
      <textarea {...props} className="mt-2 w-full bg-card border hairline px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-gold min-h-[100px]" />
    </label>
  );
}

function ImageUploader({ value, onChange, folder }: { value: string | null; onChange: (url: string | null) => void; folder: string }) {
  const [busy, setBusy] = useState(false);
  return (
    <div>
      <span className="text-[11px] tracking-display text-gold">IMAGE</span>
      <div className="mt-2 flex items-center gap-4">
        {value && <img src={value} alt="" className="h-20 w-20 object-cover bg-card" />}
        <label className="cursor-pointer inline-flex items-center gap-2 border hairline px-3 py-2 text-xs tracking-display hover:bg-card">
          <Upload size={14} /> {busy ? "..." : "UPLOAD"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              setBusy(true);
              try {
                const url = await uploadImage(f, folder);
                onChange(url);
                toast.success("Uploaded");
              } catch (err: any) {
                toast.error(err.message);
              } finally {
                setBusy(false);
              }
            }}
          />
        </label>
        {value && (
          <button onClick={() => onChange(null)} className="text-xs text-muted-foreground hover:text-destructive">
            Remove
          </button>
        )}
      </div>
    </div>
  );
}

/* ============ SLIDESHOW ============ */
function SlideshowAdmin() {
  const qc = useQueryClient();
  const { data, refetch } = useQuery({
    queryKey: ["admin-slideshow"],
    queryFn: async () => (await supabase.from("slideshow_images").select("*").order("sort_order")).data ?? [],
  });
  const [uploading, setUploading] = useState(false);

  const onUpload = async (f: File) => {
    setUploading(true);
    try {
      const url = await uploadImage(f, "slideshow");
      const order = (data?.length ?? 0) + 1;
      const { error } = await supabase.from("slideshow_images").insert({ image_url: url, sort_order: order });
      if (error) throw error;
      toast.success("Added");
      refetch();
      qc.invalidateQueries({ queryKey: ["slideshow"] });
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setUploading(false);
    }
  };

  const remove = async (id: string) => {
    await supabase.from("slideshow_images").delete().eq("id", id);
    refetch();
    qc.invalidateQueries({ queryKey: ["slideshow"] });
  };

  return (
    <div>
      <label className="cursor-pointer inline-flex items-center gap-2 border hairline px-4 py-3 text-xs tracking-display hover:bg-card mb-8">
        <Plus size={14} /> {uploading ? "Uploading..." : "ADD SLIDE"}
        <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])} />
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data?.map((s) => (
          <div key={s.id} className="relative group">
            <img src={s.image_url} alt="" className="w-full aspect-video object-cover bg-card" />
            <button onClick={() => remove(s.id)} className="absolute top-2 right-2 bg-destructive/90 text-destructive-foreground p-2 opacity-0 group-hover:opacity-100 transition">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============ Generic CRUD list helper ============ */
function useList(table: string, order: { col: string; asc: boolean }) {
  return useQuery({
    queryKey: ["admin", table],
    queryFn: async () => {
      const { data } = await (supabase as any).from(table).select("*").order(order.col, { ascending: order.asc });
      return (data ?? []) as any[];
    },
  });
}

/* ============ NEWS ============ */
function NewsAdmin() {
  const qc = useQueryClient();
  const { data, refetch } = useList("news", { col: "published_at", asc: false });
  const [edit, setEdit] = useState<any | null>(null);

  const save = async (row: any) => {
    const payload = { ...row };
    delete payload.created_at;
    delete payload.updated_at;
    const { error } = row.id
      ? await supabase.from("news").update(payload).eq("id", row.id)
      : await supabase.from("news").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setEdit(null);
    refetch();
    qc.invalidateQueries({ queryKey: ["news"] });
    qc.invalidateQueries({ queryKey: ["latest-news"] });
  };
  const remove = async (id: string) => {
    await supabase.from("news").delete().eq("id", id);
    refetch();
    qc.invalidateQueries({ queryKey: ["news"] });
  };

  if (edit) {
    return (
      <RowForm
        row={edit}
        onCancel={() => setEdit(null)}
        onSave={save}
        fields={(r, set) => (
          <>
            <Field label="DATE" type="date" value={r.published_at ?? ""} onChange={(e) => set({ published_at: e.target.value })} />
            <Field label="TITLE (JA)" value={r.title_ja ?? ""} onChange={(e) => set({ title_ja: e.target.value })} />
            <Field label="TITLE (EN)" value={r.title_en ?? ""} onChange={(e) => set({ title_en: e.target.value })} />
            <Area label="BODY (JA)" value={r.body_ja ?? ""} onChange={(e) => set({ body_ja: e.target.value })} />
            <Area label="BODY (EN)" value={r.body_en ?? ""} onChange={(e) => set({ body_en: e.target.value })} />
            <ImageUploader value={r.image_url} onChange={(url) => set({ image_url: url })} folder="news" />
          </>
        )}
      />
    );
  }

  return (
    <ListLayout
      items={data ?? []}
      onAdd={() => setEdit({ title_ja: "", title_en: "", body_ja: "", body_en: "", published_at: new Date().toISOString().slice(0, 10) })}
      renderItem={(n) => (
        <RowCard key={n.id} title={n.title_ja || n.title_en} subtitle={n.published_at} onEdit={() => setEdit(n)} onDelete={() => remove(n.id)} />
      )}
    />
  );
}

/* ============ APPEARANCES ============ */
function AppearancesAdmin() {
  const qc = useQueryClient();
  const { data, refetch } = useList("appearances", { col: "event_date", asc: false });
  const [edit, setEdit] = useState<any | null>(null);
  const save = async (row: any) => {
    const payload = { ...row };
    delete payload.created_at; delete payload.updated_at;
    const { error } = row.id ? await supabase.from("appearances").update(payload).eq("id", row.id) : await supabase.from("appearances").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved"); setEdit(null); refetch();
    qc.invalidateQueries({ queryKey: ["appearances"] });
  };
  const remove = async (id: string) => { await supabase.from("appearances").delete().eq("id", id); refetch(); qc.invalidateQueries({ queryKey: ["appearances"] }); };

  if (edit) return (
    <RowForm row={edit} onCancel={() => setEdit(null)} onSave={save} fields={(r, set) => (
      <>
        <Field label="DATE" type="date" value={r.event_date ?? ""} onChange={(e) => set({ event_date: e.target.value || null })} />
        <Field label="TITLE (JA)" value={r.title_ja ?? ""} onChange={(e) => set({ title_ja: e.target.value })} />
        <Field label="TITLE (EN)" value={r.title_en ?? ""} onChange={(e) => set({ title_en: e.target.value })} />
        <Field label="VENUE (JA)" value={r.venue_ja ?? ""} onChange={(e) => set({ venue_ja: e.target.value })} />
        <Field label="VENUE (EN)" value={r.venue_en ?? ""} onChange={(e) => set({ venue_en: e.target.value })} />
        <Area label="DESCRIPTION (JA)" value={r.description_ja ?? ""} onChange={(e) => set({ description_ja: e.target.value })} />
        <Area label="DESCRIPTION (EN)" value={r.description_en ?? ""} onChange={(e) => set({ description_en: e.target.value })} />
        <Field label="LINK URL" value={r.link_url ?? ""} onChange={(e) => set({ link_url: e.target.value })} />
        <ImageUploader value={r.image_url} onChange={(url) => set({ image_url: url })} folder="appearances" />
      </>
    )} />
  );

  return (
    <ListLayout items={data ?? []} onAdd={() => setEdit({ title_ja: "", title_en: "" })}
      renderItem={(a) => <RowCard key={a.id} title={a.title_ja || a.title_en} subtitle={a.event_date || "TBA"} onEdit={() => setEdit(a)} onDelete={() => remove(a.id)} />}
    />
  );
}

/* ============ CHOREOGRAPHY ============ */
function ChoreographyAdmin() {
  const qc = useQueryClient();
  const { data, refetch } = useList("choreography", { col: "year", asc: false });
  const [edit, setEdit] = useState<any | null>(null);
  const save = async (row: any) => {
    const payload = { ...row }; delete payload.created_at; delete payload.updated_at;
    if (payload.year === "") payload.year = null;
    const { error } = row.id ? await supabase.from("choreography").update(payload).eq("id", row.id) : await supabase.from("choreography").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved"); setEdit(null); refetch();
    qc.invalidateQueries({ queryKey: ["choreography"] });
  };
  const remove = async (id: string) => { await supabase.from("choreography").delete().eq("id", id); refetch(); qc.invalidateQueries({ queryKey: ["choreography"] }); };

  if (edit) return (
    <RowForm row={edit} onCancel={() => setEdit(null)} onSave={save} fields={(r, set) => (
      <>
        <Field label="YEAR" type="number" value={r.year ?? ""} onChange={(e) => set({ year: e.target.value === "" ? null : Number(e.target.value) })} />
        <Field label="TITLE (JA)" value={r.title_ja ?? ""} onChange={(e) => set({ title_ja: e.target.value })} />
        <Field label="TITLE (EN)" value={r.title_en ?? ""} onChange={(e) => set({ title_en: e.target.value })} />
        <Field label="CLIENT (JA)" value={r.client_ja ?? ""} onChange={(e) => set({ client_ja: e.target.value })} />
        <Field label="CLIENT (EN)" value={r.client_en ?? ""} onChange={(e) => set({ client_en: e.target.value })} />
        <Area label="DESCRIPTION (JA)" value={r.description_ja ?? ""} onChange={(e) => set({ description_ja: e.target.value })} />
        <Area label="DESCRIPTION (EN)" value={r.description_en ?? ""} onChange={(e) => set({ description_en: e.target.value })} />
        <Field label="VIDEO URL" value={r.video_url ?? ""} onChange={(e) => set({ video_url: e.target.value })} />
        <ImageUploader value={r.image_url} onChange={(url) => set({ image_url: url })} folder="choreography" />
      </>
    )} />
  );

  return (
    <ListLayout items={data ?? []} onAdd={() => setEdit({ title_ja: "", title_en: "", year: new Date().getFullYear() })}
      renderItem={(c) => <RowCard key={c.id} title={c.title_ja || c.title_en} subtitle={String(c.year ?? "")} image={c.image_url} onEdit={() => setEdit(c)} onDelete={() => remove(c.id)} />}
    />
  );
}

/* ============ BIOGRAPHY (single row) ============ */
function BiographyAdmin() {
  const qc = useQueryClient();
  const { data, refetch } = useQuery({
    queryKey: ["admin-bio"],
    queryFn: async () => (await supabase.from("biography").select("*").limit(1).maybeSingle()).data,
  });
  const [row, setRow] = useState<any>(null);
  useEffect(() => { if (data) setRow(data); }, [data]);

  if (!row) return <p className="text-muted-foreground">Loading…</p>;
  const set = (patch: any) => setRow({ ...row, ...patch });
  const save = async () => {
    const payload = { ...row }; delete payload.updated_at;
    const { error } = await supabase.from("biography").update(payload).eq("id", row.id);
    if (error) return toast.error(error.message);
    toast.success("Saved"); refetch();
    qc.invalidateQueries({ queryKey: ["biography"] });
  };

  return (
    <div className="space-y-5 max-w-2xl">
      <Field label="NAME (JA)" value={row.name_ja ?? ""} onChange={(e) => set({ name_ja: e.target.value })} />
      <Field label="NAME (EN)" value={row.name_en ?? ""} onChange={(e) => set({ name_en: e.target.value })} />
      <Area label="BIO (JA)" value={row.body_ja ?? ""} onChange={(e) => set({ body_ja: e.target.value })} />
      <Area label="BIO (EN)" value={row.body_en ?? ""} onChange={(e) => set({ body_en: e.target.value })} />
      <ImageUploader value={row.portrait_url} onChange={(url) => set({ portrait_url: url })} folder="bio" />
      <button onClick={save} className="bg-gold text-primary-foreground px-6 py-3 text-xs tracking-display">SAVE</button>
    </div>
  );
}

/* ============ RECORDS ============ */
function RecordsAdmin() {
  const qc = useQueryClient();
  const { data, refetch } = useList("records", { col: "release_date", asc: false });
  const [edit, setEdit] = useState<any | null>(null);
  const save = async (row: any) => {
    const payload = { ...row }; delete payload.created_at; delete payload.updated_at;
    if (payload.release_date === "") payload.release_date = null;
    const { error } = row.id ? await supabase.from("records").update(payload).eq("id", row.id) : await supabase.from("records").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved"); setEdit(null); refetch();
    qc.invalidateQueries({ queryKey: ["records"] });
  };
  const remove = async (id: string) => { await supabase.from("records").delete().eq("id", id); refetch(); qc.invalidateQueries({ queryKey: ["records"] }); };

  if (edit) return (
    <RowForm row={edit} onCancel={() => setEdit(null)} onSave={save} fields={(r, set) => (
      <>
        <Field label="RELEASE DATE" type="date" value={r.release_date ?? ""} onChange={(e) => set({ release_date: e.target.value || null })} />
        <Field label="TITLE (JA)" value={r.title_ja ?? ""} onChange={(e) => set({ title_ja: e.target.value })} />
        <Field label="TITLE (EN)" value={r.title_en ?? ""} onChange={(e) => set({ title_en: e.target.value })} />
        <Field label="FORMAT (JA)" value={r.format_ja ?? ""} onChange={(e) => set({ format_ja: e.target.value })} placeholder="EP / Single / Album" />
        <Field label="FORMAT (EN)" value={r.format_en ?? ""} onChange={(e) => set({ format_en: e.target.value })} />
        <Area label="DESCRIPTION (JA)" value={r.description_ja ?? ""} onChange={(e) => set({ description_ja: e.target.value })} />
        <Area label="DESCRIPTION (EN)" value={r.description_en ?? ""} onChange={(e) => set({ description_en: e.target.value })} />
        <Field label="LINK URL" value={r.link_url ?? ""} onChange={(e) => set({ link_url: e.target.value })} />
        <ImageUploader value={r.cover_url} onChange={(url) => set({ cover_url: url })} folder="records" />
      </>
    )} />
  );

  return (
    <ListLayout items={data ?? []} onAdd={() => setEdit({ title_ja: "", title_en: "" })}
      renderItem={(r) => <RowCard key={r.id} title={r.title_ja || r.title_en} subtitle={r.release_date || ""} image={r.cover_url} onEdit={() => setEdit(r)} onDelete={() => remove(r.id)} />}
    />
  );
}

/* ============ CONTACT (single row) ============ */
function ContactAdmin() {
  const qc = useQueryClient();
  const { data, refetch } = useQuery({
    queryKey: ["admin-contact"],
    queryFn: async () => (await supabase.from("contact_info").select("*").limit(1).maybeSingle()).data,
  });
  const [row, setRow] = useState<any>(null);
  useEffect(() => { if (data) setRow(data); }, [data]);
  if (!row) return <p className="text-muted-foreground">Loading…</p>;
  const set = (patch: any) => setRow({ ...row, ...patch });
  const save = async () => {
    const payload = { ...row }; delete payload.updated_at;
    const { error } = await supabase.from("contact_info").update(payload).eq("id", row.id);
    if (error) return toast.error(error.message);
    toast.success("Saved"); refetch();
    qc.invalidateQueries({ queryKey: ["contact"] });
  };
  return (
    <div className="space-y-5 max-w-2xl">
      <Field label="EMAIL" value={row.email ?? ""} onChange={(e) => set({ email: e.target.value })} />
      <Area label="MANAGEMENT (JA)" value={row.management_ja ?? ""} onChange={(e) => set({ management_ja: e.target.value })} />
      <Area label="MANAGEMENT (EN)" value={row.management_en ?? ""} onChange={(e) => set({ management_en: e.target.value })} />
      <Field label="INSTAGRAM URL" value={row.instagram ?? ""} onChange={(e) => set({ instagram: e.target.value })} />
      <Field label="TWITTER URL" value={row.twitter ?? ""} onChange={(e) => set({ twitter: e.target.value })} />
      <Field label="YOUTUBE URL" value={row.youtube ?? ""} onChange={(e) => set({ youtube: e.target.value })} />
      <Area label="NOTE (JA)" value={row.note_ja ?? ""} onChange={(e) => set({ note_ja: e.target.value })} />
      <Area label="NOTE (EN)" value={row.note_en ?? ""} onChange={(e) => set({ note_en: e.target.value })} />
      <button onClick={save} className="bg-gold text-primary-foreground px-6 py-3 text-xs tracking-display">SAVE</button>
    </div>
  );
}

/* ============ helpers ============ */
function ListLayout({ items, onAdd, renderItem }: { items: any[]; onAdd: () => void; renderItem: (i: any) => React.ReactNode }) {
  return (
    <div>
      <button onClick={onAdd} className="inline-flex items-center gap-2 border hairline px-4 py-3 text-xs tracking-display hover:bg-card mb-8">
        <Plus size={14} /> NEW
      </button>
      {items.length === 0 ? (
        <p className="text-muted-foreground">No items yet.</p>
      ) : (
        <div className="space-y-px bg-border">{items.map(renderItem)}</div>
      )}
    </div>
  );
}

function RowCard({ title, subtitle, image, onEdit, onDelete }: { title: string; subtitle?: string; image?: string | null; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="bg-background py-4 px-4 flex items-center gap-4">
      {image ? (
        <img src={image} alt="" className="h-14 w-14 object-cover bg-card" />
      ) : (
        <div className="h-14 w-14 bg-card" />
      )}
      <div className="flex-1 min-w-0">
        <p className="font-display text-lg text-foreground truncate">{title || "(untitled)"}</p>
        {subtitle && <p className="text-xs tracking-display text-gold mt-1">{subtitle}</p>}
      </div>
      <button onClick={onEdit} className="text-xs tracking-display text-muted-foreground hover:text-gold">EDIT</button>
      <button onClick={() => confirm("Delete?") && onDelete()} className="text-muted-foreground hover:text-destructive">
        <Trash2 size={16} />
      </button>
    </div>
  );
}

function RowForm({
  row,
  onSave,
  onCancel,
  fields,
}: {
  row: any;
  onSave: (r: any) => void;
  onCancel: () => void;
  fields: (r: any, set: (patch: any) => void) => React.ReactNode;
}) {
  const [r, setR] = useState<any>(row);
  const set = (patch: any) => setR({ ...r, ...patch });
  return (
    <div className="space-y-5 max-w-2xl">
      {fields(r, set)}
      <div className="flex gap-3 pt-4">
        <button onClick={() => onSave(r)} className="bg-gold text-primary-foreground px-6 py-3 text-xs tracking-display">SAVE</button>
        <button onClick={onCancel} className="border hairline px-6 py-3 text-xs tracking-display hover:bg-card">CANCEL</button>
      </div>
    </div>
  );
}
