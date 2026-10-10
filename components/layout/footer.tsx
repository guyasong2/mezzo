import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

const footerSections = {
  services: [
    { name: "Portraits", href: "/work?category=portraits" },
    { name: "Weddings", href: "/work?category=weddings" },
    { name: "Events", href: "/work?category=events" },
    { name: "Fashion", href: "/work?category=fashion" },
  ],
  company: [
    { name: "About", href: "/about" },
    { name: "Portfolio", href: "/work" },
    { name: "Pricing", href: "/pricing" },
    { name: "Contact", href: "/contact" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-black text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
              Steve Mezzo
              <span className="block text-[#D4AF37]">Images</span>
            </h3>
            <p className="text-gray-400 text-sm sm:text-base mb-4 sm:mb-6 max-w-md leading-relaxed">
              Capturing timeless moments through the art of photography.
              Based in Texas, serving clients worldwide with passion and precision.
            </p>
            <div className="space-y-2.5 sm:space-y-3 text-gray-400 text-sm sm:text-base">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37] flex-shrink-0" />
                <span className="break-all">info@stevemezzoimages.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37] flex-shrink-0" />
                <span>+1 (469) 558-3859</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37] flex-shrink-0" />
                <span>Killeen, Texas</span>
              </div>
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="font-semibold text-base sm:text-lg mb-4 sm:mb-6 text-[#D4AF37]">Services</h4>
            <ul className="space-y-2 sm:space-y-3">
              {footerSections.services.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 text-sm sm:text-base hover:text-[#D4AF37] transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="font-semibold text-base sm:text-lg mb-4 sm:mb-6 text-[#D4AF37]">Company</h4>
            <ul className="space-y-2 sm:space-y-3">
              {footerSections.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 text-sm sm:text-base hover:text-[#D4AF37] transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="mt-10 sm:mt-12 lg:mt-16 pt-8 sm:pt-10 lg:pt-12 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
            <div className="flex gap-5 sm:gap-6">
              <a
                href="https://www.instagram.com/stevemezzo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#D4AF37] transition-colors duration-200 touch-manipulation"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/motion24studios"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#D4AF37] transition-colors duration-200 touch-manipulation"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://tiktok.com/@stevemezzoimages"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#D4AF37] transition-colors duration-200 touch-manipulation"
                aria-label="TikTok"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                </svg>
              </a>
            </div>
            <p className="text-gray-500 text-xs sm:text-sm text-center md:text-left">
              © {new Date().getFullYear()} Steve Mezzo Images. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Gold Accent Line */}
      <div className="h-0.5 sm:h-1 bg-gradient-to-r from-black via-[#D4AF37] to-black" />
    </footer>
  );
}
