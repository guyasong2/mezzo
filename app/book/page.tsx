import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BookingForm } from "@/components/booking/booking-form";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Book a Session",
  description: "Schedule your photography session with our easy booking system.",
};

const generateTimeSlots = () => {
  const times = [];
  for (let hour = 9; hour <= 17; hour++) {
    times.push(`${hour.toString().padStart(2, "0")}:00`);
  }
  return times;
};

export default async function BookPage() {
  const supabase = await createClient();

  const { data: packages, error: packagesError } = await supabase
    .from("pricing_packages")
    .select("*")
    .eq("active", true)
    .order("sort_order");

  if (packagesError) {
    console.error("[Book] Failed to fetch packages:", JSON.stringify(packagesError));
    console.error("[Book] Supabase URL configured:", !!process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.error("[Book] Supabase anon key configured:", !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  } else {
    console.log("[Book] Fetched", packages?.length ?? 0, "active packages");
  }

  const { data: blockedDatesData } = await supabase
    .from("blocked_dates")
    .select("blocked_date");

  const blockedDates =
    blockedDatesData?.map((item) => new Date((item as { blocked_date: string }).blocked_date)) || [];

  const availableTimes = generateTimeSlots();

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen">
        <div className="py-10 sm:py-16 bg-gray-50">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
              Book Your Session
            </h1>
            <p className="text-base sm:text-lg text-gray-600">
              Let's create something beautiful together. Fill out the form below
              to schedule your photography session.
            </p>
          </div>
        </div>

        <div className="py-10 sm:py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            {packages && packages.length > 0 ? (
              <BookingForm
                packages={packages}
                availableTimes={availableTimes}
                blockedDates={blockedDates}
              />
            ) : (
              <div className="text-center py-8 sm:py-12">
                <p className="text-gray-500 mb-3 sm:mb-4 text-sm sm:text-base">
                  Booking system is currently being set up.
                </p>
                <p className="text-gray-500 text-sm sm:text-base">
                  Please contact us directly to schedule your session.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
