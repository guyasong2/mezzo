"use client";

import { useEffect, useState, useCallback } from "react";
import { CldImage } from "next-cloudinary";
import { ChevronLeft, ChevronRight } from "lucide-react";

const heroSlides = [
  {
    image: "24867-ok_1",
    title: "Timeless",
    subtitle: "Elegance",
  },
  {
    image: "24901-ok",
    title: "Memorable",
    subtitle: "Experiences",
  },
];

export function HeroSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning || index === currentIndex) return;
      setIsTransitioning(true);
      setCurrentIndex(index);
      setTimeout(() => setIsTransitioning(false), 700);
    },
    [isTransitioning, currentIndex]
  );

  const goToPrevious = useCallback(() => {
    goToSlide((currentIndex - 1 + heroSlides.length) % heroSlides.length);
  }, [currentIndex, goToSlide]);

  const goToNext = useCallback(() => {
    goToSlide((currentIndex + 1) % heroSlides.length);
  }, [currentIndex, goToSlide]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroSlides.length);
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-dvh w-full overflow-hidden bg-black">
      {/* Slideshow Images — both always rendered, opacity transition */}
      {heroSlides.map((slide, index) => (
        <div
          key={index}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{ opacity: index === currentIndex ? 1 : 0 }}
        >
          <CldImage
            src={slide.image}
            alt={`${slide.title} ${slide.subtitle}`}
            fill
            loading={index === 0 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : "low"}
            className="object-cover"
            quality={85}
            format="auto"
            sizes="100vw"
          />
        </div>
      ))}

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 z-[1]" />

      {/* Hero Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-5xl w-full">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-4 sm:mb-6 leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
            {heroSlides[currentIndex].title}
            <span className="block text-[#D4AF37]">{heroSlides[currentIndex].subtitle}</span>
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

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="hidden sm:block absolute left-2 sm:left-4 lg:left-6 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all duration-300 touch-manipulation"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </button>
      <button
        onClick={goToNext}
        className="hidden sm:block absolute right-2 sm:right-4 lg:right-6 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all duration-300 touch-manipulation"
        aria-label="Next image"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 sm:bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 sm:gap-3">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`slide-indicator h-px sm:h-1 !min-h-0 !min-w-0 transition-all duration-300 touch-manipulation ${
              index === currentIndex
                ? "w-5 sm:w-12 bg-[#D4AF37]"
                : "w-3 sm:w-8 bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
