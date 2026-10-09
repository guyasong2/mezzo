import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");

    let query = supabase
      .from("gallery_images")
      .select(`
        *,
        category:categories(name, slug)
      `)
      .order("sort_order");

    if (category) {
      // Join with categories to filter by slug
      const { data: categoryData } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", category)
        .single();

      if (categoryData) {
        query = query.eq("category_id", categoryData.id);
      }
    }

    if (featured === "true") {
      query = query.eq("featured", true);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ data: data || [] }, { status: 200 });
  } catch (error) {
    console.error("Error fetching gallery:", error);
    return NextResponse.json(
      { error: "Failed to fetch gallery images" },
      { status: 500 }
    );
  }
}
