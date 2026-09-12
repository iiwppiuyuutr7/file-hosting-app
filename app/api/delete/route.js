import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "files";

export async function POST(request) {
  try {
    const { guestId, fileIds } = await request.json();

    if (!guestId || !Array.isArray(fileIds) || fileIds.length === 0) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    const { data: rows, error: fetchError } = await supabase
      .from("files")
      .select("id, storage_path, guest_id")
      .in("id", fileIds);

    if (fetchError) throw new Error(fetchError.message);

    const owned = rows.filter((r) => r.guest_id === guestId);
    if (owned.length === 0) {
      return NextResponse.json({ error: "Tidak ada file yang bisa dihapus" }, { status: 403 });
    }

    const paths = owned.map((r) => r.storage_path);
    await supabase.storage.from(BUCKET).remove(paths);

    const { error: deleteError } = await supabase
      .from("files")
      .delete()
      .in("id", owned.map((r) => r.id));

    if (deleteError) throw new Error(deleteError.message);

    return NextResponse.json({ deleted: owned.map((r) => r.id) });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Gagal menghapus file" }, { status: 500 });
  }
}
