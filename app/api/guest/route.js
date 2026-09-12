import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request) {
  try {
    const { guestId } = await request.json();
    if (!guestId) {
      return NextResponse.json({ error: "guestId wajib diisi" }, { status: 400 });
    }

    const { data: existing } = await supabase
      .from("guests")
      .select("*")
      .eq("id", guestId)
      .single();

    if (existing) {
      return NextResponse.json({
        id: existing.id,
        isPublic: existing.is_public,
        createdAt: existing.created_at,
      });
    }

    const { data: created, error } = await supabase
      .from("guests")
      .insert({ id: guestId })
      .select()
      .single();

    if (error) throw new Error(error.message);

    return NextResponse.json({
      id: created.id,
      isPublic: created.is_public,
      createdAt: created.created_at,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Gagal menyiapkan guest" }, { status: 500 });
  }
}
