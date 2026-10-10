"use client";

import { CldImage } from "next-cloudinary";

const galleryImages = [
  {
    src: "5344-ok",
    alt: "Elegant portrait photography",
    span: "col-span-2 row-span-2",
  },
  {
    src: "24867-ok",
    alt: "Professional couple photography",
    span: "col-span-1 row-span-1",
  },
  {
    src: "24888-ok",
    alt: "Timeless moment capture",
    span: "col-span-1 row-span-1",
  },
  {
    src: "16902-ok",
    alt: "Cinematic photography",
    span: "col-span-1 row-span-2",
  },
  {
    src: "DSC_5155",
    alt: "Professional portrait",
    span: "col-span-1 row-span-1",
  },
  {
    src: "24901-ok",
    alt: "Beautiful moments",
    span: "col-span-2 row-span-1",
  },
];

export function ClassicalGallery() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12 lg:mb-16 fade-in-up">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-3 sm:mb-4">
            Featured <span className="text-[#D4AF37]">Gallery</span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            A curated selection of our finest photography showcasing memorable moments and timeless elegance
          </p>
        </div>

        {/* Mobile: 1 column, Tablet: 2 columns, Desktop: 4 columns with masonry */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:auto-rows-[250px] xl:auto-rows-[300px]">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className={`${image.span.replace('col-span-', 'lg:col-span-').replace('row-span-', 'lg:row-span-')} relative overflow-hidden group cursor-pointer h-64 sm:h-80 lg:h-auto fade-in-scale`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CldImage
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                quality={80}
                format="auto"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            </div>
          ))}
        </div>

        <div className="text-center mt-8 sm:mt-10 lg:mt-12 fade-in-up" style={{ animationDelay: '0.4s' }}>
          <a
            href="/gallery"
            className="inline-block px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base bg-black text-white font-semibold hover:bg-[#D4AF37] hover:text-black transition-all duration-300 touch-manipulation"
          >
            View Full Gallery
          </a>
        </div>
      </div>
    </section>
  );
}
