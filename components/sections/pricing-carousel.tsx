"use client";

import { useState, useEffect } from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface PricingPackage {
  id: string;
  name: string;
  slug: string;
  price: number;
  duration: string;
  description: string;
  features: string[];
  popular?: boolean;
}

const defaultPackages: PricingPackage[] = [
  {
    id: "1",
    name: "Extended Session",
    slug: "extended-session",
    price: 200,
    duration: "1-2 hours",
    description: "35-50 edited photos",
    features: [
      "Professional editing",
      "Online gallery",
      "High-resolution downloads",
      "Personal consultation",
    ],
  },
  {
    id: "2",
    name: "Half Day Event",
    slug: "half-day-event",
    price: 300,
    duration: "3-4 hours",
    description: "75-100 edited photos",
    features: [
      "Professional editing",
      "Online gallery",
      "High-resolution downloads",
      "Same-day preview",
      "Multiple locations",
    ],
    popular: true,
  },
  {
    id: "3",
    name: "Full Day Event",
    slug: "full-day-event",
    price: 550,
    duration: "6-8 hours",
    description: "150-200 edited photos",
    features: [
      "Professional editing",
      "Online gallery",
      "High-resolution downloads",
      "Same-day preview",
      "Second photographer",
      "Premium album included",
    ],
  },
];

export function PricingCarousel() {
  const [packages, setPackages] = useState<PricingPackage[]>(defaultPackages);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch("/api/pricing");
        const result = await response.json();

        if (response.ok && result.data) {
          const parsedPackages = result.data.map((pkg: any) => ({
            ...pkg,
            features: typeof pkg.features === 'string' ? JSON.parse(pkg.features) : pkg.features,
            popular: pkg.slug === 'half-day-event',
          }));
          setPackages(parsedPackages);
        }
      } catch {
        // Keep default packages
      }
    };

    fetchPackages();
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + packages.length) % packages.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % packages.length);
  };

  const currentPackage = packages[currentIndex];

  return (
    <section className="relative py-16 sm:py-24 lg:py-32 bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20 fade-in-up">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4">
            Our
            <span className="block text-[#D4AF37]">Packages</span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto px-4">
            Choose the package that best fits your vision
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 lg:p-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 touch-manipulation"
            aria-label="Previous package"
          >
            <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 lg:p-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 touch-manipulation"
            aria-label="Next package"
          >
            <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
          </button>

          {/* Card */}
          <div className="flex justify-center items-center min-h-[550px] sm:min-h-[600px]">
            <div className="w-full max-w-md transition-opacity duration-500">
              <div
                className={`relative bg-gradient-to-br from-white to-gray-50 rounded-none overflow-hidden ${
                  currentPackage.popular ? "ring-2 sm:ring-4 ring-[#D4AF37]" : ""
                }`}
              >
                {currentPackage.popular && (
                  <div className="absolute top-0 right-0 bg-[#D4AF37] text-black text-xs sm:text-sm font-bold px-4 sm:px-6 py-1.5 sm:py-2 uppercase tracking-wider">
                    Most Popular
                  </div>
                )}

                <div className="p-6 sm:p-8 lg:p-12">
                  <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-2">
                    {currentPackage.name}
                  </h3>
                  <p className="text-gray-600 text-base sm:text-lg mb-6 sm:mb-8">{currentPackage.duration}</p>

                  <div className="mb-6 sm:mb-8">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black">${currentPackage.price}</span>
                      <span className="text-gray-500 text-lg sm:text-xl">USD</span>
                    </div>
                    <p className="text-gray-600 text-sm sm:text-base mt-2">{currentPackage.description}</p>
                  </div>

                  <ul className="space-y-3 sm:space-y-4 mb-8 sm:mb-10">
                    {currentPackage.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37] flex-shrink-0" />
                        <span className="text-gray-700 text-sm sm:text-base">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`/book?package=${currentPackage.slug}`}
                    className="block w-full py-3 sm:py-4 text-center text-sm sm:text-base bg-black text-white font-semibold hover:bg-[#D4AF37] hover:text-black transition-all duration-300 touch-manipulation"
                  >
                    Book Now
                  </Link>
                </div>

                <div className="h-1.5 sm:h-2 bg-gradient-to-r from-[#D4AF37] via-[#F4E5B1] to-[#D4AF37]" />
              </div>
            </div>
          </div>

          {/* Dots Indicators */}
          <div className="flex justify-center gap-1.5 sm:gap-3 mt-8 sm:mt-12">
            {packages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`slide-indicator h-px sm:h-1 !min-h-0 !min-w-0 transition-all duration-300 touch-manipulation ${
                  index === currentIndex
                    ? "w-5 sm:w-12 bg-[#D4AF37]"
                    : "w-3 sm:w-8 bg-white/30 hover:bg-white/50"
                }`}
                aria-label={`Go to package ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Bottom Text */}
        <div className="text-center mt-12 sm:mt-16 px-4 fade-in-up">
          <p className="text-gray-400 text-base sm:text-lg mb-4 sm:mb-6">
            Need something custom? Let's discuss your unique requirements
          </p>
          <Link
            href="/contact"
            className="inline-block px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-[#D4AF37] text-[#D4AF37] font-semibold hover:bg-[#D4AF37] hover:text-black transition-all duration-300 touch-manipulation"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
