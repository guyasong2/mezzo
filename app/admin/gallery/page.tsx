import { createClient } from "@/lib/supabase/server";
import { GalleryManager } from "@/components/admin/gallery-manager";

export default async function AdminGalleryPage() {
  const supabase = await createClient();

  const [{ data: images }, { data: categories }] = await Promise.all([
    supabase.from("gallery_images").select("*").order("sort_order"),
    supabase.from("categories").select("*").order("sort_order"),
  ]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold mb-2">Gallery Management</h1>
        <p className="text-foreground/60">Upload and manage your portfolio images</p>
      </div>

      <GalleryManager images={images || []} categories={categories || []} />
    </div>
  );
}
