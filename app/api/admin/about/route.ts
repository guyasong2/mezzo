import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const { data: aboutText } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "about_text")
    .single();

  const { data: aboutImage } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "about_image")
    .single();

  return NextResponse.json({
    text: aboutText?.value ?? null,
    image: aboutImage?.value ?? null,
  });
}

export async function PUT(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { heading, paragraphs, stats, image_url } = body;

  const textValue = { heading, paragraphs, stats };

  const { error: textError } = await supabase
    .from("site_settings")
    .upsert(
      { key: "about_text", value: textValue, description: "About section text content" },
      { onConflict: "key" }
    );

  if (textError) {
    return NextResponse.json({ error: textError.message }, { status: 500 });
  }

  if (image_url !== undefined) {
    const { error: imageError } = await supabase
      .from("site_settings")
      .upsert(
        { key: "about_image", value: { url: image_url }, description: "About section image" },
        { onConflict: "key" }
      );

    if (imageError) {
      return NextResponse.json({ error: imageError.message }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}
