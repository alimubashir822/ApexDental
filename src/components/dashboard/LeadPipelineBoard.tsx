"use client";

import React, { useState, useTransition } from "react";
import { updateLeadStatusAction, createLeadAction, deleteLeadAction } from "@/lib/lead-actions";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import {
  Plus,
  Trash2,
  Phone,
  Mail,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Info,
  X,
  MessageSquare,
  TrendingUp,
  AlertTriangle,
  Coins,
  Bot,
  Zap,
} from "lucide-react";
import confetti from "canvas-confetti";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  source: string;
  interestedService: string;
  notes: string | null;
  leadScore: number;
  intentLevel: string;
  readiness: string;
  estimatedValue: number;
  createdAt: Date;
}

export function LeadPipelineBoard({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const columns = [
    { id: "NEW", title: "New Inquiry", color: "border-t-purple-500 bg-purple-500/5 text-purple-700" },
    { id: "CONSULTATION_REQUESTED", title: "Consult Requested", color: "border-t-blue-500 bg-blue-500/5 text-blue-700" },
    { id: "APPOINTMENT_BOOKED", title: "Appt Scheduled", color: "border-t-amber-500 bg-amber-500/5 text-amber-700" },
    { id: "VISITED", title: "Visited Clinic", color: "border-t-rose-500 bg-rose-500/5 text-rose-700" },
    { id: "TREATMENT_ACCEPTED", title: "Treatment Accepted", color: "border-t-emerald-500 bg-emerald-500/5 text-emerald-700" },
    { id: "RETURNING", title: "Returning Patient", color: "border-t-teal-500 bg-teal-500/5 text-teal-700" },
  ];

  const services = [
    { value: "Dental Implant", label: "Dental Implants ($1,500)" },
    { value: "Invisalign", label: "Invisalign Clear Aligners ($3,500)" },
    { value: "Teeth Whitening", label: "Teeth Whitening ($350)" },
    { value: "Dental Veneers", label: "Cosmetic Veneers ($6,000)" },
    { value: "Root Canal", label: "Root Canal Therapy ($800)" },
    { value: "General Checkup", label: "General Checkup ($150)" },
  ];

  const sources = [
    { value: "GOOGLE_ADS", label: "Google Ads" },
    { value: "FACEBOOK", label: "Facebook" },
    { value: "WEBSITE_CHAT", label: "Website Chat" },
    { value: "WEBSITE_FORM", label: "Website Form" },
    { value: "DIRECT_CALL", label: "Direct Call" },
    { value: "REFERRAL", label: "Referral" },
  ];

  const handleStatusChange = async (leadId: string, currentStatus: string, direction: "left" | "right") => {
    const colOrder = ["NEW", "CONSULTATION_REQUESTED", "APPOINTMENT_BOOKED", "VISITED", "TREATMENT_ACCEPTED", "RETURNING"];
    const currIdx = colOrder.indexOf(currentStatus);
    let nextIdx = currIdx + (direction === "right" ? 1 : -1);

    if (nextIdx < 0 || nextIdx >= colOrder.length) return;
    const nextStatus = colOrder[nextIdx];

    // Optimistic update
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: nextStatus } : l))
    );

    startTransition(async () => {
      const res = await updateLeadStatusAction(leadId, nextStatus);
      if (res.success && nextStatus === "TREATMENT_ACCEPTED") {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.8 },
          colors: ["#10b981", "#34d399"],
        });
      }
    });
  };

  const handleCreateLead = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const res = await createLeadAction(formData);
      if (res.success) {
        setIsCreateOpen(false);
        window.location.reload();
      }
    });
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!confirm("Are you sure you want to archive and delete this lead?")) return;
    
    setLeads((prev) => prev.filter((l) => l.id !== leadId));
    if (selectedLead?.id === leadId) setSelectedLead(null);

    startTransition(async () => {
      await deleteLeadAction(leadId);
    });
  };

  const getSourceBadge = (source: string) => {
    const labels: Record<string, string> = {
      GOOGLE_ADS: "Google Ads",
      FACEBOOK: "Facebook",
      WEBSITE_CHAT: "AI Chatbot",
      WEBSITE_FORM: "Web Form",
      DIRECT_CALL: "Direct Call",
      REFERRAL: "Referral",
    };
    return labels[source] || source;
  };

  // Funnel calculations
  const totalPipelineValue = leads.reduce((sum, l) => sum + l.estimatedValue, 0);
  const convertedValue = leads
    .filter((l) => l.status === "TREATMENT_ACCEPTED" || l.status === "RETURNING")
    .reduce((sum, l) => sum + l.estimatedValue, 0);
  
  // Staging Leakage: Leads that haven't accepted treatment yet
  const leakedValue = leads
    .filter((l) => ["NEW", "CONSULTATION_REQUESTED", "APPOINTMENT_BOOKED", "VISITED"].includes(l.status))
    .reduce((sum, l) => sum + l.estimatedValue, 0);

  return (
    <div className="space-y-6 w-full h-full flex flex-col">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between shrink-0 gap-4">
        <div>
          <h2 className="text-sm font-bold text-foreground">AI Patient Conversion Pipeline</h2>
          <p className="text-[10px] text-muted-foreground">Track financial opportunities and leakage throughout the conversion lifecycle.</p>
        </div>
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="text-xs font-bold py-1.5 px-3 flex items-center space-x-1"
        >
          <Plus size={14} />
          <span>Add Manual Lead</span>
        </Button>
      </div>

      {/* Funnel leakage summary widget */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
        <div className="p-4 rounded-xl border border-border bg-card shadow-sm flex items-center space-x-3">
          <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <TrendingUp size={16} />
          </div>
          <div>
            <h4 className="text-[9px] uppercase font-bold text-muted-foreground">Total pipeline value</h4>
            <p className="text-sm font-extrabold text-foreground">${totalPipelineValue.toLocaleString()}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card shadow-sm flex items-center space-x-3">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <Coins size={16} />
          </div>
          <div>
            <h4 className="text-[9px] uppercase font-bold text-muted-foreground">Converted revenue</h4>
            <p className="text-sm font-extrabold text-emerald-600">${convertedValue.toLocaleString()}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 shadow-sm flex items-center space-x-3">
          <div className="h-8 w-8 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center animate-pulse">
            <AlertTriangle size={16} />
          </div>
          <div>
            <h4 className="text-[9px] uppercase font-bold text-rose-700">Funnel leak risk (stuck)</h4>
            <p className="text-sm font-extrabold text-rose-600">${leakedValue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Leakage warning notice */}
      {leakedValue > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/25 rounded-xl p-3 flex items-center space-x-2 text-amber-800 text-[11px] shrink-0 leading-relaxed">
          <AlertTriangle size={14} className="shrink-0" />
          <span>
            <strong>Funnel Leakage Detected:</strong> ${leakedValue.toLocaleString()} in potential treatment value is currently stuck in conversion stages. We recommend activating **AI Treatment Follow-ups** to recover conversions.
          </span>
        </div>
      )}

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-3.5 flex-1 overflow-x-auto pb-4">
        {columns.map((col) => {
          const colLeads = leads.filter((l) => l.status === col.id);
          const colValue = colLeads.reduce((sum, l) => sum + l.estimatedValue, 0);
          
          return (
            <div
              key={col.id}
              className={`rounded-xl border border-border bg-card/75 flex flex-col h-[490px] ${col.color.split(" ")[0]} border-t-2 overflow-hidden shadow-xs min-w-[180px]`}
            >
              {/* Column Header */}
              <div className="p-3 bg-muted/20 border-b border-border flex flex-col space-y-1 shrink-0">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-foreground truncate max-w-[120px]">{col.title}</span>
                  <Badge variant="outline" className="text-[9px] px-1 py-0">{colLeads.length}</Badge>
                </div>
                <div className="text-[9px] text-muted-foreground font-semibold">Value: ${colValue.toLocaleString()}</div>
              </div>

              {/* Column Body Cards */}
              <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {colLeads.length === 0 ? (
                  <div className="h-full flex items-center justify-center p-3 text-center text-[9px] text-muted-foreground border border-dashed border-border/40 rounded-lg">
                    Stage empty
                  </div>
                ) : (
                  colLeads.map((lead) => {
                    const scoreColors = lead.leadScore >= 85
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-600 border-amber-500/20";

                    return (
                      <div
                        key={lead.id}
                        className="p-3 rounded-lg border border-border bg-card shadow-xs hover:border-primary/30 hover:shadow-sm transition-all duration-200 space-y-2 group"
                      >
                        <div className="flex items-start justify-between">
                          <h4 className="text-xs font-bold text-foreground truncate max-w-[90px]">{lead.name}</h4>
                          <div className="flex items-center space-x-1 shrink-0">
                            <button
                              onClick={() => setSelectedLead(lead)}
                              className="p-0.5 text-muted-foreground hover:text-primary rounded hover:bg-muted cursor-pointer"
                            >
                              <Info size={10} />
                            </button>
                            <button
                              onClick={() => handleDeleteLead(lead.id)}
                              className="p-0.5 text-muted-foreground hover:text-destructive rounded hover:bg-muted cursor-pointer"
                            >
                              <Trash2 size={10} />
                            </button>
                          </div>
                        </div>

                        {/* Service & Value details */}
                        <div className="text-[10px] leading-tight space-y-1">
                          <div className="font-semibold text-foreground truncate">{lead.interestedService}</div>
                          <div className="text-primary font-extrabold text-[10px]">${lead.estimatedValue.toLocaleString()}</div>
                        </div>

                        {/* Lead scoring details */}
                        <div className="flex items-center justify-between pt-1 border-t border-border/30 text-[8px] font-bold">
                          <span className={`px-1.5 py-0.5 rounded border ${scoreColors}`}>
                            Score: {lead.leadScore}%
                          </span>
                          <span className="text-muted-foreground uppercase">{lead.intentLevel} Intent</span>
                        </div>

                        <div className="flex items-center justify-between text-[8px] text-muted-foreground pt-1.5">
                          <span className="bg-muted px-1 rounded text-foreground font-semibold truncate max-w-[70px]">
                            {getSourceBadge(lead.source)}
                          </span>
                          
                          {/* Status shifts */}
                          <div className="flex items-center space-x-1">
                            {col.id !== "NEW" && (
                              <button
                                onClick={() => handleStatusChange(lead.id, lead.status, "left")}
                                className="p-0.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded border border-border/40 cursor-pointer"
                              >
                                <ChevronLeft size={9} />
                              </button>
                            )}
                            {col.id !== "RETURNING" && (
                              <button
                                onClick={() => handleStatusChange(lead.id, lead.status, "right")}
                                className="p-0.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded border border-border/40 cursor-pointer"
                              >
                                <ChevronRight size={9} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Lead details information */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-lg rounded-2xl border border-border shadow-2xl overflow-hidden glass-panel flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/20">
              <div>
                <h3 className="text-sm font-bold text-foreground">Lead Profiler & AI Qualification</h3>
                <p className="text-[10px] text-muted-foreground">Database record ID: {selectedLead.id.substring(0, 8)}...</p>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-muted-foreground hover:text-foreground hover:bg-muted p-1.5 rounded-lg cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto max-h-[450px]">
              
              {/* Score & intent headers */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-teal-500/10 border border-primary/20 grid grid-cols-3 gap-4 text-center">
                <div>
                  <h4 className="text-[9px] uppercase font-bold text-muted-foreground">Lead Score</h4>
                  <div className="text-base font-extrabold text-primary mt-0.5">{selectedLead.leadScore}%</div>
                </div>
                <div>
                  <h4 className="text-[9px] uppercase font-bold text-muted-foreground">Intent Level</h4>
                  <div className="text-base font-extrabold text-foreground mt-0.5 flex items-center justify-center space-x-1">
                    <Zap size={12} className="text-primary" />
                    <span>{selectedLead.intentLevel}</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-[9px] uppercase font-bold text-muted-foreground">Readiness</h4>
                  <div className="text-xs font-extrabold text-foreground mt-1 truncate">{selectedLead.readiness}</div>
                </div>
              </div>

              {/* Contact info grid */}
              <div className="grid grid-cols-2 gap-4 text-xs pt-1">
                <div>
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase">Patient Contact</h4>
                  <p className="font-extrabold text-foreground mt-0.5 text-sm">{selectedLead.name}</p>
                  <p className="flex items-center space-x-1.5 text-muted-foreground mt-1">
                    <Phone size={12} />
                    <span>{selectedLead.phone}</span>
                  </p>
                  <p className="flex items-center space-x-1.5 text-muted-foreground mt-1">
                    <Mail size={12} />
                    <span>{selectedLead.email}</span>
                  </p>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase">Opportunity Metric</h4>
                  <p className="text-foreground mt-1 font-semibold">Treatment: {selectedLead.interestedService}</p>
                  <p className="text-primary font-bold mt-0.5">Est. Value: ${selectedLead.estimatedValue.toLocaleString()}</p>
                  <p className="text-muted-foreground mt-0.5">Source: {getSourceBadge(selectedLead.source)}</p>
                </div>
              </div>

              {/* Notes */}
              <div className="p-3 bg-muted/60 rounded-xl border border-border text-xs space-y-1">
                <h4 className="font-bold text-foreground flex items-center space-x-1">
                  <span>Admitting Notes & Symptoms</span>
                </h4>
                <p className="text-muted-foreground leading-relaxed italic">
                  {selectedLead.notes || "No notes registered for this lead."}
                </p>
              </div>

              {/* AI Follow-up system timeline */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center space-x-1.5">
                  <Bot size={13} className="text-primary" />
                  <span>AI Treatment Follow-up Sequence</span>
                </h4>
                
                <div className="space-y-2 text-xs">
                  <div className="p-3 border border-border rounded-xl bg-card flex justify-between items-center">
                    <div className="space-y-0.5">
                      <div className="font-bold text-foreground">Day 1 Outbound SMS</div>
                      <p className="text-[10px] text-muted-foreground">"Hi {selectedLead.name.split(" ")[0]}, do you have any questions about {selectedLead.interestedService} options?"</p>
                    </div>
                    <Badge variant="success">Executed</Badge>
                  </div>

                  <div className="p-3 border border-border rounded-xl bg-card flex justify-between items-center">
                    <div className="space-y-0.5">
                      <div className="font-bold text-foreground">Day 5 Outbound Email</div>
                      <p className="text-[10px] text-muted-foreground">"Schedule your free {selectedLead.interestedService} consult slot directly online..."</p>
                    </div>
                    <Badge variant="warning">Scheduled</Badge>
                  </div>

                  <div className="p-3 border border-border rounded-xl bg-card flex justify-between items-center">
                    <div className="space-y-0.5">
                      <div className="font-bold text-foreground">Day 14 Outbound SMS Alert</div>
                      <p className="text-[10px] text-muted-foreground">"Dr. Mitchell has orthodontic checkup slots open for this week..."</p>
                    </div>
                    <Badge variant="warning">Scheduled</Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-border bg-muted/20 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => setSelectedLead(null)}
              >
                Close Profile
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create new lead manually */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-md rounded-2xl border border-border shadow-2xl overflow-hidden glass-panel">
            <form onSubmit={handleCreateLead}>
              <div className="flex items-center justify-between p-4 border-b border-border bg-muted/20">
                <h3 className="text-sm font-bold text-foreground">Add Manual Lead</h3>
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="text-muted-foreground hover:text-foreground hover:bg-muted p-1.5 rounded-lg cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <Input
                  name="name"
                  label="Patient Full Name"
                  placeholder="e.g. Samuel L. Jackson"
                  required
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    name="email"
                    type="email"
                    label="Email Address"
                    placeholder="sam@email.com"
                    required
                  />
                  <Input
                    name="phone"
                    type="tel"
                    label="Phone Number"
                    placeholder="(555) 321-7654"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Select
                    name="service"
                    label="Interested Service"
                    options={services}
                    defaultValue="Dental Implant"
                  />
                  <Select
                    name="source"
                    label="Lead Traffic Source"
                    options={sources}
                    defaultValue="DIRECT_CALL"
                  />
                </div>

                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs font-semibold leading-none text-muted-foreground">
                    Admitting Notes & Context
                  </label>
                  <textarea
                    name="notes"
                    placeholder="Patient called stating emergency tooth pain. Interested in same-week root canal treatments."
                    className="flex min-h-[70px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary text-foreground"
                  />
                </div>
              </div>

              <div className="p-4 border-t border-border bg-muted/20 flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => setIsCreateOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="text-xs font-bold"
                  isLoading={isPending}
                >
                  Create Lead
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
