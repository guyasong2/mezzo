"use client";

import { CldImage } from "next-cloudinary";
import Link from "next/link";
import { Camera, Award, Users, Heart } from "lucide-react";

const iconOrder = [Camera, Users, Award, Heart];

const DEFAULT_HEADING = "Steve Mezzo";
const DEFAULT_PARAGRAPHS = [
  "I'm a professional photographer based in Texas, specializing in capturing authentic moments that tell compelling stories. With over a decade of experience, I've had the privilege of working with hundreds of clients across weddings, portraits, events, and commercial projects.",
  "My approach combines editorial sophistication with genuine emotion, creating images that are both beautiful and meaningful. I believe every client deserves photography that reflects their unique story and personality.",
  "When I'm not behind the camera, you'll find me exploring new locations, studying light, or planning the next creative project with my clients.",
];
const DEFAULT_STATS = [
  { value: "10+", label: "Years Experience" },
  { value: "500+", label: "Happy Clients" },
  { value: "15+", label: "Awards Won" },
  { value: "1000+", label: "Projects Completed" },
];

interface AboutPageContentProps {
  text: { heading?: string; paragraphs?: string[]; stats?: { value: string; label: string }[] } | null;
  image: { url?: string } | null;
}

export function AboutPageContent({ text, image }: AboutPageContentProps) {
  const heading = text?.heading || DEFAULT_HEADING;
  const paragraphs = text?.paragraphs || DEFAULT_PARAGRAPHS;
  const stats = text?.stats || DEFAULT_STATS;
  const imageUrl = image?.url || "bailey";

  return (
    <main className="pt-20">
      {/* Hero Section */}
      <div className="py-10 sm:py-16 bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
            About Steve Mezzo Images
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Capturing life's most precious moments with artistry and passion
          </p>
        </div>
      </div>

      {/* Story Section */}
      <section className="py-12 sm:py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="relative h-[350px] sm:h-[450px] lg:h-[600px]">
              <CldImage
                src={imageUrl}
                alt="Steve Mezzo - Professional Photographer"
                fill
                className="object-cover"
                quality={85}
                format="auto"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="space-y-4 sm:space-y-6">
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold">
                Hi, I'm <span className="text-[#D4AF37]">{heading}</span>
              </h2>
              {paragraphs.map((p, i) => (
                <p key={i} className="text-gray-600 text-base sm:text-lg">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 sm:py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {stats.map((stat, index) => {
              const Icon = iconOrder[index % iconOrder.length];
              return (
                <div key={stat.label} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-[#D4AF37]/10 rounded-full mb-3 sm:mb-4">
                    <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-[#D4AF37]" />
                  </div>
                  <div className="text-2xl sm:text-4xl font-bold text-[#D4AF37] mb-1 sm:mb-2">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-12 sm:py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              My Photography Philosophy
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              Every image should tell a story worth remembering
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            <div className="text-center space-y-3 sm:space-y-4">
              <div className="w-12 h-1 bg-[#D4AF37] mx-auto" />
              <h3 className="font-serif text-lg sm:text-xl font-bold">Authenticity</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Capturing genuine moments and real emotions, not forced poses
              </p>
            </div>
            <div className="text-center space-y-3 sm:space-y-4">
              <div className="w-12 h-1 bg-[#D4AF37] mx-auto" />
              <h3 className="font-serif text-lg sm:text-xl font-bold">Artistry</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Combining technical excellence with creative vision
              </p>
            </div>
            <div className="text-center space-y-3 sm:space-y-4">
              <div className="w-12 h-1 bg-[#D4AF37] mx-auto" />
              <h3 className="font-serif text-lg sm:text-xl font-bold">Connection</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Building relationships that make every session comfortable and fun
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
            Let's Create Something Beautiful
          </h2>
          <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Ready to capture your story? Get in touch to discuss your project.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4">
            <Link
              href="/book"
              className="px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base bg-[#D4AF37] text-black font-semibold hover:bg-[#B8941F] transition-all duration-300 text-center touch-manipulation"
            >
              Book a Session
            </Link>
            <Link
              href="/contact"
              className="px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base border-2 border-black text-black font-semibold hover:bg-black hover:text-white transition-all duration-300 text-center touch-manipulation"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
