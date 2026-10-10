import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CloudinaryGallery } from "@/components/gallery/cloudinary-gallery";

export const metadata = {
  title: "Gallery",
  description: "Explore our photography gallery showcasing portraits, weddings, events, and commercial work.",
};

export default function GalleryPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <div className="py-10 sm:py-16 bg-gray-50">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
              Our Gallery
            </h1>
            <p className="text-base sm:text-lg text-gray-600">
              A curated collection of moments captured with passion and precision
              across various photography styles.
            </p>
          </div>
        </div>

        <CloudinaryGallery />
      </main>
      <Footer />
    </>
  );
}
