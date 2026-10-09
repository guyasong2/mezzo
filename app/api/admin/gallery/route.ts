import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import cloudinary from "@/lib/cloudinary/config";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const { data, error } = await supabase
      .from("gallery_images")
      .insert({
        image_url: body.image_url,
        storage_path: body.storage_path,
        alt_text: body.alt_text,
        title: body.title || null,
        description: body.description || null,
        category_id: body.category_id || null,
        featured: body.featured || false,
        width: body.width || null,
        height: body.height || null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Gallery POST error:", error);
    return NextResponse.json({ error: "Failed to save image" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { id, ...updates } = body;

    const { data, error } = await supabase
      .from("gallery_images")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Gallery PATCH error:", error);
    return NextResponse.json({ error: "Failed to update image" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { id, storagePath } = await request.json();

    try {
      await cloudinary.uploader.destroy(storagePath);
    } catch (cloudinaryError) {
      console.error("Cloudinary delete error:", cloudinaryError);
    }

    const { error } = await supabase
      .from("gallery_images")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Gallery DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}
