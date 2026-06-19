"use client";

import React, { useState, useTransition } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import {
  Search,
  User,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  FileText,
  MessageSquare,
  MapPin,
  Clock,
  ShieldAlert,
  AlertTriangle,
  Zap,
  Star,
} from "lucide-react";
import confetti from "canvas-confetti";

interface Appointment {
  id: string;
  dateTime: Date;
  duration: number;
  status: string;
  notes: string | null;
  doctorName: string;
}

interface Payment {
  id: string;
  amount: number;
  status: string;
  date: Date;
  method: string;
  notes: string | null;
}

interface Message {
  id: string;
  direction: string;
  channel: string;
  content: string;
  createdAt: Date;
}

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string | null;
  gender: string | null;
  address: string | null;
  futureOpportunityValue: number;
  lastVisitDate: Date | string | null;
  satisfactionScore: number;
  appointments: Appointment[];
  payments: Payment[];
  messages: Message[];
}

export function PatientRegistry({ initialPatients }: { initialPatients: Patient[] }) {
  const [search, setSearch] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    initialPatients.length > 0 ? initialPatients[0].id : null
  );
  const [isPending, startTransition] = useTransition();
  const [reactivatedList, setReactivatedList] = useState<string[]>([]);

  const filteredPatients = initialPatients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.phone.includes(search) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  const selectedPatient = initialPatients.find((p) => p.id === selectedPatientId);

  // Tabs inside patient profile details
  const [activeTab, setActiveTab] = useState<"appt" | "billing" | "notes" | "messages">("appt");

  // Determine if a patient represents a retention risk (no visit for 12+ months)
  const isRetentionRisk = (patient: Patient) => {
    if (!patient.lastVisitDate) return false;
    const lastVisit = new Date(patient.lastVisitDate);
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    return lastVisit < twelveMonthsAgo;
  };

  const handleReactivate = (patientId: string, patientName: string) => {
    startTransition(async () => {
      // Simulate sending reactivation sequence
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setReactivatedList((prev) => [...prev, patientId]);
      
      confetti({
        particleCount: 55,
        spread: 45,
        colors: ["#10b981", "#fbbf24"],
      });
    });
  };

  const apptColors: Record<string, "primary" | "secondary" | "success" | "warning" | "destructive" | "outline"> = {
    PENDING: "warning",
    CONFIRMED: "primary",
    COMPLETED: "success",
    CANCELLED: "destructive",
  };

  // Pre-calculate selected patient values
  const hasRisk = selectedPatient ? isRetentionRisk(selectedPatient) : false;
  const totalLtv = selectedPatient
    ? selectedPatient.payments
        .filter((p) => p.status === "PAID")
        .reduce((sum, p) => sum + p.amount, 0)
    : 0;
  const isReactivated = selectedPatient ? reactivatedList.includes(selectedPatient.id) : false;

  return (
    <div className="space-y-6 w-full h-full flex flex-col">
      {/* Page Title */}
      <div className="shrink-0">
        <h2 className="text-sm font-bold text-foreground">Patients Chart Registry</h2>
        <p className="text-[10px] text-muted-foreground">Manage HIPAA-compliant files, treatment logs, and patient LTV opportunities.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 h-[560px] overflow-hidden items-stretch">
        
        {/* Left Side: Search & Patients list */}
        <div className="lg:col-span-4 border border-border rounded-xl bg-card flex flex-col h-full overflow-hidden shadow-sm">
          {/* Search Header */}
          <div className="p-3 border-b border-border bg-muted/10 shrink-0">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search patient, phone, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-background border border-border rounded-lg pl-8 pr-3 py-2 text-xs focus:outline-none focus:border-primary text-foreground"
              />
            </div>
          </div>

          {/* Patients Listing */}
          <div className="flex-1 overflow-y-auto divide-y divide-border/60">
            {filteredPatients.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground leading-normal">
                No patients found matching query.
              </div>
            ) : (
              filteredPatients.map((p) => {
                const patientRisk = isRetentionRisk(p);
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedPatientId(p.id);
                      setActiveTab("appt");
                    }}
                    className={`w-full text-left p-3.5 text-xs transition-colors flex items-center justify-between cursor-pointer ${
                      selectedPatientId === p.id
                        ? "bg-primary/5 border-l-2 border-primary"
                        : "hover:bg-muted/40"
                    }`}
                  >
                    <div>
                      <div className="font-bold text-foreground flex items-center space-x-1.5">
                        <span>{p.name}</span>
                        {patientRisk && (
                          <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                        )}
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">{p.email}</div>
                    </div>
                    <Badge variant={patientRisk ? "destructive" : "outline"} className="text-[9px]">
                      {patientRisk ? "Risk" : p.phone}
                    </Badge>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Selected Patient chart profile */}
        <div className="lg:col-span-8 flex flex-col h-full border border-border rounded-xl bg-card shadow-sm overflow-hidden">
          {selectedPatient ? (
            <div className="flex flex-col h-full overflow-hidden">
              {/* Profile Card Header Summary */}
              <div className="p-6 border-b border-border bg-muted/10 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 shrink-0">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-foreground text-sm flex items-center space-x-2">
                      <span>{selectedPatient.name}</span>
                    </h3>
                    <div className="flex flex-wrap gap-2 text-[10px] text-muted-foreground mt-1">
                      <span className="flex items-center space-x-1"><Phone size={10} /> <span>{selectedPatient.phone}</span></span>
                      <span>•</span>
                      <span className="flex items-center space-x-1"><Mail size={10} /> <span>{selectedPatient.email}</span></span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  {hasRisk && (
                    <Badge variant="destructive" className="text-[10px] font-bold animate-pulse">
                      ⚠️ Retention Risk
                    </Badge>
                  )}
                  <Badge variant="success" className="text-[10px] font-bold">
                    Active Patient
                  </Badge>
                </div>
              </div>

              {/* Patient Value Metrics Grid */}
              <div className="p-6 border-b border-border bg-muted/5 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs shrink-0">
                <div className="p-3 border border-border rounded-xl bg-card">
                  <h4 className="text-[9px] uppercase font-bold text-muted-foreground">Lifetime Value (LTV)</h4>
                  <p className="text-sm font-extrabold text-emerald-600 mt-1">${totalLtv.toLocaleString()}</p>
                </div>
                <div className="p-3 border border-border rounded-xl bg-card">
                  <h4 className="text-[9px] uppercase font-bold text-muted-foreground">Future Opportunity</h4>
                  <p className="text-sm font-extrabold text-primary mt-1">${selectedPatient.futureOpportunityValue.toLocaleString()}</p>
                </div>
                <div className="p-3 border border-border rounded-xl bg-card">
                  <h4 className="text-[9px] uppercase font-bold text-muted-foreground">Satisfaction Rating</h4>
                  <p className="text-sm font-extrabold text-foreground mt-1 flex items-center space-x-1">
                    <Star size={14} className="fill-amber-400 text-amber-400" />
                    <span>{selectedPatient.satisfactionScore}%</span>
                  </p>
                </div>
                <div className="p-3 border border-border rounded-xl bg-card flex flex-col justify-between">
                  <h4 className="text-[9px] uppercase font-bold text-muted-foreground">Last Checkup</h4>
                  <p className="text-[10px] font-bold text-foreground mt-1 truncate">
                    {selectedPatient.lastVisitDate ? new Date(selectedPatient.lastVisitDate).toLocaleDateString() : "Never"}
                  </p>
                </div>
              </div>

              {/* Reactivation Engine Alert Block */}
              {hasRisk && (
                <div className="mx-6 mt-4 p-4 border border-rose-500/20 bg-rose-500/5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-rose-800 flex items-center space-x-1.5">
                      <AlertTriangle size={14} />
                      <span>AI Patient Reactivation Alert</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed max-w-md">
                      This patient has not visited the clinic for over 12 months. Recommend sending a hygiene recall text or diagnostic cleaning reminder.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleReactivate(selectedPatient.id, selectedPatient.name)}
                    disabled={isPending || isReactivated}
                    className="text-[10px] font-bold py-1.5 shrink-0"
                  >
                    {isReactivated ? (
                      <span className="flex items-center space-x-1"><span>Reactivation Triggered</span></span>
                    ) : (
                      <span className="flex items-center space-x-1"><Zap size={11} /> <span>Trigger AI Reactivation</span></span>
                    )}
                  </Button>
                </div>
              )}

              {/* Tabs list */}
              <div className="flex border-b border-border bg-muted/20 text-xs font-semibold shrink-0 mt-4">
                <button
                  onClick={() => setActiveTab("appt")}
                  className={`px-4 py-2.5 border-b-2 cursor-pointer transition-colors ${
                    activeTab === "appt"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="flex items-center space-x-1.5"><Calendar size={13} /> <span>Appointments ({selectedPatient.appointments.length})</span></span>
                </button>
                <button
                  onClick={() => setActiveTab("billing")}
                  className={`px-4 py-2.5 border-b-2 cursor-pointer transition-colors ${
                    activeTab === "billing"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="flex items-center space-x-1.5"><DollarSign size={13} /> <span>Ledger</span></span>
                </button>
                <button
                  onClick={() => setActiveTab("messages")}
                  className={`px-4 py-2.5 border-b-2 cursor-pointer transition-colors ${
                    activeTab === "messages"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="flex items-center space-x-1.5"><MessageSquare size={13} /> <span>Unified Messages ({selectedPatient.messages.length})</span></span>
                </button>
                <button
                  onClick={() => setActiveTab("notes")}
                  className={`px-4 py-2.5 border-b-2 cursor-pointer transition-colors ${
                    activeTab === "notes"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="flex items-center space-x-1.5"><FileText size={13} /> <span>Clinical Notes</span></span>
                </button>
              </div>

              {/* Tab Content Panels (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-6">
                
                {/* APPOINTMENTS TAB */}
                {activeTab === "appt" && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-foreground">Treatment Appointments History</h4>
                    <div className="space-y-2">
                      {selectedPatient.appointments.length === 0 ? (
                        <p className="text-xs text-muted-foreground italic">No historical appointments found.</p>
                      ) : (
                        selectedPatient.appointments.map((appt) => (
                          <div
                            key={appt.id}
                            className="p-3 border border-border rounded-lg bg-muted/15 flex items-center justify-between text-xs"
                          >
                            <div className="space-y-1">
                              <div className="font-bold text-foreground">{appt.doctorName}</div>
                              <div className="text-[10px] text-muted-foreground flex items-center space-x-2">
                                <span className="flex items-center space-x-1">
                                  <Clock size={10} />
                                  <span>{new Date(appt.dateTime).toLocaleString()}</span>
                                </span>
                                <span>•</span>
                                <span>Duration: {appt.duration} min</span>
                              </div>
                              {appt.notes && (
                                <p className="text-[10px] text-muted-foreground italic mt-1 bg-card p-1.5 border border-border/40 rounded">
                                  Notes: "{appt.notes}"
                                </p>
                              )}
                            </div>
                            <Badge variant={apptColors[appt.status] || "outline"}>
                              {appt.status}
                            </Badge>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* PAYMENTS TAB */}
                {activeTab === "billing" && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold text-foreground">Billing Ledger</h4>
                      <Badge variant="primary" className="text-[10px]">
                        Paid: ${totalLtv.toLocaleString()}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {selectedPatient.payments.length === 0 ? (
                        <p className="text-xs text-muted-foreground italic">No payment transactions registered.</p>
                      ) : (
                        selectedPatient.payments.map((pay) => (
                          <div
                            key={pay.id}
                            className="p-3 border border-border rounded-lg bg-muted/15 flex items-center justify-between text-xs"
                          >
                            <div className="space-y-1">
                              <div className="font-extrabold text-foreground">${pay.amount.toFixed(2)}</div>
                              <div className="text-[10px] text-muted-foreground flex items-center space-x-2">
                                <span>Date: {new Date(pay.date).toLocaleDateString()}</span>
                                <span>•</span>
                                <span>Method: {pay.method.replace("_", " ")}</span>
                              </div>
                              {pay.notes && <p className="text-[10px] text-muted-foreground italic">Desc: {pay.notes}</p>}
                            </div>
                            <Badge variant={pay.status === "PAID" ? "success" : "warning"}>
                              {pay.status}
                            </Badge>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* MESSAGES TAB */}
                {activeTab === "messages" && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-foreground">Unified Communications Thread</h4>
                    <div className="space-y-3">
                      {selectedPatient.messages.length === 0 ? (
                        <p className="text-xs text-muted-foreground italic">No recent chat, SMS, or email transcripts found.</p>
                      ) : (
                        selectedPatient.messages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex flex-col max-w-[85%] space-y-1 p-3 rounded-xl text-xs border ${
                              msg.direction === "INBOUND"
                                ? "bg-muted text-foreground border-border/80 align-self-start mr-auto"
                                : "bg-primary/5 text-foreground border-primary/20 align-self-end ml-auto"
                            }`}
                          >
                            <div className="flex items-center justify-between text-[9px] text-muted-foreground font-semibold">
                              <span className="uppercase">{msg.channel} ({msg.direction})</span>
                              <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <p className="leading-relaxed font-medium mt-0.5">{msg.content}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* CLINICAL NOTES TAB */}
                {activeTab === "notes" && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 bg-rose-500/10 border border-rose-500/20 text-rose-700 p-3 rounded-lg text-xs leading-relaxed shrink-0">
                      <ShieldAlert size={16} className="shrink-0" />
                      <span><strong>HIPAA Notice:</strong> Restricted access. Clinical charts represent protected health information. Do not share.</span>
                    </div>

                    <div className="p-4 border border-border bg-muted/15 rounded-xl space-y-3">
                      <div>
                        <h4 className="text-xs font-bold text-foreground">Demographics Chart</h4>
                        <div className="grid grid-cols-2 gap-4 text-[11px] text-muted-foreground mt-2">
                          <p><strong>Date of Birth:</strong> {selectedPatient.dateOfBirth || "Not recorded"}</p>
                          <p><strong>Gender ID:</strong> {selectedPatient.gender || "Not recorded"}</p>
                          <p className="col-span-2"><strong>Billing Address:</strong> {selectedPatient.address || "Not recorded"}</p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-border/50">
                        <h4 className="text-xs font-bold text-foreground">Admitting Clinical Summary</h4>
                        <p className="text-[11px] text-muted-foreground leading-relaxed italic mt-1">
                          "Patient presents with structural wear of bicuspid sectors. Gum density registered within standard values. Recommend dental hygiene diagnostics every 6 months to supervise plaque accumulation."
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-center items-center p-8 text-center text-xs text-muted-foreground border border-dashed border-border/60 rounded-xl m-6">
              Select a patient from the registry directory to inspect charts.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
