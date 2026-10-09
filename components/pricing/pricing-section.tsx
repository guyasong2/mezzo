"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check } from "lucide-react";
import { Database } from "@/types/database";

gsap.registerPlugin(ScrollTrigger);

type PricingPackage = Database["public"]["Tables"]["pricing_packages"]["Row"];

interface PricingSectionProps {
  packages: PricingPackage[];
}

export function PricingSection({ packages }: PricingSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = sectionRef.current?.querySelectorAll(".pricing-card");
      if (cards) {
        gsap.from(cards, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
          y: 60,
          opacity: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 lg:py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
            Pricing Packages
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Flexible packages designed to capture your most important moments
            with professional quality and personal attention.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
          {packages.map((pkg, index) => {
            const features = Array.isArray(pkg.features)
              ? (pkg.features as string[])
              : [];

            return (
              <div
                key={pkg.id}
                className={`pricing-card bg-white border-2 p-5 sm:p-6 lg:p-8 flex flex-col ${
                  index === 1
                    ? "border-[#D4AF37] lg:scale-105 shadow-xl"
                    : "border-gray-200"
                }`}
              >
                {index === 1 && (
                  <div className="bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-wider px-3 py-1.5 -mt-3 sm:-mt-4 -mx-3 sm:-mx-4 mb-4 sm:mb-6 text-center">
                    Most Popular
                  </div>
                )}

                <div className="text-center mb-4 sm:mb-6">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold mb-2">
                    {pkg.name}
                  </h3>
                  {pkg.duration && (
                    <p className="text-xs sm:text-sm text-gray-500">{pkg.duration}</p>
                  )}
                </div>

                <div className="text-center mb-4 sm:mb-6">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                      ${pkg.price.toFixed(0)}
                    </span>
                    <span className="text-gray-500 text-sm sm:text-base">{pkg.currency}</span>
                  </div>
                </div>

                {pkg.description && (
                  <p className="text-center text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">
                    {pkg.description}
                  </p>
                )}

                <ul className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8 flex-grow">
                  {features.map((feature: string, featureIndex: number) => (
                    <li key={featureIndex} className="flex items-start gap-2.5 sm:gap-3">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/book?package=${pkg.slug}`}
                  className={`block w-full py-3 sm:py-4 text-center text-sm sm:text-base font-semibold transition-all duration-300 touch-manipulation ${
                    index === 1
                      ? "bg-[#D4AF37] text-black hover:bg-[#B8941F]"
                      : "bg-black text-white hover:bg-[#D4AF37] hover:text-black"
                  }`}
                >
                  Select Package
                </Link>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-8 sm:mt-12">
          <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
            Need a custom package? Let's discuss your specific needs.
          </p>
          <Link
            href="/contact"
            className="inline-block px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-black text-black font-semibold hover:bg-black hover:text-white transition-all duration-300 touch-manipulation"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
