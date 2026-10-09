"use client";

import { CldImage } from "next-cloudinary";
import { Camera, Award, Users, Heart } from "lucide-react";
import { useEffect, useState } from "react";

const iconMap: Record<string, any> = {
  Camera,
  Users,
  Award,
  Heart,
};
const iconOrder = [Camera, Users, Award, Heart];

const DEFAULT_STATS = [
  { value: "10+", label: "Years Experience" },
  { value: "500+", label: "Happy Clients" },
  { value: "15+", label: "Awards Won" },
  { value: "1000+", label: "Projects Completed" },
];

const DEFAULT_PARAGRAPHS = [
  "With over a decade of experience in professional photography, I specialize in capturing authentic moments that tell compelling stories. My approach combines technical excellence with artistic vision to create images that stand the test of time.",
  "From intimate portraits to grand events, every project receives my full attention and creative expertise. I believe that great photography isn't just about the camera—it's about understanding people, light, and emotion.",
  "Based in Texas, I work with clients locally and internationally, bringing a unique perspective to every shoot. Whether it's a wedding, corporate event, or personal branding session, I'm committed to delivering exceptional results that exceed expectations.",
];

export function AboutSection() {
  const [heading, setHeading] = useState("Steve Mezzo");
  const [paragraphs, setParagraphs] = useState(DEFAULT_PARAGRAPHS);
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [imageUrl, setImageUrl] = useState("bailey");

  useEffect(() => {
    fetch("/api/admin/about")
      .then((res) => res.json())
      .then((data) => {
        if (data.text) {
          const t = data.text as any;
          if (t.heading) setHeading(t.heading);
          if (t.paragraphs) setParagraphs(t.paragraphs);
          if (t.stats) setStats(t.stats);
        }
        if (data.image?.url) setImageUrl(data.image.url);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="relative py-16 sm:py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          <div className="relative order-1 lg:order-1 fade-in-up">
            <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] w-full">
              <div className="absolute inset-0 bg-[#D4AF37]/20 -translate-x-3 -translate-y-3 sm:-translate-x-6 sm:-translate-y-6" />
              <CldImage
                src={imageUrl}
                alt="Steve Mezzo - Professional Photographer"
                fill
                className="object-cover relative z-10"
                quality={85}
                format="auto"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
              />
            </div>
          </div>

          <div className="order-2 lg:order-2 fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4 sm:mb-6">
              About
              <span className="block text-[#D4AF37]">{heading}</span>
            </h2>
            <div className="space-y-4 sm:space-y-6 text-base sm:text-lg text-gray-700 leading-relaxed">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mt-8 sm:mt-12">
              {stats.map((stat, index) => {
                const Icon = iconOrder[index % iconOrder.length];
                return (
                  <div
                    key={stat.label}
                    className="text-center fade-in-up"
                    style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                  >
                    <Icon className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 sm:mb-3 text-[#D4AF37]" />
                    <div className="font-bold text-2xl sm:text-3xl lg:text-4xl text-black mb-1">{stat.value}</div>
                    <div className="text-xs sm:text-sm text-gray-600 uppercase tracking-wider">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
