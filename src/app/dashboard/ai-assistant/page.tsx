import React from "react";
import { prisma } from "@/lib/db";
import { getGrowthRecommendations } from "@/lib/ai-service";
import { AIPracticeConsultant } from "@/components/dashboard/AIPracticeConsultant";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import {
  Sparkles,
  MessageSquare,
  ShieldCheck,
  Smartphone,
  Mail,
  Bot,
  AlertTriangle,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AIAssistantPage() {
  const recommendations = getGrowthRecommendations();

  // Query communication messages logs
  const messages = await prisma.message.findMany({
    include: {
      patient: true,
      lead: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Query audit logs for security checks
  const auditLogs = await prisma.auditLog.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 8, // last 8 actions to balance the columns heights
  });

  const channelIcons: Record<string, any> = {
    CHAT: Bot,
    SMS: Smartphone,
    EMAIL: Mail,
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Title */}
      <div>
        <h1 className="text-xl font-extrabold text-foreground tracking-tight">AI Advisor & Communications Hub</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Automated practice growth consultant, patient message threads, and security logs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Chat room and static Growth recommendations */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Interactive Chat consultant */}
          <AIPracticeConsultant />

          {/* AI static recommendations */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center space-x-1.5">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span>Practice Growth Advisor Recommendations</span>
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 rounded-xl border border-primary/20 bg-primary/5 hover:border-primary/30 transition-all space-y-2 relative overflow-hidden text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {rec.category}
                    </span>
                    <Badge variant={rec.impact === "HIGH" ? "destructive" : "warning"}>
                      {rec.impact} IMPACT
                    </Badge>
                  </div>
                  <h4 className="font-bold text-foreground">{rec.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {rec.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Messages transcripts and HIPAA logs */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* HIPAA Security logs */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center space-x-1.5">
              <ShieldCheck className="h-4 w-4 text-rose-600 animate-pulse" />
              <span>HIPAA Security Audit Logs</span>
            </h3>

            <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm divide-y divide-border/60">
              <div className="p-3 bg-rose-500/10 border-b border-rose-500/25 flex items-center space-x-2 text-rose-700 text-[10px]">
                <AlertTriangle size={12} className="shrink-0" />
                <span>HIPAA Shield Active. CRM read/write activity tracing.</span>
              </div>

              {auditLogs.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  No logs found.
                </div>
              ) : (
                auditLogs.map((log) => (
                  <div key={log.id} className="p-3 space-y-1 text-xs">
                    <div className="flex justify-between items-center text-[9px] text-muted-foreground font-semibold">
                      <span className="text-rose-600 font-bold bg-rose-500/5 px-1.5 py-0.5 rounded border border-rose-500/10">
                        {log.action}
                      </span>
                      <span>{new Date(log.createdAt).toLocaleTimeString()}</span>
                    </div>
                    <p className="font-medium text-foreground leading-snug">
                      {log.details}
                    </p>
                    <p className="text-[9px] text-muted-foreground">
                      Operator: <span className="font-semibold text-foreground">{log.user?.name ?? "AI Receptionist"}</span>
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Messages hub */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center space-x-1.5">
              <MessageSquare className="h-4 w-4 text-primary" />
              <span>Patient Communications Logs</span>
            </h3>

            <div className="rounded-xl border border-border bg-card overflow-hidden divide-y divide-border/60 text-xs shadow-sm">
              {messages.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  No messages found.
                </div>
              ) : (
                messages.map((msg) => {
                  const Icon = channelIcons[msg.channel] || MessageSquare;
                  const patientName = msg.patient?.name ?? msg.lead?.name ?? "Anonymous Visitor";
                  
                  return (
                    <div key={msg.id} className="p-3.5 hover:bg-muted/10 transition-colors flex items-start space-x-2.5">
                      <div className="h-7 w-7 bg-muted text-foreground border border-border/40 rounded-lg flex items-center justify-center shrink-0">
                        <Icon size={12} className="text-primary" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-foreground text-[11px]">{patientName}</span>
                          <span className="text-[8px] text-muted-foreground font-semibold">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1 leading-snug">
                          "{msg.content}"
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
