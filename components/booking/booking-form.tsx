"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Database } from "@/types/database";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";

type PricingPackage = Database["public"]["Tables"]["pricing_packages"]["Row"];

const bookingSchema = z.object({
  package_id: z.string().min(1, "Please select a package"),
  session_date: z.date(),
  session_time: z.string().min(1, "Please select a time"),
  client_name: z.string().min(2, "Name must be at least 2 characters"),
  client_email: z.string().email("Invalid email address"),
  client_phone: z.string().min(10, "Please enter a valid phone number"),
  location: z.string().optional(),
  message: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  packages: PricingPackage[];
  availableTimes: string[];
  blockedDates: Date[];
}

const STEPS = [
  { id: 1, name: "Package", description: "Choose your session" },
  { id: 2, name: "Date & Time", description: "Pick a date" },
  { id: 3, name: "Details", description: "Your information" },
  { id: 4, name: "Confirm", description: "Review & book" },
];

export function BookingForm({
  packages,
  availableTimes,
  blockedDates,
}: BookingFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  const selectedPackageId = watch("package_id");
  const selectedDate = watch("session_date");
  const selectedTime = watch("session_time");

  const selectedPackage = packages.find((pkg) => pkg.id === selectedPackageId);

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          session_date: format(data.session_date, "yyyy-MM-dd"),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || "Booking failed");
      }

      toast.success("Booking request submitted successfully!", {
        description: "We'll contact you shortly to confirm your session.",
      });

      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Please try again or contact us directly.";
      toast.error("Failed to submit booking", {
        description: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return !!selectedPackageId;
      case 2:
        return !!selectedDate && !!selectedTime;
      case 3:
        return (
          watch("client_name") &&
          watch("client_email") &&
          watch("client_phone")
        );
      default:
        return true;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8 sm:mb-12">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-base font-medium transition-colors ${
                    currentStep >= step.id
                      ? "bg-[#D4AF37] text-black"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    step.id
                  )}
                </div>
                <div className="mt-1.5 sm:mt-2 text-center">
                  <div className="text-xs sm:text-sm font-medium">{step.name}</div>
                  <div className="text-[10px] sm:text-xs text-gray-500 hidden sm:block">
                    {step.description}
                  </div>
                </div>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-2 sm:mx-4 transition-colors ${
                    currentStep > step.id ? "bg-[#D4AF37]" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
        {/* Step 1: Package Selection */}
        {currentStep === 1 && (
          <div className="space-y-4 sm:space-y-6">
            <h3 className="font-serif text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
              Choose Your Package
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {packages.map((pkg) => (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => setValue("package_id", pkg.id)}
                  className={`p-4 sm:p-6 border-2 text-left transition-all touch-manipulation ${
                    selectedPackageId === pkg.id
                      ? "border-[#D4AF37] bg-[#D4AF37]/5"
                      : "border-gray-200 hover:border-[#D4AF37]/50"
                  }`}
                >
                  <h4 className="font-serif text-lg sm:text-xl font-bold mb-1 sm:mb-2">
                    {pkg.name}
                  </h4>
                  <div className="text-2xl sm:text-3xl font-bold text-[#D4AF37] mb-1 sm:mb-2">
                    ${pkg.price.toFixed(0)}
                  </div>
                  {pkg.duration && (
                    <div className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">
                      {pkg.duration}
                    </div>
                  )}
                  {pkg.description && (
                    <div className="text-xs sm:text-sm text-gray-600">
                      {pkg.description}
                    </div>
                  )}
                </button>
              ))}
            </div>
            {errors.package_id && (
              <p className="text-red-500 text-xs sm:text-sm mt-2">
                {errors.package_id.message}
              </p>
            )}
          </div>
        )}

        {/* Step 2: Date & Time */}
        {currentStep === 2 && (
          <div className="space-y-4 sm:space-y-6">
            <h3 className="font-serif text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
              Select Date & Time
            </h3>
            <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
              <div>
                <Label className="text-sm sm:text-base">Choose a date</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setValue("session_date", date)}
                  disabled={[
                    ...blockedDates,
                    { before: new Date() },
                  ]}
                  captionLayout="dropdown"
                  startMonth={new Date()}
                  endMonth={new Date(new Date().getFullYear() + 1, 11)}
                  className="border p-2 sm:p-3 mt-2"
                />
                {errors.session_date && (
                  <p className="text-red-500 text-xs sm:text-sm mt-2">
                    {errors.session_date.message}
                  </p>
                )}
              </div>
              <div>
                <Label className="text-sm sm:text-base">Choose a time</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {availableTimes.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setValue("session_time", time)}
                      disabled={!selectedDate}
                      className={`p-2.5 sm:p-3 border text-xs sm:text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation ${
                        selectedTime === time
                          ? "border-[#D4AF37] bg-[#D4AF37] text-black"
                          : "border-gray-200 hover:border-[#D4AF37]/50"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
                {errors.session_time && (
                  <p className="text-red-500 text-xs sm:text-sm mt-2">
                    {errors.session_time.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Client Details */}
        {currentStep === 3 && (
          <div className="space-y-4 sm:space-y-6">
            <h3 className="font-serif text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
              Your Information
            </h3>
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <Label htmlFor="client_name">Full Name *</Label>
                <Input
                  id="client_name"
                  {...register("client_name")}
                  placeholder="John Doe"
                  className="mt-2"
                />
                {errors.client_name && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors.client_name.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="client_email">Email *</Label>
                <Input
                  id="client_email"
                  type="email"
                  {...register("client_email")}
                  placeholder="john@example.com"
                  className="mt-2"
                />
                {errors.client_email && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors.client_email.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="client_phone">Phone Number *</Label>
                <Input
                  id="client_phone"
                  type="tel"
                  {...register("client_phone")}
                  placeholder="+1 (555) 123-4567"
                  className="mt-2"
                />
                {errors.client_phone && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors.client_phone.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="location">Preferred Location</Label>
                <Input
                  id="location"
                  {...register("location")}
                  placeholder="Dallas, TX"
                  className="mt-2"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="message">Additional Notes</Label>
              <Textarea
                id="message"
                {...register("message")}
                placeholder="Tell us about your vision for the session..."
                className="mt-2 min-h-[100px] sm:min-h-[120px]"
              />
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {currentStep === 4 && (
          <div className="space-y-4 sm:space-y-6">
            <h3 className="font-serif text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
              Review Your Booking
            </h3>
            <div className="bg-gray-50 p-4 sm:p-6 space-y-3 sm:space-y-4">
              <div>
                <div className="text-xs sm:text-sm text-gray-500 mb-1">Package</div>
                <div className="font-medium text-sm sm:text-base">{selectedPackage?.name}</div>
                <div className="text-[#D4AF37] font-bold text-sm sm:text-base">
                  ${selectedPackage?.price.toFixed(0)}
                </div>
              </div>
              <div className="h-px bg-gray-200" />
              <div>
                <div className="text-xs sm:text-sm text-gray-500 mb-1">
                  Date & Time
                </div>
                <div className="font-medium text-sm sm:text-base">
                  {selectedDate && format(selectedDate, "MMMM d, yyyy")}
                </div>
                <div className="text-gray-600 text-sm">{selectedTime}</div>
              </div>
              <div className="h-px bg-gray-200" />
              <div>
                <div className="text-xs sm:text-sm text-gray-500 mb-1">
                  Contact Information
                </div>
                <div className="font-medium text-sm sm:text-base">{watch("client_name")}</div>
                <div className="text-gray-600 text-sm">{watch("client_email")}</div>
                <div className="text-gray-600 text-sm">{watch("client_phone")}</div>
                {watch("location") && (
                  <div className="text-gray-600 text-sm mt-1">
                    {watch("location")}
                  </div>
                )}
              </div>
              {watch("message") && (
                <>
                  <div className="h-px bg-gray-200" />
                  <div>
                    <div className="text-xs sm:text-sm text-gray-500 mb-1">Notes</div>
                    <div className="text-gray-600 text-sm">{watch("message")}</div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4 sm:pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => setCurrentStep(currentStep - 1)}
            disabled={currentStep === 1}
            className="flex items-center gap-1 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!canProceed()}
              className="flex items-center gap-1 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-[#D4AF37] text-black font-semibold hover:bg-[#B8941F] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-[#D4AF37] text-black font-semibold hover:bg-[#B8941F] transition-all duration-300 disabled:opacity-50 touch-manipulation"
            >
              {isSubmitting ? "Submitting..." : "Confirm Booking"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
