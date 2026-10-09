"use client";

import { useState, useEffect } from "react";
import { CldImage } from "next-cloudinary";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

interface CloudinaryImage {
  public_id: string;
  format: string;
  width: number;
  height: number;
  created_at: string;
  bytes: number;
}

export function CloudinaryGallery() {
  const [images, setImages] = useState<CloudinaryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    fetch("/api/gallery-images")
      .then((res) => res.json())
      .then((data) => {
        setImages(data.images || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const lightboxSlides = images.map((img) => ({
    src: `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/q_90,f_auto/${img.public_id}.${img.format}`,
    width: img.width,
    height: img.height,
  }));

  if (loading) {
    return (
      <section className="py-12 sm:py-16 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-3 sm:gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="break-inside-avoid mb-3 sm:mb-4 bg-gray-100 animate-pulse"
                style={{ height: `${250 + (i % 3) * 100}px` }}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (images.length === 0) {
    return (
      <section className="py-16 sm:py-24 bg-white">
        <div className="text-center">
          <p className="text-gray-500">No images found.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-3 sm:gap-4">
          {images.map((image, index) => (
            <div
              key={image.public_id}
              className="break-inside-avoid mb-3 sm:mb-4 cursor-pointer group relative overflow-hidden"
              onClick={() => {
                setLightboxIndex(index);
                setLightboxOpen(true);
              }}
            >
              <CldImage
                src={image.public_id}
                alt={image.public_id.replace(/[-_]/g, " ")}
                width={image.width}
                height={image.height}
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                quality={85}
                format="auto"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            </div>
          ))}
        </div>
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
