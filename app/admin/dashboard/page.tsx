import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Image, DollarSign, Calendar, Eye } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: totalImages },
    { count: totalBookings },
    { count: pendingBookings },
    { data: packages },
  ] = await Promise.all([
    supabase.from("gallery_images").select("*", { count: "exact", head: true }),
    supabase.from("bookings").select("*", { count: "exact", head: true }),
    supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase.from("pricing_packages").select("*").eq("active", true),
  ]);

  const stats = [
    {
      name: "Total Images",
      value: totalImages || 0,
      icon: Image,
      color: "text-blue-600",
    },
    {
      name: "Total Bookings",
      value: totalBookings || 0,
      icon: Calendar,
      color: "text-green-600",
    },
    {
      name: "Pending Bookings",
      value: pendingBookings || 0,
      icon: Eye,
      color: "text-orange-600",
    },
    {
      name: "Active Packages",
      value: packages?.length || 0,
      icon: DollarSign,
      color: "text-gold",
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-foreground/60">Welcome back to your admin panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.name}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.name}
                </CardTitle>
                <Icon className={cn("h-4 w-4", stat.color)} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <a
              href="/admin/gallery"
              className="block p-4 border border-border hover:border-gold transition-colors"
            >
              <div className="font-medium">Manage Gallery</div>
              <div className="text-sm text-foreground/60">
                Upload and organize images
              </div>
            </a>
            <a
              href="/admin/bookings"
              className="block p-4 border border-border hover:border-gold transition-colors"
            >
              <div className="font-medium">View Bookings</div>
              <div className="text-sm text-foreground/60">
                Manage client bookings
              </div>
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-foreground/60">
              Activity log will appear here
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
