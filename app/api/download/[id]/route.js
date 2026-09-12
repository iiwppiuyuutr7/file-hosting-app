import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "files";

export async function GET(request, { params }) {
  const { id } = params;

  const { data: file, error } = await supabase
    .from("files")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !file) {
    return NextResponse.json({ error: "File tidak ditemukan" }, { status: 404 });
  }

  const { data: signedData, error: signError } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(file.storage_path, 3600);

  if (signError) {
    return NextResponse.json({ error: "Gagal membuat link download" }, { status: 500 });
  }

  return NextResponse.json({
    name: file.original_name,
    size: file.size,
    mimeType: file.mime_type,
    downloadUrl: signedData.signedUrl,
  });
}
