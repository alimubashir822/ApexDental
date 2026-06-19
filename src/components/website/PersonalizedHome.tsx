"use client";

import React, { useState } from "react";
import { LeadForm } from "@/components/website/LeadForm";
import { Activity, Shield, Sparkles, HeartHandshake, Award, Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function PersonalizedHome() {
  const [personalization, setPersonalization] = useState<"ALL" | "IMPLANT" | "INVISALIGN" | "WHITENING">("ALL");

  // Content map for personalization
  const content = {
    ALL: {
      tag: "Next-Gen Dental Practice Portal",
      title: "World-Class Dentistry Meets AI Automation",
      desc: "Apex Dental utilizes advanced restoration diagnostics and clear orthodontics. Experience zero-friction booking, quick insurance approvals, and 24/7 AI Receptionist support.",
      statTitle: "12K+",
      statDesc: "Smiles Restored",
      cta: "Book Diagnostic Cleanup",
      defaultService: "General Checkup",
    },
    IMPLANT: {
      tag: "Permanent Restorative Surgery",
      title: "Say Goodbye to Missing Teeth: Premium Implants",
      desc: "Struggling with missing teeth or loose dentures? Our chief surgeon Dr. Mitchell specializes in biocompatible implants with 3D guided placement. Restore full chewing function and prevent bone decay.",
      statTitle: "99.2%",
      statDesc: "Implant Success Rate",
      cta: "Reserve Implant Scan",
      defaultService: "Dental Implant",
    },
    INVISALIGN: {
      tag: "Discreet Aligning Orthodontics",
      title: "Get Your Perfect Smile: Invisalign Clear Braces",
      desc: "Straighten your teeth comfortably and invisibly. We use advanced digital scanners to draft your orthodontic progression. Monthly payment plans starting at $99/month, no down payment.",
      statTitle: "6-12 mo",
      statDesc: "Avg Treatment Time",
      cta: "Schedule Invisalign Consult",
      defaultService: "Invisalign",
    },
    WHITENING: {
      tag: "Cosmetic Smile Boost",
      title: "Brighten Your Confidence: Summer Whitening Promos",
      desc: "Get your teeth up to 8 shades lighter in just 45 minutes. Our clinical-strength whitening gel is painless and yields immediate results. Standard cleanings are fully covered by PPO insurance.",
      statTitle: "8 Shades",
      statDesc: "Lighter in 45 Min",
      cta: "Schedule Whitening Session",
      defaultService: "Teeth Whitening",
    },
  };

  const active = content[personalization];

  return (
    <div className="flex flex-col w-full">
      {/* Dynamic Demo Toggle Header */}
      <div className="w-full bg-slate-900 text-slate-100 py-3.5 border-b border-slate-800 text-center text-xs font-semibold px-4 relative z-20 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-1.5 text-[11px] md:text-xs">
            <Sparkles size={14} className="text-teal-400 animate-pulse" />
            <span><strong>AI Website Personalization:</strong> Select visitor search intent to simulate dynamic landing pages.</span>
          </div>
          <div className="flex flex-nowrap overflow-x-auto max-w-full justify-start md:justify-center gap-1.5 pb-1 md:pb-0 scrollbar-none w-full md:w-auto">
            {[
              { id: "ALL", label: "Default Site" },
              { id: "IMPLANT", label: "Implant Searcher" },
              { id: "INVISALIGN", label: "Invisalign Searcher" },
              { id: "WHITENING", label: "Whitening Searcher" },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setPersonalization(btn.id as any)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all cursor-pointer shrink-0 ${
                  personalization === btn.id
                    ? "bg-teal-400 border-teal-400 text-slate-900 shadow-sm"
                    : "border-slate-700 bg-slate-850 hover:bg-slate-800 text-slate-300"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative w-full py-14 md:py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5 overflow-hidden">
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 flex flex-col space-y-6">
              <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 text-primary rounded-full px-3 py-1 text-xs font-semibold w-fit">
                <Sparkles size={12} className="text-primary animate-pulse" />
                <span>{active.tag}</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1] transition-all duration-300">
                {active.title}
              </h1>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-xl transition-all duration-300">
                {active.desc}
              </p>
              
              {/* Ticker / Highlights */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border max-w-lg">
                <div>
                  <h4 className="text-xl md:text-2xl font-bold text-foreground">4.9/5 ★</h4>
                  <p className="text-xs text-muted-foreground">Patient Rating</p>
                </div>
                <div>
                  <h4 className="text-xl md:text-2xl font-bold text-foreground transition-all duration-300">{active.statTitle}</h4>
                  <p className="text-xs text-muted-foreground transition-all duration-300">{active.statDesc}</p>
                </div>
                <div>
                  <h4 className="text-xl md:text-2xl font-bold text-foreground">100%</h4>
                  <p className="text-xs text-muted-foreground">PPO Plans Covered</p>
                </div>
              </div>
            </div>

            {/* Right Form Column */}
            <div className="lg:col-span-5">
              <LeadForm defaultService={active.defaultService} />
            </div>

          </div>
        </div>
      </section>

      {/* Trust & Certifications Ticker */}
      <section className="w-full py-6 border-y border-border bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-around gap-6">
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Award className="h-4 w-4 text-primary" />
            <span className="font-semibold">ADA Registered Clinic</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Shield className="h-4 w-4 text-primary" />
            <span className="font-semibold">HIPAA Protected Records</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <HeartHandshake className="h-4 w-4 text-primary" />
            <span className="font-semibold">Dentistry Excellence Award</span>
          </div>
        </div>
      </section>

      {/* Services Showcase */}
      <section className="w-full py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-foreground tracking-tight">Our Premium Specializations</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Combining world-class clinical expertise with state-of-the-art dental technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-all duration-300">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                <Activity size={20} />
              </div>
              <h3 className="font-bold text-base text-foreground mb-2">Premium Dental Implants</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Restore missing teeth with custom porcelain crowns anchored securely by biocompatible titanium posts. Designed to last a lifetime.
              </p>
              <Link href="/treatments" className="text-xs font-semibold text-primary hover:underline mt-4 inline-block">
                Learn about Implants &rarr;
              </Link>
            </div>

            <div className="p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-all duration-300">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                <Sparkles size={20} />
              </div>
              <h3 className="font-bold text-base text-foreground mb-2">Invisalign Clear Aligners</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Straighten your teeth comfortably and discreetly without metal brackets. Fully customized orthodontic alignment using advanced 3D scanning.
              </p>
              <Link href="/treatments" className="text-xs font-semibold text-primary hover:underline mt-4 inline-block">
                Learn about Invisalign &rarr;
              </Link>
            </div>

            <div className="p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-all duration-300">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                <Shield size={20} />
              </div>
              <h3 className="font-bold text-base text-foreground mb-2">General Oral Wellness</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Comprehensive diagnostic exams, advanced cleanings, root canals, and structural crowns. Focused on preventative hygiene for lifelong dental health.
              </p>
              <Link href="/services" className="text-xs font-semibold text-primary hover:underline mt-4 inline-block">
                Learn about Services &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
