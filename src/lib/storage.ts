import { supabase } from "@/integrations/supabase/client";

const BUCKET = "artist-media";

/** Upload an image file and return a long-lived signed URL. */
export async function uploadImage(file: File, folder: string): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
  });
  if (upErr) throw upErr;
  // 100 years
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, 60 * 60 * 24 * 365 * 100);
  if (error || !data) throw error ?? new Error("Failed to create signed URL");
  return data.signedUrl;
}
