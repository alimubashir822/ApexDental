"use client";

import React, { useState } from "react";
import {
  Settings,
  Globe,
  Palette,
  Layers,
  CloudLightning,
  CheckCircle,
  RefreshCw,
  Plus,
  Trash2,
  Lock,
  Unlock,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import confetti from "canvas-confetti";

export default function SettingsPage() {
  const [brandName, setBrandName] = useState("ApexDental");
  const [customDomain, setCustomDomain] = useState("portal.apexdentalgrowth.com");
  const [domainVerified, setDomainVerified] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState("teal");
  const [isVerifying, setIsVerifying] = useState(false);

  // Tenant clinics list
  const [tenants, setTenants] = useState([
    { id: 1, name: "Apex Dental Boston (HQ)", location: "Boston, MA", doctors: 3, status: "ACTIVE", fee: "$499/mo", voiceEnabled: true },
    { id: 2, name: "Apex Dental Brookline", location: "Brookline, MA", doctors: 2, status: "ACTIVE", fee: "$299/mo", voiceEnabled: true },
    { id: 3, name: "Apex Dental Cambridge", location: "Cambridge, MA", doctors: 1, status: "ACTIVE", fee: "$299/mo", voiceEnabled: false },
  ]);

  const handleVerifyDomain = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setDomainVerified(true);
      confetti({
        particleCount: 50,
        spread: 40,
        origin: { y: 0.8 },
        colors: ["#14b8a6", "#10b981"],
      });
    }, 1200);
  };

  const handleToggleVoice = (id: number) => {
    setTenants((prev) =>
      prev.map((t) => (t.id === id ? { ...t, voiceEnabled: !t.voiceEnabled } : t))
    );
  };

  const themes = [
    { id: "teal", label: "ApexDental Teal", primary: "#0d9488", bg: "bg-teal-500" },
    { id: "indigo", label: "Apex Indigo", primary: "#4f46e5", bg: "bg-indigo-650 bg-indigo-600" },
    { id: "rose", label: "Cosmetic Rose", primary: "#ec4899", bg: "bg-rose-500" },
    { id: "purple", label: "Royal Amethyst", primary: "#8b5cf6", bg: "bg-purple-600" },
    { id: "slate", label: "Obsidian Slate", primary: "#334155", bg: "bg-slate-700" },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
          <Settings className="text-primary" />
          SaaS White-Label & Clinic Settings
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Configure agency branding, CNAME custom domain parameters, and toggle features across multi-clinic franchise instances.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Branding Customizer */}
        <div className="lg:col-span-7 space-y-6">
          {/* Custom Brand Customizer */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Palette size={14} className="text-primary" />
                SaaS Dashboard Branding & Colors
              </CardTitle>
              <CardDescription>
                Customize theme color mappings and branding names visible to your clinics' operators.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="White-Label Brand Name"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="e.g. ClinicPortal"
                />
                
                <div className="space-y-1.5">
                  <label className="font-bold text-muted-foreground">Select Active Palette Theme</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {themes.map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => setSelectedTheme(theme.id)}
                        className={`w-7 h-7 rounded-full cursor-pointer flex items-center justify-center transition-all ${theme.bg} ${
                          selectedTheme === theme.id ? "ring-4 ring-offset-2 ring-primary" : "opacity-80 hover:opacity-100"
                        }`}
                        title={theme.label}
                      >
                        {selectedTheme === theme.id && (
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Fake logo uploader */}
              <div className="space-y-1.5">
                <label className="font-bold text-muted-foreground">White-Label Client Logo</label>
                <div className="border border-dashed border-border/80 rounded-xl p-6 bg-muted/10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/20 transition-colors">
                  <Upload size={22} className="text-muted-foreground mb-2 animate-bounce" />
                  <p className="font-bold text-foreground text-[10px]">Drag & drop logo file here</p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">Supports PNG, SVG up to 2MB (transparent recommended)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Custom Domain mapping configuration */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Globe size={14} className="text-indigo-600" />
                Custom CNAME Domain Mapping
              </CardTitle>
              <CardDescription>
                Point your custom domain DNS values to our servers to route dashboard traffic under your clinic domain.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1">
                  <Input
                    label="Clinic Custom Domain"
                    value={customDomain}
                    onChange={(e) => {
                      setCustomDomain(e.target.value);
                      setDomainVerified(false);
                    }}
                    placeholder="crm.myclinic.com"
                  />
                </div>
                <Button
                  onClick={handleVerifyDomain}
                  disabled={isVerifying}
                  className="text-xs font-bold shrink-0 mb-0.5 flex items-center gap-1"
                >
                  {isVerifying ? (
                    <RefreshCw size={12} className="animate-spin" />
                  ) : (
                    <CloudLightning size={12} />
                  )}
                  {domainVerified ? "Re-verify CNAME Connection" : "Verify Domain Connection"}
                </Button>
              </div>

              {/* DNS records mapping helper */}
              <div className="space-y-2 border-t border-border pt-4">
                <h4 className="font-bold text-muted-foreground uppercase text-[9px] tracking-wider">Required DNS Configuration</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-[10px] border border-border rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-muted/60 text-muted-foreground border-b border-border font-bold">
                        <th className="p-2">Record Type</th>
                        <th className="p-2">Host / Name</th>
                        <th className="p-2">Points To</th>
                        <th className="p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-foreground">
                      <tr>
                        <td className="p-2 font-bold text-primary">CNAME</td>
                        <td className="p-2">portal</td>
                        <td className="p-2">cname.apexdentalgrowth.com</td>
                        <td className="p-2">
                          <span className={`inline-flex items-center gap-0.5 text-[9px] font-bold ${
                            domainVerified ? "text-teal-600" : "text-amber-600"
                          }`}>
                            {domainVerified ? (
                              <>
                                <CheckCircle size={10} className="fill-teal-50/10" />
                                Active
                              </>
                            ) : (
                              "Validation pending"
                            )}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Multi-Location Management */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Layers size={14} className="text-teal-650 text-teal-650" />
                Clinic Franchise Instances Manager
              </CardTitle>
              <CardDescription>
                Simulate license locks, billing, and toggle high-value features for multi-location groups.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {tenants.map((t) => (
                  <div key={t.id} className="p-3.5 rounded-xl border border-border bg-muted/10 space-y-2.5 text-xs hover:border-border/80 transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-foreground">{t.name}</h4>
                        <p className="text-[9px] text-muted-foreground">{t.location} | {t.doctors} Practitioners</p>
                      </div>
                      <Badge variant="success" className="text-[9px] font-bold px-1.5 py-0">
                        {t.status}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between border-t border-border/40 pt-2 text-[10px] text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-foreground">{t.fee}</span>
                      </div>
                      <button
                        onClick={() => handleToggleVoice(t.id)}
                        className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg border font-bold transition-all cursor-pointer ${
                          t.voiceEnabled
                            ? "bg-primary/10 text-primary border-primary/25"
                            : "bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-900"
                        }`}
                      >
                        {t.voiceEnabled ? (
                          <>
                            <Unlock size={10} />
                            <span>Voice AI Enabled</span>
                          </>
                        ) : (
                          <>
                            <Lock size={10} />
                            <span>Voice AI Locked</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <Button className="w-full text-xs font-bold py-2 flex items-center justify-center gap-1">
                <Plus size={14} /> Add New Franchise Location
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
