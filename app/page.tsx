import { HeroSlideshow } from "@/components/hero/hero-slideshow";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import dynamic from "next/dynamic";

const AboutSection = dynamic(
  () => import("@/components/sections/about-section").then((mod) => mod.AboutSection),
  { loading: () => <div className="py-32 bg-white" /> }
);

const ClassicalGallery = dynamic(
  () => import("@/components/sections/classical-gallery").then((mod) => mod.ClassicalGallery),
  { loading: () => <div className="py-24 bg-gray-50" /> }
);

const PricingCarousel = dynamic(
  () => import("@/components/sections/pricing-carousel").then((mod) => mod.PricingCarousel),
  { loading: () => <div className="py-32 bg-black" /> }
);

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <HeroSlideshow />
      <AboutSection />
      <ClassicalGallery />
      <PricingCarousel />
      <Footer />
    </main>
  );
}
