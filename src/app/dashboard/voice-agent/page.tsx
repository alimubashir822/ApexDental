"use client";

import React, { useState, useEffect } from "react";
import {
  PhoneCall,
  Volume2,
  Mic,
  Settings as SettingsIcon,
  Play,
  Pause,
  Clock,
  CheckCircle,
  AlertCircle,
  Database,
  Smartphone,
  PhoneIncoming,
  Bot,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import confetti from "canvas-confetti";

export default function VoiceAgentPage() {
  const [voice, setVoice] = useState("emma");
  const [agentStatus, setAgentStatus] = useState("ONLINE");
  const [callActive, setCallActive] = useState(false);
  const [callStep, setCallStep] = useState(0);
  const [transcripts, setTranscripts] = useState<{ speaker: "patient" | "ai"; text: string }[]>([]);

  const dialogue = [
    {
      speaker: "ai",
      text: "Thank you for calling Apex Dental & Growth Clinic. I'm Emma, your ApexDental AI assistant. How can I help you today?",
    },
    {
      speaker: "patient",
      text: "Hi Emma, I have a missing tooth and wanted to check if you do dental implants, and what they cost.",
    },
    {
      speaker: "ai",
      text: "Yes, we specialize in premium biocompatible dental implants! Our chief surgeon, Dr. Sarah Mitchell, uses 3D guided placement. Standard implants start at $1,500, and we offer monthly financing starting at $99. Would you like to schedule a scan consultation?",
    },
    {
      speaker: "patient",
      text: "Oh, that sounds perfect. Do you have slots available for a scan this week?",
    },
    {
      speaker: "ai",
      text: "Checking schedule... Yes, I have open slots tomorrow (Friday) at 10:00 AM or 2:00 PM. Do either of those work for you?",
    },
    {
      speaker: "patient",
      text: "Tomorrow at 10:00 AM is great. My name is Sarah Jenkins, email is sarah.j@outlook.com, and phone is (555) 888-2321.",
    },
    {
      speaker: "ai",
      text: "Perfect! I've booked your Dental Implant consultation with Dr. Mitchell for tomorrow at 10:00 AM. I have qualified your intake form and pushed it to our clinical pipeline. A text confirmation details card is heading to (555) 888-2321. See you tomorrow, Sarah!",
    },
  ];

  const handleStartCall = () => {
    setCallActive(true);
    setCallStep(0);
    setTranscripts([dialogue[0] as any]);
  };

  useEffect(() => {
    if (!callActive || callStep >= dialogue.length - 1) {
      if (callActive && callStep === dialogue.length - 1) {
        // Trigger completion effects
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.8 },
          colors: ["#14b8a6", "#4f46e5"],
        });
      }
      return;
    }

    const timer = setTimeout(() => {
      const nextStep = callStep + 1;
      setCallStep(nextStep);
      setTranscripts((prev) => [...prev, dialogue[nextStep] as any]);
    }, 2800);

    return () => clearTimeout(timer);
  }, [callActive, callStep]);

  const handleResetCall = () => {
    setCallActive(false);
    setCallStep(0);
    setTranscripts([]);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
          <PhoneCall className="text-primary animate-pulse" />
          ApexDental AI Voice Agent
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Advanced patient voice caller automation. AI answers clinic hours, pricing, and logs scheduled bookings into the CRM.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Voice Dial Simulator */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="glow-primary border-primary/20 bg-card overflow-hidden">
            <CardHeader className="border-b border-border/40 bg-muted/20">
              <CardTitle className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center justify-between">
                <span>1. Real-time Patient Call Simulator</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                  agentStatus === "ONLINE" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-slate-500/10 text-slate-500 border-slate-500/20"
                }`}>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1 animate-ping" />
                  Voice Receptionist {agentStatus}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex flex-col items-center">
              {!callActive ? (
                <div className="py-12 flex flex-col items-center space-y-6 text-center">
                  <div className="h-20 w-20 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center animate-bounce shadow-inner">
                    <Mic size={36} className="text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-foreground">Simulate Inbound Patient Call</h3>
                    <p className="text-xs text-muted-foreground max-w-sm">
                      Click below to trigger a mock phone check-in and listen/read as the AI Receptionist handles details qualification.
                    </p>
                  </div>
                  <Button onClick={handleStartCall} className="text-xs py-2 px-5 font-bold flex items-center gap-1.5">
                    <PhoneIncoming size={14} /> Trigger Phone Consultation Request
                  </Button>
                </div>
              ) : (
                <div className="w-full space-y-6">
                  {/* Waveform Visualization */}
                  <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center relative overflow-hidden h-[100px]">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,#0d948815,transparent_100%)]" />
                    
                    {/* Simulated pulse bars */}
                    <div className="flex items-center space-x-1.5 relative z-10">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((index) => {
                        const heights = ["h-3", "h-8", "h-12", "h-4", "h-14", "h-6", "h-10", "h-16", "h-8", "h-12", "h-4", "h-14", "h-6", "h-10", "h-3"];
                        const delays = ["delay-75", "delay-100", "delay-150", "delay-200", "delay-300", "delay-75", "delay-100", "delay-150", "delay-200", "delay-300", "delay-75", "delay-100", "delay-150", "delay-200", "delay-300"];
                        return (
                          <div
                            key={index}
                            className={`w-1 rounded-full bg-teal-400 animate-pulse ${heights[index % heights.length]} ${delays[index % delays.length]}`}
                          />
                        );
                      })}
                    </div>
                    <div className="text-[9px] text-teal-400 font-bold uppercase tracking-wider mt-3 relative z-10 animate-pulse">
                      Voice connection active ({transcripts[transcripts.length - 1]?.speaker === "ai" ? "AI speaking..." : "Patient speaking..."})
                    </div>
                  </div>

                  {/* Dialogue transcripts list */}
                  <div className="border border-border bg-muted/20 rounded-xl p-4 h-[240px] overflow-y-auto space-y-3">
                    {transcripts.map((t, idx) => (
                      <div
                        key={idx}
                        className={`flex items-start space-x-2 text-xs animate-in slide-in-from-bottom-2 duration-200 ${
                          t.speaker === "ai" ? "justify-start" : "justify-end flex-row-reverse"
                        }`}
                      >
                        <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                          t.speaker === "ai" ? "bg-primary/10 text-primary" : "bg-indigo-500/10 text-indigo-500"
                        }`}>
                          {t.speaker === "ai" ? <Bot size={12} /> : "P"}
                        </div>
                        <div className={`p-2.5 rounded-xl max-w-[80%] leading-relaxed ${
                          t.speaker === "ai"
                            ? "bg-card border border-border text-foreground"
                            : "bg-indigo-600 text-white font-medium"
                        }`}>
                          {t.text}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Control Buttons */}
                  <div className="flex justify-between items-center border-t border-border pt-4">
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Clock size={11} /> Call Duration: 0:{(callStep * 3).toString().padStart(2, "0")}
                    </span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleResetCall} className="text-xs">
                        Hang Up & Reset
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Configuration Card */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <SettingsIcon size={14} className="text-muted-foreground" />
                AI Voice Settings & Instructions
              </CardTitle>
              <CardDescription>
                Customize speech attributes and knowledge rules for the phone receptionist.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-muted-foreground">Voice Engine Profile</label>
                  <select
                    value={voice}
                    onChange={(e) => setVoice(e.target.value)}
                    className="w-full h-9 rounded-lg border border-input bg-background px-3 py-1 text-xs text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="emma">Emma (Warm / British Accent)</option>
                    <option value="liam">Liam (Deep / Professional American)</option>
                    <option value="chloe">Chloe (Friendly / Conversational)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-muted-foreground">Inbound Status</label>
                  <select
                    value={agentStatus}
                    onChange={(e) => setAgentStatus(e.target.value)}
                    className="w-full h-9 rounded-lg border border-input bg-background px-3 py-1 text-xs text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="ONLINE">Enable Voice AI (Auto-Answer)</option>
                    <option value="OFFLINE">Forward calls to Desk Staff</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-muted-foreground">Primary Greeting & Instruction Rules</label>
                <textarea
                  defaultValue="Greeting: 'Thank you for calling Apex Dental & Growth Clinic. I'm Emma, your ApexDental AI assistant. How can I help you today?'
