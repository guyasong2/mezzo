"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Gallery", href: "/gallery" },
  { name: "Pricing", href: "/pricing" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Determine if we're on the hero section (not scrolled on homepage)
  const isOnHero = pathname === "/" && !scrolled;
  const textColor = isOnHero ? "text-white" : "text-black";
  const hoverColor = isOnHero ? "hover:text-[#D4AF37]" : "hover:text-[#D4AF37]";
  const bgColor = scrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-transparent";

  return (
    <nav className={cn("fixed top-0 z-50 w-full transition-all duration-300", bgColor)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 sm:h-24 lg:h-28 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="relative">
              {isOnHero ? (
                <div className="relative">
                  <Image
                    src="/logo-with-lines-backup.png"
                    alt="Steve Mezzo Images"
                    width={140}
                    height={140}
                    className="sm:w-[160px] sm:h-[160px] lg:w-[200px] lg:h-[200px] object-contain brightness-[3] contrast-[1.5] saturate-0 drop-shadow-[0_0_15px_rgba(255,255,255,1)]"
                    priority
                    sizes="(max-width: 640px) 140px, (max-width: 1024px) 160px, 200px"
                    style={{ filter: 'invert(1) brightness(2)' }}
                  />
                </div>
              ) : (
                <Image
                  src="/logo-with-lines-backup.png"
                  alt="Steve Mezzo Images"
                  width={140}
                  height={140}
                  className="sm:w-[160px] sm:h-[160px] lg:w-[200px] lg:h-[200px] object-contain"
                  priority
                  sizes="(max-width: 640px) 140px, (max-width: 1024px) 160px, 200px"
                />
              )}
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-6 xl:gap-10">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-base xl:text-lg font-semibold transition-colors duration-200",
                  pathname === item.href
                    ? "text-[#D4AF37]"
                    : textColor,
                  hoverColor
                )}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/book"
              className={cn(
                "px-4 xl:px-6 py-2.5 xl:py-3 text-sm xl:text-base font-semibold transition-all duration-300 whitespace-nowrap",
                isOnHero
                  ? "bg-[#D4AF37] text-black hover:bg-[#B8941F]"
                  : "bg-black text-white hover:bg-[#D4AF37] hover:text-black"
              )}
            >
              Book Session
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={cn("inline-flex items-center justify-center p-2 touch-manipulation", textColor)}
              aria-label="Toggle menu"
            >
              <span className="sr-only">Toggle menu</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6 sm:h-7 sm:w-7" />
              ) : (
                <Menu className="h-6 w-6 sm:h-7 sm:w-7" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-black/40 backdrop-blur-md border-b border-white/10">
          <div className="space-y-1 px-4 sm:px-6 pb-6 pt-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block py-3 sm:py-4 text-base sm:text-lg font-semibold transition-colors touch-manipulation",
                  pathname === item.href
                    ? "text-[#D4AF37]"
                    : "text-white hover:text-[#D4AF37]"
                )}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/book"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full py-3 sm:py-4 text-center text-sm sm:text-base bg-[#D4AF37] text-black font-semibold hover:bg-[#B8941F] transition-all duration-300 mt-4 touch-manipulation"
            >
              Book Session
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
