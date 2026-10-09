"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Calendar, Mail, Phone, MapPin } from "lucide-react";

interface Booking {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  location: string | null;
  session_date: string;
  session_time: string;
  message: string | null;
  status: string;
  created_at: string;
  pricing_packages: {
    name: string;
    price: number;
  } | null;
}

interface BookingsTableProps {
  bookings: Booking[];
}

export function BookingsTable({ bookings: initialBookings }: BookingsTableProps) {
  const [bookings, setBookings] = useState(initialBookings);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredBookings =
    filterStatus === "all"
      ? bookings
      : bookings.filter((b) => b.status === filterStatus);

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      if (!response.ok) throw new Error("Failed to update");

      setBookings(
        bookings.map((b) => (b.id === id ? { ...b, status } : b))
      );
      toast.success("Booking status updated");
    } catch (error) {
      toast.error("Failed to update booking");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-sm text-foreground/60">
          {filteredBookings.length} booking(s)
        </div>
        <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value || "all")}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Bookings</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredBookings.map((booking) => (
          <Card key={booking.id} className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-foreground/60 mb-1">Client</div>
                  <div className="font-medium">{booking.client_name}</div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-foreground/70">
                    <Mail className="w-4 h-4" />
                    <a
                      href={`mailto:${booking.client_email}`}
                      className="hover:text-gold"
                    >
                      {booking.client_email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-foreground/70">
                    <Phone className="w-4 h-4" />
                    <a
                      href={`tel:${booking.client_phone}`}
                      className="hover:text-gold"
                    >
                      {booking.client_phone}
                    </a>
                  </div>
                  {booking.location && (
                    <div className="flex items-center gap-2 text-foreground/70">
                      <MapPin className="w-4 h-4" />
                      {booking.location}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-sm text-foreground/60 mb-1">Package</div>
                  <div className="font-medium">
                    {booking.pricing_packages?.name || "N/A"}
                  </div>
                  {booking.pricing_packages && (
                    <div className="text-sm text-gold">
                      ${booking.pricing_packages.price.toFixed(0)}
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-sm text-foreground/60 mb-1">
                    Session Date & Time
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <div>
                      {format(new Date(booking.session_date), "MMM d, yyyy")}
                      <span className="text-foreground/60 ml-2">
                        {booking.session_time}
                      </span>
                    </div>
                  </div>
                </div>
                {booking.message && (
                  <div>
                    <div className="text-sm text-foreground/60 mb-1">
                      Message
                    </div>
                    <div className="text-sm text-foreground/70">
                      {booking.message}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-sm text-foreground/60 mb-2">Status</div>
                  <span
                    className={`inline-block px-3 py-1 text-xs font-medium rounded ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {booking.status.charAt(0).toUpperCase() +
                      booking.status.slice(1)}
                  </span>
                </div>
                <div>
                  <div className="text-sm text-foreground/60 mb-2">
                    Update Status
                  </div>
                  <div className="space-y-2">
                    {booking.status === "pending" && (
                      <Button
                        onClick={() => updateStatus(booking.id, "confirmed")}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                        size="sm"
                      >
                        Confirm
                      </Button>
                    )}
                    {booking.status === "confirmed" && (
                      <Button
                        onClick={() => updateStatus(booking.id, "completed")}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        size="sm"
                      >
                        Mark Complete
                      </Button>
                    )}
                    {["pending", "confirmed"].includes(booking.status) && (
                      <Button
                        onClick={() => updateStatus(booking.id, "cancelled")}
                        variant="outline"
                        className="w-full"
                        size="sm"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
                <div className="text-xs text-foreground/60">
                  Booked: {format(new Date(booking.created_at), "MMM d, yyyy")}
                </div>
              </div>
            </div>
          </Card>
        ))}

        {filteredBookings.length === 0 && (
          <Card className="p-12 text-center">
            <div className="text-foreground/60">No bookings found</div>
          </Card>
        )}
      </div>
    </div>
  );
}
