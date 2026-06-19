import React from "react";
import Link from "next/link";
import { ShieldCheck, Sparkles, CheckCircle2, ChevronRight, Activity, Smile } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function TreatmentsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-16">
      
      {/* Introduction */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-foreground tracking-tight">Specialized Clinical Restorations</h1>
        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
          At Apex Dental, we focus on treatments that improve function and aesthetic appeal. Learn about our custom restorative dental implants and Invisalign aligner systems.
        </p>
      </div>

      {/* Dental Implants Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center border-b border-border/60 pb-16">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 text-primary rounded-full px-3 py-1 text-xs font-semibold">
            <Activity size={12} />
            <span>Permanent Restoration</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Dental Implants</h2>
          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
            Missing teeth can lead to bone decay, bite shifting, and chewing difficulties. A dental implant is a permanent solution that functions like a natural tooth. A biocompatible titanium post acts as the root, fusing with the jawbone before receiving a custom-milled porcelain crown.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Fused titanium support anchor</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Full jawbone bone density preservation</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Porcelain crown matches tooth shade</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Doesn't affect adjacent healthy teeth</span>
            </div>
          </div>
          <div className="pt-2">
            <Link href="/book">
              <Button size="sm" className="text-xs font-bold">Schedule Implant Evaluation</Button>
            </Link>
          </div>
        </div>
        <div className="lg:col-span-5 p-6 rounded-xl border border-border bg-muted/20">
          <h4 className="font-bold text-xs uppercase tracking-wider text-primary mb-3">Implant Procedure Pipeline</h4>
          <ol className="space-y-4 text-xs text-muted-foreground">
            <li className="relative pl-6">
              <span className="absolute left-0 top-0.5 text-[9px] font-bold h-4 w-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center">1</span>
              <strong className="text-foreground">3D Scan & Bone Assessment:</strong> Dr. Mitchell assesses jaw density and schedules surgery.
            </li>
            <li className="relative pl-6">
              <span className="absolute left-0 top-0.5 text-[9px] font-bold h-4 w-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center">2</span>
              <strong className="text-foreground">Post Placement:</strong> The titanium anchor is placed. Osseointegration occurs over 3-6 months.
            </li>
            <li className="relative pl-6">
              <span className="absolute left-0 top-0.5 text-[9px] font-bold h-4 w-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center">3</span>
              <strong className="text-foreground">Crown Delivery:</strong> A custom-shaded porcelain crown is attached.
            </li>
          </ol>
        </div>
      </div>

      {/* Invisalign Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5 p-6 rounded-xl border border-border bg-muted/20 order-2 lg:order-1">
          <h4 className="font-bold text-xs uppercase tracking-wider text-primary mb-3">Orthodontic Comparison</h4>
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/60">
                  <th className="pb-2 text-foreground">Feature</th>
                  <th className="pb-2 text-primary font-semibold">Invisalign</th>
                  <th className="pb-2 text-muted-foreground">Metal Brackets</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30 text-muted-foreground">
                <tr>
                  <td className="py-2 font-medium text-foreground">Aesthetic</td>
                  <td className="py-2">Invisible Polyurethane</td>
                  <td className="py-2">Silver Metal wires</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium text-foreground">Comfort</td>
                  <td className="py-2">Smooth, removable</td>
                  <td className="py-2">Irritating, sharp metal</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium text-foreground">Cleanliness</td>
                  <td className="py-2">Remove to brush</td>
                  <td className="py-2">Food traps, hard to clean</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium text-foreground">Care Duration</td>
                  <td className="py-2">6 - 12 Months</td>
                  <td className="py-2">18 - 24 Months</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
          <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 text-primary rounded-full px-3 py-1 text-xs font-semibold">
            <Smile size={12} />
            <span>Orthodontic Alignment</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Invisalign Clear Aligners</h2>
          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
            Invisalign uses smooth, clear polyurethane trays to straighten teeth without metal wires. You can remove the trays to eat and brush, making it easier to maintain dental hygiene during treatment.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Removable aligners for meals & brushing</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Gold Invisalign Provider on site</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>3D scan shows progress previews</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Trays changed biweekly at home</span>
            </div>
          </div>
          <div className="pt-2">
            <Link href="/book">
              <Button size="sm" className="text-xs font-bold">Schedule Invisalign Scan</Button>
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
