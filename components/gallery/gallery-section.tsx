"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Database } from "@/types/database";

gsap.registerPlugin(ScrollTrigger);

type GalleryImage = Database["public"]["Tables"]["gallery_images"]["Row"];

interface GallerySectionProps {
  images: GalleryImage[];
  categories: Database["public"]["Tables"]["categories"]["Row"][];
}

export function GallerySection({ images, categories }: GallerySectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);

  const filteredImages =
    selectedCategory === "all"
      ? images
      : images.filter((img) => img.category_id === selectedCategory);

  const lightboxSlides = filteredImages.map((img) => ({
    src: img.image_url,
    alt: img.alt_text,
    width: img.width || 1920,
    height: img.height || 1080,
  }));

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = galleryRef.current?.querySelectorAll(".gallery-item");
      if (items) {
        gsap.from(items, {
          scrollTrigger: {
            trigger: galleryRef.current,
            start: "top 80%",
          },
          y: 60,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
        });
      }
    }, galleryRef);

    return () => ctx.revert();
  }, [filteredImages]);

  return (
    <section ref={galleryRef} className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Featured Work
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            A curated collection of moments captured with passion and precision.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-6 py-2 text-sm font-medium transition-all ${
              selectedCategory === "all"
                ? "bg-gold text-white"
                : "bg-secondary text-foreground/70 hover:bg-secondary/80"
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-2 text-sm font-medium transition-all ${
                selectedCategory === category.id
                  ? "bg-gold text-white"
                  : "bg-secondary text-foreground/70 hover:bg-secondary/80"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Asymmetric gallery grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              className="gallery-item break-inside-avoid cursor-pointer group relative overflow-hidden"
              onClick={() => {
                setLightboxIndex(index);
                setLightboxOpen(true);
              }}
            >
              <div className="relative">
                <Image
                  src={image.image_url}
                  alt={image.alt_text}
                  width={image.width || 800}
                  height={image.height || 1200}
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-white text-center p-4">
                    {image.title && (
                      <h3 className="font-serif text-xl font-bold mb-2">
                        {image.title}
                      </h3>
                    )}
                    {image.description && (
                      <p className="text-sm">{image.description}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredImages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-foreground/60">
              No images found in this category.
            </p>
          </div>
        )}
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={lightboxSlides}
        index={lightboxIndex}
      />
    </section>
  );
}
