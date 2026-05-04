import { supabase } from "@/integrations/supabase/client";

export async function uploadDoc(bucket: string, file: File, ownerTable: string, ownerId: string, docKind?: string) {
  const path = `${ownerId}/${Date.now()}-${file.name}`;
  const { error: upErr } = await supabase.storage.from(bucket).upload(path, file, { upsert: false });
  if (upErr) throw upErr;
  const { error: dbErr } = await supabase.from("documents").insert({
    owner_table: ownerTable,
    owner_id: ownerId,
    bucket,
    storage_path: path,
    file_name: file.name,
    file_type: file.type,
    doc_kind: docKind,
  });
  if (dbErr) throw dbErr;
}

export async function signedUrl(bucket: string, path: string) {
  const { data } = await supabase.storage.from(bucket).createSignedUrl(path, 60);
  return data?.signedUrl ?? null;
}
