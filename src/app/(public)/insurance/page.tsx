import React from "react";
import Link from "next/link";
import { ShieldCheck, HeartHandshake, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function InsurancePage() {
  const networks = [
    "Delta Dental Premier / PPO",
    "Aetna PPO Dental Network",
    "Blue Cross Blue Shield Dental Grid",
    "Cigna Dental Choice / PPO",
    "MetLife PDP Plus Network",
    "Guardian Dental Choice PPO",
    "United Concordia Alliance",
    "Humana Dental Network",
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">Insurance & Billing Guidelines</h1>
        <p className="text-sm text-muted-foreground mt-3 px-4">
          We maximize your dental coverage benefits by filing claims directly with PPO providers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* Left Side: Accepted Networks */}
        <div className="p-6 rounded-xl border border-border bg-card space-y-6">
          <div className="flex items-center space-x-2 border-b border-border/40 pb-3">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-base text-foreground">Accepted PPO Networks</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            We are in-network with almost all major PPO insurance policies. If you hold a PPO card, we can process your diagnostic cleaning and standard restorations smoothly.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
            {networks.map((net, i) => (
              <div key={i} className="flex items-center space-x-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span>{net}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Billing Policy & Care Credit */}
        <div className="p-6 rounded-xl border border-border bg-card space-y-6">
          <div className="flex items-center space-x-2 border-b border-border/40 pb-3">
            <HeartHandshake className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-base text-foreground">Alternative Payment & Financing</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Don't have PPO insurance? Don't worry! We believe dental healthcare should be accessible. We offer flexible options to keep your smile healthy:
          </p>
          <ul className="space-y-3 text-xs text-muted-foreground">
            <li className="relative pl-6">
              <span className="absolute left-0 top-0.5 h-1.5 w-1.5 rounded-full bg-primary" />
              <strong className="text-foreground">In-House Savings Club:</strong> $299/year covering 2 diagnostic cleanings, x-rays, and 15% off all structural fillings and crowns.
            </li>
            <li className="relative pl-6">
              <span className="absolute left-0 top-0.5 h-1.5 w-1.5 rounded-full bg-primary" />
              <strong className="text-foreground">0% Interest Financing:</strong> Split implant or Invisalign procedures into 12 monthly payments with CareCredit.
            </li>
            <li className="relative pl-6">
              <span className="absolute left-0 top-0.5 h-1.5 w-1.5 rounded-full bg-primary" />
              <strong className="text-foreground">HSA & FSA Accepted:</strong> Pay directly with your health savings accounts debit cards.
            </li>
          </ul>
        </div>

      </div>

      <div className="text-center pt-6">
        <Link href="/book">
          <Button size="md" className="text-xs font-bold px-6 py-2.5">Schedule Diagnostic Checkup</Button>
        </Link>
      </div>
    </div>
  );
}
