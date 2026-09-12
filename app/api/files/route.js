import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const TOTAL_QUOTA = 52428800;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const guestId = searchParams.get("guestId");

  if (!guestId) {
    return NextResponse.json({ error: "guestId wajib diisi" }, { status: 400 });
  }

  const { data: files, error } = await supabase
    .from("files")
    .select("id, original_name, size, mime_type, created_at")
    .eq("guest_id", guestId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: allSizes, error: usageError } = await supabase.from("files").select("size");
  if (usageError) {
    return NextResponse.json({ error: usageError.message }, { status: 500 });
  }

  const used = allSizes.reduce((sum, f) => sum + Number(f.size || 0), 0);

  return NextResponse.json({ files, usage: { used, total: TOTAL_QUOTA } });
}
