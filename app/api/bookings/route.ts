import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

// Rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // 10 bookings
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

// Validation schema
const bookingSchema = z.object({
  package_id: z.string().uuid("Invalid package ID"),
  client_name: z.string().min(2).max(100),
  client_email: z.string().email().max(255),
  client_phone: z.string().min(10).max(20),
  location: z.string().max(255).optional(),
  session_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  session_time: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format"),
  message: z.string().max(2000).optional(),
});

// Sanitize input
function sanitizeInput(input: string): string {
  return input.replace(/[<>]/g, "").trim();
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") ||
                request.headers.get("x-real-ip") ||
                "unknown";

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many booking requests. Please try again later." },
        { status: 429 }
      );
    }

    const supabase = await createClient();
    const body = await request.json();

    // Validate input
    const validation = bookingSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.issues },
        { status: 400 }
      );
    }

    const {
      package_id,
      client_name,
      client_email,
      client_phone,
      location,
      session_date,
      session_time,
      message,
    } = validation.data;

    // Check if package exists and is active
    const { data: packageData, error: packageError } = await supabase
      .from("pricing_packages")
      .select("id, active")
      .eq("id", package_id)
      .single();

    if (packageError || !packageData || !packageData.active) {
      return NextResponse.json(
        { error: "Invalid or inactive package" },
        { status: 400 }
      );
    }

    // Check for existing bookings at this time
    const { data: existingBookings } = await supabase
      .from("bookings")
      .select("id")
      .eq("session_date", session_date)
      .eq("session_time", session_time)
      .in("status", ["pending", "confirmed"]);

    if (existingBookings && existingBookings.length > 0) {
      return NextResponse.json(
        { error: "This time slot is already booked. Please choose another time." },
        { status: 409 }
      );
    }

    // Validate date is not in the past
    const bookingDate = new Date(session_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (bookingDate < today) {
      return NextResponse.json(
        { error: "Cannot book a date in the past" },
        { status: 400 }
      );
    }

    // Check if date is blocked
    const { data: blockedDate } = await supabase
      .from("blocked_dates")
      .select("id")
      .eq("blocked_date", session_date)
      .single();

    if (blockedDate) {
      return NextResponse.json(
        { error: "This date is not available. Please choose another date." },
        { status: 409 }
      );
    }

    // Sanitize inputs
    const sanitizedData = {
      package_id,
      client_name: sanitizeInput(client_name),
      client_email: sanitizeInput(client_email),
      client_phone: sanitizeInput(client_phone),
      location: location ? sanitizeInput(location) : null,
      session_date,
      session_time,
      message: message ? sanitizeInput(message) : null,
      status: "pending" as const,
    };

    // Insert booking
    const { data, error } = await supabase
      .from("bookings")
      .insert(sanitizedData)
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      throw error;
    }

    // Send email notification
    try {
      const { sendBookingNotification } = await import("@/lib/email");
      const { data: pkgData } = await supabase
        .from("pricing_packages")
        .select("name")
        .eq("id", package_id)
        .single();

      await sendBookingNotification({
        clientName: sanitizedData.client_name,
        clientEmail: sanitizedData.client_email,
        clientPhone: sanitizedData.client_phone,
        packageName: pkgData?.name || "Unknown Package",
        sessionDate: sanitizedData.session_date,
        sessionTime: sanitizedData.session_time,
        location: sanitizedData.location,
        message: sanitizedData.message,
      });
    } catch (emailError) {
      console.error("Failed to send booking email:", emailError);
    }

    return NextResponse.json(
      {
        success: true,
        data,
        message: "Booking created successfully"
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { error: "Failed to create booking. Please try again later." },
      { status: 500 }
    );
  }
}
