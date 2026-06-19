import React from "react";
import { prisma } from "@/lib/db";
import { OverviewCharts } from "@/components/dashboard/OverviewCharts";
import { getSession } from "@/lib/auth";
import { getGrowthRecommendations } from "@/lib/ai-helpers";
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowRight,
  Stethoscope,
  Smile,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getSession();

  // Query database statistics
  const totalLeads = await prisma.lead.count();
  const convertedLeads = await prisma.lead.count({ where: { status: "CONVERTED" } });
  const totalPatients = await prisma.patient.count();
  const totalAppointments = await prisma.appointment.count();

  // Revenue sum
  const revenueAggregation = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: { status: "PAID" },
  });
  const totalRevenue = revenueAggregation._sum.amount ?? 0;

  // Calculation of lead conversion rate
  const conversionRate = totalLeads > 0
    ? ((convertedLeads / totalLeads) * 100).toFixed(1)
    : "0.0";

  // Fetch today's appointments
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const todayAppointments = await prisma.appointment.findMany({
    where: {
      dateTime: {
        gte: startOfToday,
        lte: endOfToday,
      },
    },
    include: {
      patient: true,
      lead: true,
    },
    orderBy: {
      dateTime: "asc",
    },
  });

  // Calculate Lead sources stats for chart
  const leadsGrouped = await prisma.lead.groupBy({
    by: ["source"],
    _count: { id: true },
  });

  const sourceData = leadsGrouped.map((l) => ({
    name: l.source.replace("_", " "),
    value: l._count.id,
  }));

  // Build some static historical revenue chart data
  const revenueData = [
    { name: "Jan", amount: totalRevenue * 0.15 },
    { name: "Feb", amount: totalRevenue * 0.20 },
    { name: "Mar", amount: totalRevenue * 0.25 },
    { name: "Apr", amount: totalRevenue * 0.35 },
    { name: "May", amount: totalRevenue * 0.50 },
    { name: "Jun (Current)", amount: totalRevenue },
  ];

  // AI recommendations
  const aiRecommendations = getGrowthRecommendations();

  // Helper status color parser
  const apptColors: Record<string, "primary" | "secondary" | "success" | "warning" | "destructive" | "outline"> = {
    PENDING: "warning",
    CONFIRMED: "primary",
    COMPLETED: "success",
    CANCELLED: "destructive",
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-xl font-extrabold text-foreground tracking-tight">Overview Dashboard</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Workspace summaries and acquisition performance tracking.</p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Active Patients */}
        <div className="p-6 rounded-xl border border-border bg-card shadow-sm flex items-center space-x-4">
          <div className="h-10 w-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
            <Users size={20} />
          </div>
          <div>
            <h4 className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Patients Registry</h4>
            <div className="text-lg font-extrabold text-foreground mt-0.5">{totalPatients}</div>
            <p className="text-[9px] text-muted-foreground mt-0.5">Active registered files</p>
          </div>
        </div>

        {/* Lead conversion rate */}
        <div className="p-6 rounded-xl border border-border bg-card shadow-sm flex items-center space-x-4">
          <div className="h-10 w-10 bg-teal-500/10 text-teal-600 rounded-lg flex items-center justify-center">
            <TrendingUp size={20} />
          </div>
          <div>
            <h4 className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Lead Conversion</h4>
            <div className="text-lg font-extrabold text-foreground mt-0.5">{conversionRate}%</div>
            <p className="text-[9px] text-muted-foreground mt-0.5">{convertedLeads} converted leads</p>
          </div>
        </div>

        {/* Appointments scheduled */}
        <div className="p-6 rounded-xl border border-border bg-card shadow-sm flex items-center space-x-4">
          <div className="h-10 w-10 bg-indigo-500/10 text-indigo-600 rounded-lg flex items-center justify-center">
            <Calendar size={20} />
          </div>
          <div>
            <h4 className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Total Bookings</h4>
            <div className="text-lg font-extrabold text-foreground mt-0.5">{totalAppointments}</div>
            <p className="text-[9px] text-muted-foreground mt-0.5">All scheduled slots</p>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="p-6 rounded-xl border border-border bg-card shadow-sm flex items-center space-x-4">
          <div className="h-10 w-10 bg-emerald-500/10 text-emerald-600 rounded-lg flex items-center justify-center">
            <DollarSign size={20} />
          </div>
          <div>
            <h4 className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Total Revenue</h4>
            <div className="text-lg font-extrabold text-foreground mt-0.5">${totalRevenue.toLocaleString()}</div>
            <p className="text-[9px] text-muted-foreground mt-0.5">Verified PPO & co-pays</p>
          </div>
        </div>

      </div>

      {/* Visual Analytics graphs */}
      <OverviewCharts sourceData={sourceData} revenueData={revenueData} />

      {/* Grid below: Today's Schedule & AI Advisor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Today's Schedule Queue */}
        <div className="lg:col-span-6 p-6 rounded-xl border border-border bg-card shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <div>
              <h3 className="text-xs font-bold text-foreground">Today's Schedule</h3>
              <p className="text-[10px] text-muted-foreground">Patients queue for orthodontics & surgery</p>
            </div>
            <Link href="/dashboard/calendar" className="text-[10px] font-semibold text-primary hover:underline flex items-center space-x-0.5">
              <span>Calendar</span>
              <ArrowRight size={10} />
            </Link>
          </div>

          <div className="space-y-2">
            {todayAppointments.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground bg-muted/10 border border-dashed rounded-lg">
                No appointments scheduled for today.
              </div>
            ) : (
              todayAppointments.map((appt) => (
                <div
                  key={appt.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-muted text-foreground rounded-full flex items-center justify-center shrink-0">
                      <Clock size={14} className="text-primary" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-foreground">
                        {appt.patient?.name ?? appt.lead?.name ?? "Anonymous Patient"}
                      </div>
                      <div className="text-[10px] text-muted-foreground flex items-center space-x-1 mt-0.5">
                        <span>{new Date(appt.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span>•</span>
                        <span>{appt.doctorName}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant={apptColors[appt.status] || "outline"}>
                    {appt.status}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </div>

        {/* AI growth recommendations list */}
        <div className="lg:col-span-6 p-6 rounded-xl border border-border bg-card shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <div>
              <h3 className="text-xs font-bold text-foreground flex items-center space-x-1.5">
                <Sparkles size={14} className="text-primary animate-pulse" />
                <span>AI Practice Recommendations</span>
              </h3>
              <p className="text-[10px] text-muted-foreground">Insights generated to boost patient acquisition & retention</p>
            </div>
          </div>

          <div className="space-y-3">
            {aiRecommendations.map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-xl border border-primary/10 bg-primary/5 hover:border-primary/20 transition-all space-y-2 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {rec.category}
                  </span>
                  <Badge variant={rec.impact === "HIGH" ? "destructive" : "warning"}>
                    {rec.impact} Impact
                  </Badge>
                </div>
                <h4 className="text-xs font-bold text-foreground">{rec.title}</h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {rec.description}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
