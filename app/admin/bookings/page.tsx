import { createClient } from "@/lib/supabase/server";
import { BookingsTable } from "@/components/admin/bookings-table";

export default async function AdminBookingsPage() {
  const supabase = await createClient();

  const { data: bookings } = await supabase
    .from("bookings")
    .select(`
      *,
      pricing_packages (
        name,
        price
      )
    `)
    .order("created_at", { ascending: false });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold mb-2">Bookings Management</h1>
        <p className="text-foreground/60">View and manage client bookings</p>
      </div>

      <BookingsTable bookings={bookings || []} />
    </div>
  );
}
