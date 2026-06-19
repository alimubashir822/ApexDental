import React from "react";
import Link from "next/link";
import { AIChatWidget } from "@/components/ai-chat/AIChatWidget";
import { Navbar } from "@/components/website/Navbar";
import { getSession } from "@/lib/auth";
import { Activity } from "lucide-react";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Top Banner */}
      <div className="w-full bg-primary/10 border-b border-primary/20 py-2 text-center text-[11px] sm:text-xs font-semibold text-primary px-4">
        🎉 Meet our new interactive AI Receptionist! Try asking questions at the bottom right to see live lead qualification.
      </div>

      {/* Navbar Header */}
      <Navbar session={session} />

      {/* Main Content Pages */}
      <main className="flex-1 flex flex-col">{children}</main>

      {/* Footer Details */}
      <footer className="w-full bg-muted/40 border-t border-border mt-auto py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col space-y-4">
            <Link href="/" className="flex items-center space-x-2 text-primary font-bold text-lg">
              <Activity className="h-6 w-6" />
              <span className="tracking-tight text-foreground font-extrabold">Apex<span className="text-primary font-medium">Dental</span></span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Premium clinical treatments powered by the MedStack operations platform. Attracting, retaining, and supporting patients globally.
            </p>
          </div>
          <div>
            <h5 className="font-semibold text-xs text-foreground uppercase tracking-wider mb-3">Schedules & Hours</h5>
            <ul className="text-xs text-muted-foreground space-y-2">
              <li>Monday - Friday: 8:00 AM - 6:00 PM</li>
              <li>Saturday: 9:00 AM - 3:00 PM</li>
              <li>Sunday: Emergency Appointments</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-xs text-foreground uppercase tracking-wider mb-3">Clinic Location</h5>
            <p className="text-xs text-muted-foreground leading-relaxed">
              100 Medical Plaza, Suite 400<br />
              Boston, MA 02111<br />
              Phone: (555) 234-5678
            </p>
          </div>
          <div>
            <h5 className="font-semibold text-xs text-foreground uppercase tracking-wider mb-3">Resources</h5>
            <ul className="text-xs text-muted-foreground space-y-2">
              <li><Link href="/insurance" className="hover:underline">Insurance Information</Link></li>
              <li><Link href="/blog" className="hover:underline">Oral Hygiene Blog</Link></li>
              <li><Link href="/privacy" className="hover:underline">Patient Privacy Code</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-border/60 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4 text-center sm:text-left">
          <span>&copy; {new Date().getFullYear()} Apex Dental & Growth Platform. All rights reserved.</span>
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
            <span>Powered by MedStack CRM</span>
            <span className="hidden sm:inline">|</span>
            <a href="https://www.medclinicx.com/" target="_blank" rel="noopener noreferrer" className="hover:text-primary underline font-semibold transition-colors">
              Healthcare system by Med Clinic X
            </a>
          </div>
        </div>
      </footer>

      {/* Floating Receptionist Chatbot */}
      <AIChatWidget />
    </div>
  );
}
