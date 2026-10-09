import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { createClient } from "@/lib/supabase/server";
import { PricingSection } from "@/components/pricing/pricing-section";
import Link from "next/link";

export const metadata = {
  title: "Pricing",
  description: "Flexible photography packages designed to capture your most important moments.",
};

export default async function PricingPage() {
  const supabase = await createClient();

  const { data: packages } = await supabase
    .from("pricing_packages")
    .select("*")
    .eq("active", true)
    .order("sort_order");

  return (
    <>
      <Navbar />
      <main className="pt-20">
        {packages && packages.length > 0 ? (
          <PricingSection packages={packages} />
        ) : (
          <div className="py-16 sm:py-24 text-center px-4">
            <p className="text-gray-500 mb-6 sm:mb-8">
              Pricing information will be available soon.
            </p>
            <Link
              href="/contact"
              className="px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base border-2 border-black text-black font-semibold hover:bg-black hover:text-white transition-all duration-300 touch-manipulation"
            >
              Contact for Custom Quote
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
