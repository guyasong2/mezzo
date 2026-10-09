import { z } from "zod";

// Contact form validation
export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address").max(255),
  phone: z.string().max(20).optional(),
  subject: z.string().min(5, "Subject must be at least 5 characters").max(200),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});

// Booking form validation
export const bookingFormSchema = z.object({
  package_id: z.string().uuid("Invalid package ID"),
  session_date: z.date({
    message: "Please select a valid date",
  }),
  session_time: z.string().min(1, "Please select a time"),
  client_name: z.string().min(2, "Name must be at least 2 characters").max(100),
  client_email: z.string().email("Invalid email address").max(255),
  client_phone: z.string().min(10, "Please enter a valid phone number").max(20),
  location: z.string().max(255).optional(),
  message: z.string().max(2000).optional(),
});

// Admin login validation
export const adminLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Gallery image validation
export const galleryImageSchema = z.object({
  title: z.string().max(200).optional(),
  description: z.string().max(1000).optional(),
  alt_text: z.string().min(1, "Alt text is required").max(200),
  category_id: z.string().uuid().optional(),
  featured: z.boolean().default(false),
  image_url: z.string().url("Invalid image URL"),
  storage_path: z.string().min(1),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
});

// Pricing package validation
export const pricingPackageSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z.string().min(1, "Slug is required").max(100).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  price: z.number().positive("Price must be positive"),
  duration: z.string().max(50).optional(),
  description: z.string().max(500).optional(),
  features: z.array(z.string()).default([]),
  active: z.boolean().default(true),
  sort_order: z.number().int().default(0),
});

// Sanitization helper
export function sanitizeHtml(input: string): string {
  return input
    .replace(/[<>]/g, "") // Remove HTML tags
    .trim();
}

// Email validation helper
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Phone validation helper
export function isValidPhone(phone: string): boolean {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, "");
  // Check if it's a valid US phone number (10 digits) or international (7-15 digits)
  return cleaned.length >= 7 && cleaned.length <= 15;
}

// Date validation helper
export function isValidFutureDate(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
}

// Validate UUID
export function isValidUuid(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}
