"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send message");
      }

      toast.success("Message sent successfully!", {
        description: "We'll get back to you as soon as possible.",
      });
      reset();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to send message";
      toast.error(message, {
        description: "Please try again or contact us directly via email.",
      });
    }
  };

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen">
        <div className="py-10 sm:py-16 bg-gray-50">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
              Get In Touch
            </h1>
            <p className="text-base sm:text-lg text-gray-600">
              Have a question or ready to book? We'd love to hear from you.
            </p>
          </div>
        </div>

        <div className="py-10 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
              {/* Contact Information */}
              <div className="space-y-6 sm:space-y-8">
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
                    Let's Connect
                  </h2>
                  <p className="text-gray-600 text-base sm:text-lg mb-6 sm:mb-8">
                    Whether you're planning a wedding, need professional portraits,
                    or have a commercial project in mind, I'm here to help bring
                    your vision to life.
                  </p>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37]" />
                    </div>
                    <div>
                      <div className="font-medium mb-1 text-sm sm:text-base">Email</div>
                      <a
                        href="mailto:info@stevemezzoimages.com"
                        className="text-gray-600 hover:text-[#D4AF37] transition-colors text-sm sm:text-base"
                      >
                        info@stevemezzoimages.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37]" />
                    </div>
                    <div>
                      <div className="font-medium mb-1 text-sm sm:text-base">Phone</div>
                      <a
                        href="tel:+14695583859"
                        className="text-gray-600 hover:text-[#D4AF37] transition-colors text-sm sm:text-base"
                      >
                        +1 469 558 3859
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37]" />
                    </div>
                    <div>
                      <div className="font-medium mb-1 text-sm sm:text-base">Location</div>
                      <div className="text-gray-600 text-sm sm:text-base">Texas, USA</div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 sm:pt-8 border-t">
                  <div className="font-medium mb-3 sm:mb-4 text-sm sm:text-base">Business Hours</div>
                  <div className="space-y-2 text-gray-600 text-sm sm:text-base">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span>9:00 AM - 5:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span>By Appointment</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span>Closed</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-gray-50 p-5 sm:p-8">
                <h3 className="font-serif text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
                  Send a Message
                </h3>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      {...register("name")}
                      placeholder="Your name"
                      className="mt-2"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs sm:text-sm mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      placeholder="your@email.com"
                      className="mt-2"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs sm:text-sm mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      {...register("phone")}
                      placeholder="+1 (555) 123-4567"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      {...register("subject")}
                      placeholder="What's this about?"
                      className="mt-2"
                    />
                    {errors.subject && (
                      <p className="text-red-500 text-xs sm:text-sm mt-1">
                        {errors.subject.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      {...register("message")}
                      placeholder="Tell us about your project..."
                      className="mt-2 min-h-[120px] sm:min-h-[150px]"
                    />
                    {errors.message && (
                      <p className="text-red-500 text-xs sm:text-sm mt-1">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 sm:py-4 text-sm sm:text-base bg-[#D4AF37] text-black font-semibold hover:bg-[#B8941F] transition-all duration-300 disabled:opacity-50 touch-manipulation"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
