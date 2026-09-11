import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { supabase } from "@/lib/supabase";

const MAX_FILE_SIZE = Number(process.env.MAX_FILE_SIZE || 52428800);
const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "files";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "Tidak ada file yang dikirim" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File terlalu besar. Maksimal ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 413 }
      );
    }

    const fileId = nanoid(8);
    const buffer = Buffer.from(await file.arrayBuffer());
    const storagePath = `${fileId}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, buffer, {
        contentType: file.type || "application/octet-stream",
      });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const { error: dbError } = await supabase.from("files").insert({
      id: fileId,
      original_name: file.name,
      storage_path: storagePath,
      size: file.size,
      mime_type: file.type,
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });

    if (dbError) {
      await supabase.storage.from(BUCKET).remove([storagePath]);
      throw new Error(dbError.message);
    }

    return NextResponse.json({
      id: fileId,
      url: `${request.nextUrl.origin}/f/${fileId}`,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload gagal" }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
