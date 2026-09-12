import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request, { params }) {
  const { guestId } = params;

  const { data: guest } = await supabase
    .from("guests")
    .select("id, is_public")
    .eq("id", guestId)
    .single();

  if (!guest || !guest.is_public) {
    return NextResponse.json({ isPublic: false });
  }

  const { data: files, error } = await supabase
    .from("files")
    .select("id, original_name, size, mime_type, created_at")
    .eq("guest_id", guestId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ isPublic: true, files });
}
