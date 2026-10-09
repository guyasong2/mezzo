"use client";

import Link from "next/link";
import NextImage from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import LayoutDashboard from "lucide-react/dist/esm/icons/layout-dashboard.mjs";
import GalleryIcon from "lucide-react/dist/esm/icons/images.mjs";
import DollarSign from "lucide-react/dist/esm/icons/dollar-sign.mjs";
import CalendarIcon from "lucide-react/dist/esm/icons/calendar.mjs";
import Settings from "lucide-react/dist/esm/icons/settings.mjs";
import LogOut from "lucide-react/dist/esm/icons/log-out.mjs";
import UserIcon from "lucide-react/dist/esm/icons/user.mjs";
import MenuIcon from "lucide-react/dist/esm/icons/menu.mjs";
import XIcon from "lucide-react/dist/esm/icons/x.mjs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Gallery", href: "/admin/gallery", icon: GalleryIcon },
  { name: "Pricing", href: "/admin/pricing", icon: DollarSign },
  { name: "Bookings", href: "/admin/bookings", icon: CalendarIcon },
  { name: "About", href: "/admin/about", icon: UserIcon },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <nav className="fixed top-0 z-50 w-full bg-background border-b border-border">
      <div className="px-4 sm:px-6 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/admin/dashboard" className="flex items-center">
              <NextImage
                src="/logo-with-lines-backup.png"
                alt="Steve Mezzo Images"
                width={40}
                height={40}
                className="object-contain"
              />
            </Link>
            <div className="hidden md:flex items-center gap-4">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors",
                      pathname === item.href
                        ? "text-gold"
                        : "text-foreground/70 hover:text-gold"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
              <Link href="/" target="_blank">
                View Site
              </Link>
            </Button>
            <Button onClick={handleLogout} variant="outline" size="sm" className="hidden sm:inline-flex">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-foreground/70 hover:text-foreground"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <XIcon className="w-6 h-6" />
              ) : (
                <MenuIcon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-4 py-3 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-md transition-colors",
                    pathname === item.href
                      ? "text-gold bg-gold/10"
                      : "text-foreground/70 hover:text-gold hover:bg-gold/5"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
            <div className="border-t border-border pt-3 mt-3 space-y-1">
              <Link
                href="/"
                target="_blank"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-foreground/70 hover:text-foreground rounded-md"
              >
                View Site
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-md w-full text-left"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
