import { createClient } from "@/lib/supabase/server";
import { PricingEditor } from "@/components/admin/pricing-editor";

export default async function AdminPricingPage() {
  const supabase = await createClient();

  const { data: packages } = await supabase
    .from("pricing_packages")
    .select("*")
    .order("sort_order");

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold mb-2">Pricing Management</h1>
        <p className="text-foreground/60">Manage your photography packages</p>
      </div>

      <PricingEditor packages={packages || []} />
    </div>
  );
}
