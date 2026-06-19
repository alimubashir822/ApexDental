"use client";

import React, { useState, useTransition } from "react";
import { createCampaignAction, triggerCampaignAction } from "@/lib/lead-actions";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import {
  Megaphone,
  Plus,
  Send,
  Sparkles,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  X,
  Bot,
  Mail,
  Smartphone,
} from "lucide-react";
import confetti from "canvas-confetti";
import { generateCampaignCopy } from "@/lib/ai-service";

interface Campaign {
  id: string;
  name: string;
  type: string;
  subject: string | null;
  content: string;
  audienceSegment: string;
  status: string;
  leadsCount: number;
  appointmentsCount: number;
  conversionsCount: number;
  revenue: number;
  createdAt: Date;
}

export function CampaignPortal({ initialCampaigns }: { initialCampaigns: Campaign[] }) {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  // AI assistant states
  const [aiService, setAiService] = useState("Dental Implant");
  const [aiOffer, setAiOffer] = useState("Free Consultation & 3D Imaging Scan");
  const [aiChannel, setAiChannel] = useState<"EMAIL" | "SMS">("EMAIL");

  const segments = [
    { value: "ALL", label: "All Patients & Leads" },
    { value: "LEADS_ONLY", label: "Active Leads Only" },
    { value: "PATIENTS_ONLY", label: "Registered Patients Only" },
    { value: "INACTIVE_PATIENTS", label: "Inactive Patients (12+ Months No Visit)" },
  ];

  const handleGenerateAICopy = () => {
    const copy = generateCampaignCopy(aiService, aiOffer, aiChannel);
    
    // Autofill form inputs
    const subjectInput = document.getElementById("subject") as HTMLInputElement;
    const contentTextarea = document.getElementById("content") as HTMLTextAreaElement;
    const nameInput = document.getElementById("name") as HTMLInputElement;

    if (nameInput) {
      nameInput.value = `${aiService} ${aiChannel === "EMAIL" ? "Newsletter" : "Outreach"} - ${new Date().toLocaleDateString()}`;
    }

    if (aiChannel === "EMAIL" && typeof copy === "object") {
      if (subjectInput) subjectInput.value = copy.subject || "";
      if (contentTextarea) contentTextarea.value = copy.content;
    } else if (aiChannel === "SMS" && typeof copy === "string") {
      if (subjectInput) subjectInput.value = "";
      if (contentTextarea) contentTextarea.value = copy;
    }

    confetti({
      particleCount: 30,
      spread: 30,
      colors: ["#14b8a6", "#38bdf8"],
    });
  };

  const handleCreateCampaign = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await createCampaignAction(formData);
      if (res.success) {
        setIsOpen(false);
        window.location.reload();
      }
    });
  };

  const handleExecuteCampaign = async (id: string) => {
    startTransition(async () => {
      const res = await triggerCampaignAction(id);
      if (res.success) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
        window.location.reload();
      }
    });
  };

  // Aggregated Marketing Stats
  const sentCampaigns = campaigns.filter((c) => c.status === "SENT");
  const totalMarketingRevenue = sentCampaigns.reduce((sum, c) => sum + c.revenue, 0);
  const totalMarketingLeads = sentCampaigns.reduce((sum, c) => sum + c.leadsCount, 0);
  const totalMarketingAppts = sentCampaigns.reduce((sum, c) => sum + c.appointmentsCount, 0);

  return (
    <div className="space-y-8 w-full">
      {/* Page header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-extrabold text-foreground tracking-tight">Marketing Campaigns</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Design email & SMS retention flows to drive patient conversions.</p>
        </div>
        <Button
          onClick={() => setIsOpen(true)}
          className="text-xs font-bold py-1.5 px-3 flex items-center space-x-1"
        >
          <Plus size={14} />
          <span>Create Outreach Campaign</span>
        </Button>
      </div>

      {/* Aggregate metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-5 rounded-xl border border-border bg-card shadow-sm flex items-center space-x-3">
          <div className="h-9 w-9 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
            <TrendingUp size={18} />
          </div>
          <div>
            <h4 className="text-[9px] uppercase font-bold text-muted-foreground">Outreach Revenue</h4>
            <p className="text-base font-extrabold text-foreground mt-0.5">${totalMarketingRevenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="p-5 rounded-xl border border-border bg-card shadow-sm flex items-center space-x-3">
          <div className="h-9 w-9 bg-teal-500/10 text-teal-600 rounded-lg flex items-center justify-center">
            <Users size={18} />
          </div>
          <div>
            <h4 className="text-[9px] uppercase font-bold text-muted-foreground">Generated Leads</h4>
            <p className="text-base font-extrabold text-foreground mt-0.5">{totalMarketingLeads}</p>
          </div>
        </div>

        <div className="p-5 rounded-xl border border-border bg-card shadow-sm flex items-center space-x-3">
          <div className="h-9 w-9 bg-indigo-500/10 text-indigo-600 rounded-lg flex items-center justify-center">
            <Calendar size={18} />
          </div>
          <div>
            <h4 className="text-[9px] uppercase font-bold text-muted-foreground">Booked Appts</h4>
            <p className="text-base font-extrabold text-foreground mt-0.5">{totalMarketingAppts}</p>
          </div>
        </div>

        <div className="p-5 rounded-xl border border-border bg-card shadow-sm flex items-center space-x-3">
          <div className="h-9 w-9 bg-emerald-500/10 text-emerald-600 rounded-lg flex items-center justify-center">
            <DollarSign size={18} />
          </div>
          <div>
            <h4 className="text-[9px] uppercase font-bold text-muted-foreground">Campaigns Executed</h4>
            <p className="text-base font-extrabold text-foreground mt-0.5">{sentCampaigns.length}</p>
          </div>
        </div>
      </div>

      {/* Campaigns Listing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {campaigns.map((c) => (
          <div
            key={c.id}
            className={`p-6 rounded-xl border border-border bg-card shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow relative overflow-hidden`}
          >
            {/* Top row */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center space-x-1">
                  {c.type === "EMAIL" ? <Mail size={10} /> : <Smartphone size={10} />}
                  <span>{c.type}</span>
                </span>
                <Badge variant={c.status === "SENT" ? "success" : "outline"}>
                  {c.status}
                </Badge>
              </div>

              <h3 className="font-extrabold text-sm text-foreground">{c.name}</h3>
              <p className="text-[10px] text-muted-foreground">Segment: <span className="font-semibold">{c.audienceSegment}</span></p>
              
              <div className="p-3 bg-muted/40 border border-border/30 rounded-lg text-xs leading-relaxed text-muted-foreground max-h-24 overflow-y-auto whitespace-pre-wrap">
                {c.subject && <strong className="text-foreground block mb-1">Subject: {c.subject}</strong>}
                {c.content}
              </div>
            </div>

            {/* Bottom Row - metrics or execute button */}
            <div className="border-t border-border/40 pt-4 flex items-center justify-between">
              {c.status === "DRAFT" ? (
                <Button
                  onClick={() => handleExecuteCampaign(c.id)}
                  disabled={isPending}
                  className="w-full text-xs font-semibold py-2 flex items-center justify-center space-x-1.5"
                >
                  <Send size={12} />
                  <span>Execute Outreach Blast</span>
                </Button>
              ) : (
                <div className="grid grid-cols-4 gap-2 w-full text-center text-xs">
                  <div>
                    <div className="font-extrabold text-foreground">{c.leadsCount}</div>
                    <div className="text-[8px] text-muted-foreground uppercase tracking-wider">Leads</div>
                  </div>
                  <div>
                    <div className="font-extrabold text-foreground">{c.appointmentsCount}</div>
                    <div className="text-[8px] text-muted-foreground uppercase tracking-wider">Appts</div>
                  </div>
                  <div>
                    <div className="font-extrabold text-foreground">{c.conversionsCount}</div>
                    <div className="text-[8px] text-muted-foreground uppercase tracking-wider">Conv</div>
                  </div>
                  <div>
                    <div className="font-extrabold text-emerald-600">${c.revenue.toLocaleString()}</div>
                    <div className="text-[8px] text-muted-foreground uppercase tracking-wider">Revenue</div>
                  </div>
                </div>
              )}
            </div>

          </div>
        ))}
      </div>

      {/* Modal: Create campaign and AI generator */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-4xl rounded-2xl border border-border shadow-2xl overflow-hidden glass-panel grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left Column: Input Form */}
            <form onSubmit={handleCreateCampaign} className="lg:col-span-7 flex flex-col h-[520px]">
              <div className="flex items-center justify-between p-4 border-b border-border bg-muted/20 shrink-0">
                <h3 className="text-sm font-bold text-foreground">Compose Outreach Campaign</h3>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-foreground hover:bg-muted p-1.5 rounded-lg cursor-pointer lg:hidden"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-6 space-y-4 flex-1 overflow-y-auto text-xs">
                <Input
                  id="name"
                  name="name"
                  label="Campaign Reference Name"
                  placeholder="e.g. Invisalign Recall June"
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <Select
                    name="type"
                    label="Delivery Channel"
                    options={[
                      { value: "EMAIL", label: "Email Campaign" },
                      { value: "SMS", label: "SMS Broadcast" },
                    ]}
                    defaultValue="EMAIL"
                  />
                  <Select
                    name="audienceSegment"
                    label="Audience Segment"
                    options={segments}
                    defaultValue="ALL"
                  />
                </div>

                <Input
                  id="subject"
                  name="subject"
                  label="Email Subject (Optional for SMS)"
                  placeholder="Get 20% off your diagnostic consultation!"
                />

                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs font-semibold leading-none text-muted-foreground">
                    Message Body Content
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    placeholder="Compose email body or SMS message here..."
                    required
                    className="flex-1 min-h-[140px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary text-foreground"
                  />
                </div>
              </div>

              <div className="p-4 border-t border-border bg-muted/20 flex justify-end space-x-2 shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="text-xs font-bold"
                  isLoading={isPending}
                >
                  Save Draft
                </Button>
              </div>
            </form>

            {/* Right Column: AI Assistant Copywriter */}
            <div className="lg:col-span-5 bg-muted/25 border-l border-border flex flex-col h-[520px]">
              <div className="flex items-center justify-between p-4 border-b border-border bg-primary/5 shrink-0">
                <div className="flex items-center space-x-2 text-xs font-bold text-primary">
                  <Bot size={15} />
                  <span>AI Copywriting Assistant</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-foreground hover:bg-muted p-1.5 rounded-lg cursor-pointer hidden lg:block"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-6 space-y-4 flex-1 overflow-y-auto text-xs">
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Configure clinical offers and click **Generate** to automatically write and load subjects/body copy directly into the compose editor!
                </p>

                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">1. Select Service Topic</label>
                  <select
                    value={aiService}
                    onChange={(e) => setAiService(e.target.value)}
                    className="flex h-9 w-full rounded-lg border border-input bg-card px-3 py-1.5 text-xs focus:outline-none focus:border-primary text-foreground"
                  >
                    <option value="Dental Implant">Dental Implants</option>
                    <option value="Invisalign">Invisalign Orthodontics</option>
                    <option value="Teeth Whitening">Teeth Whitening</option>
                    <option value="Dental Veneers">Cosmetic Veneers</option>
                    <option value="Preventative Cleaning">Preventative checkups</option>
                  </select>
                </div>

                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">2. Campaign Promotion Offer</label>
                  <input
                    type="text"
                    value={aiOffer}
                    onChange={(e) => setAiOffer(e.target.value)}
                    placeholder="e.g. Free consultation, 20% off whitening"
                    className="flex h-9 w-full rounded-lg border border-input bg-card px-3 py-1.5 text-xs focus:outline-none focus:border-primary text-foreground"
                  />
                </div>

                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">3. Copywriter Channel</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setAiChannel("EMAIL")}
                      className={`py-1.5 rounded-lg border text-xs font-semibold cursor-pointer ${
                        aiChannel === "EMAIL"
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-card text-foreground"
                      }`}
                    >
                      Email Newsletter
                    </button>
                    <button
                      type="button"
                      onClick={() => setAiChannel("SMS")}
                      className={`py-1.5 rounded-lg border text-xs font-semibold cursor-pointer ${
                        aiChannel === "SMS"
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-card text-foreground"
                      }`}
                    >
                      SMS Message
                    </button>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={handleGenerateAICopy}
                  className="w-full text-xs font-bold py-2.5 flex items-center justify-center space-x-1.5 mt-4"
                >
                  <Sparkles size={13} />
                  <span>Generate Campaign Copy</span>
                </Button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
