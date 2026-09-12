import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request) {
  try {
    const { guestId, isPublic } = await request.json();

    if (!guestId || typeof isPublic !== "boolean") {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("guests")
      .update({ is_public: isPublic })
      .eq("id", guestId)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return NextResponse.json({ id: data.id, isPublic: data.is_public });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Gagal mengubah status share" }, { status: 500 });
  }
}
