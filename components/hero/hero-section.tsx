"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.from(titleRef.current, {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        delay: 0.2,
      });

      // Subtitle animation
      gsap.from(subtitleRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
        delay: 0.5,
      });

      // CTA animation
      gsap.from(ctaRef.current, {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
        delay: 0.8,
      });

      // Scroll indicator animation
      gsap.from(scrollRef.current, {
        opacity: 0,
        duration: 1,
        delay: 1.2,
      });

      gsap.to(scrollRef.current, {
        y: 10,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });

      // Image grid animation
      const images = imagesRef.current?.querySelectorAll(".hero-image");
      if (images) {
        gsap.from(images, {
          scale: 0.8,
          opacity: 0,
          duration: 1.2,
          stagger: 0.15,
          ease: "power4.out",
          delay: 0.4,
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background pt-20"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background z-10" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div className="space-y-8">
            <h1
              ref={titleRef}
              className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight"
            >
              Capturing Moments,
              <br />
              <span className="text-gold">Creating Memories</span>
            </h1>

            <p
              ref={subtitleRef}
              className="text-lg md:text-xl text-foreground/70 max-w-xl"
            >
              Premium photography services in Texas. Specializing in portraits, weddings,
              events, and commercial photography with an editorial touch.
            </p>

            <div ref={ctaRef} className="flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="bg-gold hover:bg-gold-dark text-white px-8"
              >
                <Link href="/book">Book a Session</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/work">View Portfolio</Link>
              </Button>
            </div>
          </div>

          {/* Right: Asymmetric Image Grid */}
          <div ref={imagesRef} className="relative h-[600px] hidden lg:block">
            {/* Large image */}
            <div className="hero-image absolute top-0 right-0 w-72 h-96 overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80"
                alt="Professional portrait photography"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Medium image */}
            <div className="hero-image absolute top-32 left-0 w-56 h-72 overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=80"
                alt="Wedding photography"
                fill
                className="object-cover"
              />
            </div>

            {/* Small image */}
            <div className="hero-image absolute bottom-0 right-12 w-48 h-64 overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1551041777-c97080081e0b?w=800&q=80"
                alt="Event photography"
                fill
                className="object-cover"
              />
            </div>

            {/* Gold accent bar */}
            <div className="hero-image absolute bottom-24 left-12 w-32 h-2 bg-gold" />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 cursor-pointer"
        onClick={() => {
          window.scrollTo({
            top: window.innerHeight,
            behavior: "smooth",
          });
        }}
      >
        <span className="text-sm text-foreground/60">Scroll to explore</span>
        <ArrowDown className="w-5 h-5 text-gold" />
      </div>
    </section>
  );
}
