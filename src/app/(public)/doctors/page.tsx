import React from "react";
import Link from "next/link";
import { User, Award, CheckCircle2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function DoctorsPage() {
  const doctorList = [
    {
      name: "Dr. Sarah Mitchell",
      role: "Founder & Chief Surgeon",
      specialty: "Dental Implants & Full Mouth Reconstructions",
      education: "DDS, Harvard School of Dental Medicine",
      experience: "16+ Years Experience",
      schedule: "Mon, Wed, Fri",
      details: "Sarah leads our surgical implant center, specializing in 3D-guided bone graft replacements and cosmetic porcelain crowns.",
    },
    {
      name: "Dr. Alexander Patel",
      role: "Lead Orthodontist",
      specialty: "Clear Aligner Therapy & Dental Orthodontics",
      education: "DDS, Columbia University College of Dental Medicine",
      experience: "9+ Years Experience",
      schedule: "Tue, Thu, Sat",
      details: "Alexander is a certified Invisalign Gold Provider, managing teeth alignment for teens and adults using non-bracket systems.",
    },
    {
      name: "Dr. Amanda Carter",
      role: "Endodontic Specialist",
      specialty: "Root Canal Therapy & Microsurgery",
      education: "DDS, Boston University Henry M. Goldman School",
      experience: "7+ Years Experience",
      schedule: "Mon, Tue, Thu",
      details: "Amanda utilizes surgical microscopy to perform pain-free endodontic therapies, saving natural tooth foundations.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">Our Dental Practitioners</h1>
        <p className="text-sm text-muted-foreground mt-3 px-4">
          Meet our board-certified surgeons and orthodontists committed to your dental wellness.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 sm:px-0">
        {doctorList.map((doc, i) => (
          <div key={i} className="flex flex-col h-full rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
            {/* Header / Avatar Mock */}
            <div className="p-6 bg-primary/5 border-b border-border/40 flex items-center space-x-4">
              <div className="h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary/25 shrink-0">
                <User className="h-7 w-7" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-foreground leading-tight">{doc.name}</h3>
                <p className="text-xs text-primary font-medium mt-0.5">{doc.role}</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 space-y-4">
              <div>
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Specialty</h4>
                <p className="text-xs text-foreground mt-0.5 font-medium">{doc.specialty}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Education</h4>
                <p className="text-xs text-foreground mt-0.5">{doc.education}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Experience</h4>
                <p className="text-xs text-foreground mt-0.5">{doc.experience}</p>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed pt-2 border-t border-border/40">
                {doc.details}
              </p>
            </div>

            {/* Footer schedule */}
            <div className="p-4 bg-muted/20 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center space-x-1">
                <Calendar size={12} />
                <span>On-Site: {doc.schedule}</span>
              </span>
              <Link href="/book" className="text-xs font-semibold text-primary hover:underline">
                View Availability &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
