import { createClient } from "./server";
import { createClient as createBrowserClient } from "./client";

// Server-side queries
export async function getActivePackages() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pricing_packages")
    .select("*")
    .eq("active", true)
    .order("sort_order");

  if (error) {
    console.error("Error fetching packages:", error);
    return [];
  }

  return data || [];
}

export async function getBlockedDates() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blocked_dates")
    .select("blocked_date");

  if (error) {
    console.error("Error fetching blocked dates:", error);
    return [];
  }

  return data?.map((item) => new Date(item.blocked_date)) || [];
}

export async function getGalleryImages(categorySlug?: string) {
  const supabase = await createClient();

  let query = supabase
    .from("gallery_images")
    .select(`
      *,
      category:categories(name, slug)
    `)
    .order("sort_order");

  if (categorySlug) {
    query = query.eq("category.slug", categorySlug);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching gallery images:", error);
    return [];
  }

  return data || [];
}

export async function getCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("active", true)
    .order("sort_order");

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return data || [];
}

// Client-side queries
export function useSupabaseClient() {
  return createBrowserClient();
}

// Check if date is available for booking
export async function checkDateAvailability(date: string, time: string) {
  const supabase = await createClient();

  // Check blocked dates
  const { data: blockedDate } = await supabase
    .from("blocked_dates")
    .select("id")
    .eq("blocked_date", date)
    .single();

  if (blockedDate) {
    return { available: false, reason: "Date is blocked" };
  }

  // Check existing bookings
  const { data: existingBookings } = await supabase
    .from("bookings")
    .select("id")
    .eq("session_date", date)
    .eq("session_time", time)
    .in("status", ["pending", "confirmed"]);

  if (existingBookings && existingBookings.length > 0) {
    return { available: false, reason: "Time slot already booked" };
  }

  return { available: true };
}
