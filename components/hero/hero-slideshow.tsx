"use client";

import { CldImage } from "next-cloudinary";

export function HeroSlideshow() {
  return (
    <section className="relative h-dvh w-full overflow-hidden bg-black">
      <div className="absolute inset-0">
        <CldImage
          src="24901-ok"
          alt="Memorable Experiences"
          fill
          loading="eager"
          fetchPriority="high"
          className="object-cover"
          quality={85}
          format="auto"
          sizes="100vw"
        />
      </div>

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 z-[1]" />

      {/* Hero Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-5xl w-full">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-4 sm:mb-6 leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
            Memorable
            <span className="block text-[#D4AF37]">Experiences</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 mb-8 sm:mb-12 max-w-3xl mx-auto font-light drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] px-4">
            Professional photography that tells your unique story through elegant, cinematic imagery
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <a
              href="/work"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-[#D4AF37] text-black font-semibold hover:bg-[#B8941F] transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
            >
              View Portfolio
            </a>
            <a
              href="/book"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-sm text-white font-semibold border-2 border-white hover:bg-white hover:text-black transition-all duration-300 text-sm sm:text-base"
            >
              Book Session
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
