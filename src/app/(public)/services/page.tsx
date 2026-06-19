import React from "react";
import Link from "next/link";
import { Activity, ShieldCheck, Sparkles, CheckCircle2, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ServicesPage() {
  const serviceList = [
    {
      title: "Cosmetic Restoration",
      description: "Smile designs using custom porcelain veneers, teeth whitening, and structural bonding.",
      time: "1 - 2 sessions",
      price: "$350 - $1,200",
      benefits: ["Shade matching", "Stain resistance", "Minimal preparation option"],
    },
    {
      title: "Dental Implants",
      description: "Surgical titanium post placement topped with natural-looking prosthetic crowns.",
      time: "3 - 6 months (incl. healing)",
      price: "From $1,500",
      benefits: ["High durability", "Prevents bone loss", "Full masticatory function"],
    },
    {
      title: "Clear Aligners (Invisalign)",
      description: "Discreet clear plastic alignment trays changed every two weeks to straighten teeth.",
      time: "6 - 12 months",
      price: "$3,500 - $5,000",
      benefits: ["Removable tray inserts", "Virtually invisible", "Easier brushing/flossing"],
    },
    {
      title: "Endodontic Root Canal",
      description: "Removal of infected inner tooth pulp to resolve pain and save structural dentin.",
      time: "1 session",
      price: "$600 - $800",
      benefits: ["Immediate pain relief", "Infection control", "Standard local anesthesia"],
    },
    {
      title: "Preventative Hygiene",
      description: "Professional plaque scaling, polishing, fluoride treatments, and digital X-rays.",
      time: "45 minutes",
      price: "Fully Covered by PPO",
      benefits: ["Tartar removal", "Cavity prevention", "Oral cancer screening"],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">Clinical Treatments & Services</h1>
        <p className="text-sm text-muted-foreground mt-3 px-4">
          Explore our range of general, cosmetic, and surgical treatments. We accept most major PPO insurances.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 sm:px-0">
        {serviceList.map((svc, i) => (
          <div key={i} className="flex flex-col h-full rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-200">
            <div className="p-6 flex-1 space-y-4">
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <h3 className="font-bold text-base text-foreground">{svc.title}</h3>
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-wider">{svc.price}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{svc.description}</p>
              
              <div className="space-y-2 pt-2">
                {svc.benefits.map((b, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-4 bg-muted/20 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center space-x-1"><Clock size={12} /> <span>{svc.time}</span></span>
              <Link href="/book" className="text-xs font-semibold text-primary hover:underline flex items-center space-x-0.5">
                <span>Book Slot</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/15 rounded-2xl p-8 max-w-4xl mx-auto">
        <h3 className="text-lg font-bold text-foreground">Have questions about clinical eligibility?</h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-lg mx-auto">
          Engage with our floating **AI Receptionist** (bottom right) to describe your symptoms or verify if your insurance covers these procedures!
        </p>
      </div>
    </div>
  );
}