Rules:
1. Standard cleanings and orthodontic checkups cost details.
2. Accept Cigna, Aetna, Metlife, Delta PPO plans.
3. Automatically scheduling consultation slots on database.
4. Escalate emergency surgery cases directly to clinic coordinator."
                  rows={4}
                  className="w-full rounded-lg border border-input bg-background p-3 text-xs text-foreground focus:outline-none focus:border-primary leading-relaxed font-mono"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: KPIs & Database Log */}
        <div className="lg:col-span-5 space-y-6">
          {/* Call Center Metrics */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-xs font-bold text-foreground uppercase tracking-wider">
                Voice Center Operational Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted/40 border border-border/80 rounded-xl">
                  <span className="block text-[9px] uppercase font-bold text-muted-foreground">Calls Handled (Month)</span>
                  <span className="text-lg font-extrabold text-foreground mt-0.5">342 calls</span>
                </div>
                <div className="p-3 bg-muted/40 border border-border/80 rounded-xl">
                  <span className="block text-[9px] uppercase font-bold text-muted-foreground">Appointments Booked</span>
                  <span className="text-lg font-extrabold text-primary mt-0.5">118 bookings</span>
                </div>
                <div className="p-3 bg-muted/40 border border-border/80 rounded-xl">
                  <span className="block text-[9px] uppercase font-bold text-muted-foreground">Average Latency</span>
                  <span className="text-lg font-extrabold text-teal-600 mt-0.5">1.8 seconds</span>
                </div>
                <div className="p-3 bg-muted/40 border border-border/80 rounded-xl">
                  <span className="block text-[9px] uppercase font-bold text-muted-foreground">Simulated ROI Yield</span>
                  <span className="text-lg font-extrabold text-indigo-650 text-indigo-600 mt-0.5">$3,450 saved</span>
                </div>
              </div>

              {/* Call routing statistics bar */}
              <div className="space-y-2 border-t border-border pt-4 text-xs">
                <h4 className="font-bold text-muted-foreground">Call Resolutions</h4>
                <div className="flex justify-between items-center text-[10px]">
                  <span>AI fully resolved:</span>
                  <span className="font-bold">91.4%</span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: "91.4%" }}></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CRM Integration log */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1">
                <Database size={13} className="text-muted-foreground" />
                Voice CRM Integration Logs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="p-3 rounded-lg border border-border bg-muted/10 relative">
                <div className="absolute top-2.5 right-2.5 text-[8px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  CAPTURED
                </div>
                <div className="font-bold text-foreground flex items-center gap-1">
                  <Smartphone size={12} className="text-muted-foreground" />
                  Sarah Jenkins
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5">
                  Interested: Dental Implants | Estimated value: $1,500
                </div>
                <div className="text-[9px] text-primary/80 mt-1 font-bold">
                  → Status updated to: APPOINTMENT_BOOKED
                </div>
              </div>

              <div className="p-3 rounded-lg border border-border bg-muted/10">
                <div className="font-bold text-foreground flex items-center gap-1">
                  <Smartphone size={12} className="text-muted-foreground" />
                  Robert Downey
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5">
                  General Teeth Whitening checkup slot validation query.
                </div>
                <div className="text-[9px] text-teal-600 mt-1 font-bold">
                  → AI Qualified: Low Urgency
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
