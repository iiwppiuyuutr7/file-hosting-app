import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { supabase } from "@/lib/supabase";

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "files";
const TOTAL_QUOTA = 52428800; // 50 MB, kuota total situs

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const guestId = formData.get("guestId");

    if (!file) {
      return NextResponse.json({ error: "Tidak ada file yang dikirim" }, { status: 400 });
    }
    if (!guestId) {
      return NextResponse.json({ error: "guestId wajib diisi" }, { status: 400 });
    }

    const { data: guestRow } = await supabase.from("guests").select("id").eq("id", guestId).single();
    if (!guestRow) {
      await supabase.from("guests").insert({ id: guestId });
    }

    const { data: allSizes, error: usageError } = await supabase.from("files").select("size");
    if (usageError) throw new Error(usageError.message);

    const used = allSizes.reduce((sum, f) => sum + Number(f.size || 0), 0);
    if (used + file.size > TOTAL_QUOTA) {
      const sisaMB = Math.max(0, (TOTAL_QUOTA - used) / 1024 / 1024).toFixed(1);
      return NextResponse.json(
        { error: `Kuota penyimpanan situs penuh. Sisa ruang: ${sisaMB} MB` },
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

    if (uploadError) throw new Error(uploadError.message);

    const { data: inserted, error: dbError } = await supabase
      .from("files")
      .insert({
        id: fileId,
        original_name: file.name,
        storage_path: storagePath,
        size: file.size,
        mime_type: file.type,
        guest_id: guestId,
        created_at: new Date().toISOString(),
        expires_at: null,
      })
      .select()
      .single();

    if (dbError) {
      await supabase.storage.from(BUCKET).remove([storagePath]);
      throw new Error(dbError.message);
    }

    return NextResponse.json({
      id: inserted.id,
      name: inserted.original_name,
      size: inserted.size,
      mimeType: inserted.mime_type,
      createdAt: inserted.created_at,
      url: `${request.nextUrl.origin}/f/${inserted.id}`,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload gagal" }, { status: 500 });
  }
}
