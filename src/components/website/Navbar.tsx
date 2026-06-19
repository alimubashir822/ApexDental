"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, Calendar, Activity, LogIn, ShieldCheck } from "lucide-react";

interface NavbarProps {
  session: {
    name: string;
    email: string;
    role: string;
  } | null;
}

export function Navbar({ session }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/services", label: "Services" },
    { href: "/doctors", label: "Doctors" },
    { href: "/treatments", label: "Treatments" },
    { href: "/reviews", label: "Reviews" },
    { href: "/insurance", label: "Insurance" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center space-x-2 text-primary font-bold text-lg select-none hover:opacity-90 transition-opacity shrink-0"
        >
          <Activity className="h-5 w-5 md:h-6 md:w-6 text-primary animate-pulse" />
          <span className="tracking-tight text-foreground font-extrabold text-sm md:text-lg">
            Apex<span className="text-primary font-medium">Dental</span>
          </span>
        </Link>

        {/* Desktop Navigation Link Mapping */}
        <nav className="hidden lg:flex space-x-6 text-xs xl:text-sm font-semibold text-muted-foreground">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-primary transition-colors py-2"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {session ? (
            <Link
              href="/dashboard"
              className="flex items-center space-x-1.5 text-xs bg-primary/10 text-primary border border-primary/25 px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-all font-semibold shadow-sm"
            >
              <ShieldCheck size={14} />
              <span>Dashboard</span>
            </Link>
          ) : (
            <Link
              href="/dashboard"
              className="flex items-center space-x-1.5 text-xs text-muted-foreground hover:text-foreground transition-all font-semibold"
            >
              <LogIn size={14} />
              <span>Login</span>
            </Link>
          )}

          <Link
            href="/book"
            className="flex items-center space-x-1 bg-primary text-primary-foreground text-xs font-semibold px-4 py-2 rounded-lg hover:bg-primary/95 transition-all shadow hover:shadow-md cursor-pointer select-none"
          >
            <Calendar size={13} />
            <span>Book Appointment</span>
          </Link>
        </div>

        {/* Mobile Controls (Hamburger & Book CTA) */}
        <div className="flex items-center space-x-2 lg:hidden">
          {/* Direct booking shortcut button for quick mobile access */}
          <Link
            href="/book"
            className="flex items-center justify-center p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/95 transition-colors shadow shrink-0"
            title="Book Appointment"
          >
            <Calendar size={15} />
          </Link>

          {/* Toggle Hamburger Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg border border-border bg-card text-foreground hover:bg-muted transition-colors cursor-pointer focus:outline-none shrink-0"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="lg:hidden border-t border-border bg-card animate-in fade-in slide-in-from-top duration-200">
          <nav className="flex flex-col p-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 rounded-lg text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              >
                {link.label}
              </Link>
            ))}

            <div className="border-t border-border/60 my-2 pt-3 flex flex-col space-y-2.5 px-4">
              {session ? (
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center space-x-2 w-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 py-2.5 rounded-lg hover:bg-primary/20 transition-all"
                >
                  <ShieldCheck size={14} />
                  <span>Go to Staff Dashboard</span>
                </Link>
              ) : (
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center space-x-2 w-full text-xs font-bold border border-border py-2.5 rounded-lg hover:bg-muted text-foreground transition-all"
                >
                  <LogIn size={14} />
                  <span>Sign In / Login</span>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
