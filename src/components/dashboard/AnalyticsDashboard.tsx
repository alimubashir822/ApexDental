"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  Megaphone,
  Star,
  Award,
  Clock,
  CheckCircle,
  Percent,
  RefreshCw,
  Activity,
  Smile,
  MessageSquare,
  Shield,
  ThumbsUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts";

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
  createdAt: Date | string;
}

interface AnalyticsDashboardProps {
  campaigns: Campaign[];
  sourceData: { name: string; value: number }[];
  paymentData: { name: string; amount: number }[];
  appointmentStats: { name: string; count: number }[];
}

export function AnalyticsDashboard({
  campaigns,
  sourceData,
  paymentData,
  appointmentStats,
}: AnalyticsDashboardProps) {
  const [activeTab, setActiveTab] = useState<"acquisition" | "billing" | "campaigns">("acquisition");
  const [autoReview, setAutoReview] = useState(true);
  const COLORS = ["#0d9488", "#4f46e5", "#ec4899", "#f59e0b", "#64748b"];

  // 1. Calculate Summary Stats
  const totalPayments = paymentData.reduce((acc, p) => acc + p.amount, 0);
  const totalCampaignRevenue = campaigns.reduce((acc, c) => acc + c.revenue, 0);
  const totalLeads = sourceData.reduce((acc, s) => acc + s.value, 0);
  const totalAppointments = appointmentStats.reduce((acc, a) => acc + a.count, 0);

  // Calculate cancellation rate
  const cancelledAppts = appointmentStats.find((a) => a.name === "CANCELLED")?.count ?? 0;
  const noShowRate = totalAppointments > 0 ? (cancelledAppts / totalAppointments) * 100 : 5.0;

  // Patient Experience Score (PES) formula
  // Start with 100. Subtract no-show penalties and review score impact
  const mockReviewRating = 4.8; // default clinic target rating
  const reviewPenalty = (5.0 - mockReviewRating) * 10; // 2 points
  const noShowPenalty = noShowRate * 0.8;
  const pesScore = Math.max(70, Math.min(100, Math.round(100 - reviewPenalty - noShowPenalty)));

  // AI Response performance metrics
  const aiStats = {
    avgResponseTime: "1.8s",
    humanResponseTime: "14.5m",
    inquiriesQualified: totalLeads > 2 ? totalLeads - 2 : totalLeads, // Mock leads qualified via chatbot
    resolutionRate: "91.2%",
    totalAIConversations: 184,
  };

  // Circular progress helper
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (pesScore / 100) * circumference;

  return (
    <div className="w-full space-y-6">
      {/* 1. Header Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Payments Ledger Card */}
        <div className="p-5 rounded-xl border border-border bg-card shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Cash Receipts</p>
            <h3 className="text-xl font-extrabold text-foreground mt-1">
              ${totalPayments.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
            <div className="flex items-center space-x-1 mt-1 text-[10px] text-teal-600 font-semibold">
              <TrendingUp size={12} />
              <span>+12.4% vs last month</span>
            </div>
          </div>
          <div className="p-3 bg-teal-50 dark:bg-teal-950/20 text-teal-600 rounded-lg">
            <DollarSign size={20} />
          </div>
        </div>

        {/* Lead Capture Score */}
        <div className="p-5 rounded-xl border border-border bg-card shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Acquisition (Leads)</p>
            <h3 className="text-xl font-extrabold text-foreground mt-1">{totalLeads} Patients</h3>
            <div className="flex items-center space-x-1 mt-1 text-[10px] text-indigo-600 font-semibold">
              <TrendingUp size={12} />
              <span>+18.1% AI Front Desk capture</span>
            </div>
          </div>
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 rounded-lg">
            <Users size={20} />
          </div>
        </div>

        {/* Appointment Grid */}
        <div className="p-5 rounded-xl border border-border bg-card shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Confirmed Bookings</p>
            <h3 className="text-xl font-extrabold text-foreground mt-1">{totalAppointments} Slots</h3>
            <div className="flex items-center space-x-1 mt-1 text-[10px] text-amber-600 font-semibold">
              <Clock size={12} />
              <span>{noShowRate.toFixed(1)}% No-show cancellation rate</span>
            </div>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-600 rounded-lg">
            <Calendar size={20} />
          </div>
        </div>

        {/* Campaign ROI Card */}
        <div className="p-5 rounded-xl border border-border bg-card shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Marketing Campaign Yield</p>
            <h3 className="text-xl font-extrabold text-foreground mt-1">
              ${totalCampaignRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
            <div className="flex items-center space-x-1 mt-1 text-[10px] text-rose-600 font-semibold">
              <Percent size={12} />
              <span>+24% Conversion Rate ROI</span>
            </div>
          </div>
          <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 rounded-lg">
            <Megaphone size={20} />
          </div>
        </div>
      </div>

      {/* 2. PES (Patient Experience Score) & AI Performance Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Patient Experience Score Circular Meter Card */}
        <div className="lg:col-span-4 p-6 rounded-xl border border-border bg-card shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-foreground flex items-center gap-1">
                <Smile size={14} className="text-teal-600" />
                Patient Experience Score (PES)
              </h3>
              <span className="text-[9px] bg-teal-50 dark:bg-teal-950/20 text-teal-600 px-2 py-0.5 rounded-full font-bold">
                Excellent
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground">
              A comprehensive index tracking review ratings, check-in latency, and no-shows.
            </p>
          </div>

          <div className="flex items-center justify-center py-4">
            <div className="relative flex items-center justify-center">
              <svg className="w-24 h-24 transform -rotate-90">
                {/* Background Ring */}
                <circle
                  cx="48"
                  cy="48"
                  r={radius}
                  className="stroke-muted"
                  strokeWidth="8"
                  fill="transparent"
                />
                {/* Foreground Progress Ring */}
                <circle
                  cx="48"
                  cy="48"
                  r={radius}
                  className="stroke-teal-600 transition-all duration-500 ease-out"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-xl font-extrabold text-foreground">{pesScore}</span>
                <span className="text-[8px] text-muted-foreground uppercase font-bold">out of 100</span>
              </div>
            </div>
          </div>

          {/* Performance breakdown indicators */}
          <div className="space-y-2 border-t border-border pt-3">
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-muted-foreground flex items-center gap-1">
                <Star size={10} className="text-amber-500 fill-amber-500" /> Avg Review Sentiment
              </span>
              <span className="font-bold text-foreground">{mockReviewRating} / 5.0</span>
            </div>
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-muted-foreground flex items-center gap-1">
                <Clock size={10} className="text-indigo-500" /> Avg Check-in Waiting
              </span>
              <span className="font-bold text-foreground">6.2 mins</span>
            </div>
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-muted-foreground flex items-center gap-1">
                <CheckCircle size={10} className="text-teal-500" /> Retain Retention rate
              </span>
              <span className="font-bold text-foreground">92.4%</span>
            </div>
          </div>
        </div>

        {/* AI Front Desk Performance & AI Response Latency Widget */}
        <div className="lg:col-span-5 p-6 rounded-xl border border-border bg-card shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5 mb-1">
              <Activity size={14} className="text-indigo-600" />
              AI Front Desk Receptionist Statistics
            </h3>
            <p className="text-[10px] text-muted-foreground mb-4">
              Real-time response comparisons and conversational AI conversion audits.
            </p>

            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60 text-center">
                <span className="block text-[8px] text-muted-foreground font-bold uppercase">AI Latency</span>
                <span className="text-sm font-extrabold text-primary">{aiStats.avgResponseTime}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60 text-center">
                <span className="block text-[8px] text-muted-foreground font-bold uppercase">Staff Latency</span>
                <span className="text-sm font-extrabold text-amber-600">{aiStats.humanResponseTime}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60 text-center">
                <span className="block text-[8px] text-muted-foreground font-bold uppercase">Resolutions</span>
                <span className="text-sm font-extrabold text-teal-600">{aiStats.resolutionRate}</span>
              </div>
            </div>

            {/* AI response time comparison visual chart */}
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-[9px] font-bold text-muted-foreground mb-1">
                  <span>AI Receptionist response time (1.8 seconds)</span>
                  <span className="text-primary font-extrabold">Instant</span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: "3%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[9px] font-bold text-muted-foreground mb-1">
                  <span>Staff phone / email callback time (14.5 minutes)</span>
                  <span className="text-amber-600 font-extrabold">Lagging</span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: "95%" }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-[10px] border-t border-border pt-3">
            <span className="text-muted-foreground">AI leads qualified this week:</span>
            <span className="font-extrabold text-primary">{aiStats.inquiriesQualified} leads</span>
          </div>
        </div>

        {/* Reputation Automation & SMS Feedback Card */}
        <div className="lg:col-span-3 p-6 rounded-xl border border-border bg-card shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5 mb-1">
              <MessageSquare size={14} className="text-rose-600" />
              Reputation Engine
            </h3>
            <p className="text-[10px] text-muted-foreground mb-4">
              Automated review solicitation triggered upon client payment clearance.
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 rounded-lg bg-muted/20 border border-border text-xs">
                <div className="leading-tight">
                  <span className="block text-[10px] font-bold">Auto-Review Inbound SMS</span>
                  <span className="text-[8px] text-muted-foreground">Trigger after billing checkout</span>
                </div>
                <button
                  onClick={() => setAutoReview(!autoReview)}
                  className={`w-8 h-4 rounded-full transition-colors relative flex items-center cursor-pointer ${
                    autoReview ? "bg-primary" : "bg-muted-foreground/30"
                  }`}
                >
                  <span
                    className={`w-3.5 h-3.5 rounded-full bg-white shadow absolute transition-transform ${
                      autoReview ? "translate-x-4" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              {/* Simulation message box */}
              <div className="p-3 rounded-lg border border-border/80 bg-muted/30 text-[10px] relative">
                <div className="absolute top-2 right-2 text-[8px] bg-rose-50 dark:bg-rose-950/20 text-rose-600 font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                  <ThumbsUp size={8} /> SMS Preview
                </div>
                <p className="text-muted-foreground font-semibold uppercase text-[8px] mb-1">Outbound SMS Draft</p>
                <p className="text-foreground italic">
                  "Hi Emily! Thank you for choosing Apex Dental today. Could you take 15 seconds to rate your visit with Dr. Patel? https://caref.low/3da2"
                </p>
              </div>
            </div>
          </div>

          <div className="text-[9px] text-muted-foreground bg-muted/20 rounded p-2 text-center mt-3 border border-border/40">
            Reviews generated this month: <strong className="text-primary font-bold">48 entries</strong>
          </div>
        </div>
      </div>

      {/* 3. Interactive Section & Custom Tabs */}
      <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-border pb-4 mb-6">
          <div>
            <h3 className="text-xs font-bold text-foreground">Interactive Practice Analysis</h3>
            <p className="text-[10px] text-muted-foreground">Explore clinic financials, channels, and campaigns metrics.</p>
          </div>

          <div className="flex items-center space-x-1.5 mt-4 md:mt-0 bg-muted/60 p-1 rounded-lg border border-border">
            <button
              onClick={() => setActiveTab("acquisition")}
              className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                activeTab === "acquisition" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Leads Channels
            </button>
            <button
              onClick={() => setActiveTab("billing")}
              className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                activeTab === "billing" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Billing Channels
            </button>
            <button
              onClick={() => setActiveTab("campaigns")}
              className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                activeTab === "campaigns" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Marketing ROI
            </button>
          </div>
        </div>

        {/* Tab 1: Acquisition Channels Chart */}
        {activeTab === "acquisition" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sourceData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "1px solid #cbd5e1",
                      borderRadius: "8px",
                      fontSize: "11px",
                    }}
                  />
                  <Bar dataKey="value" fill="#0d9488" radius={[4, 4, 0, 0]} name="Leads" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="lg:col-span-4 flex flex-col justify-center">
              <h4 className="text-xs font-bold text-foreground mb-3">Lead Breakdown</h4>
              <div className="space-y-2">
                {sourceData.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between text-[11px] border-b border-border/40 pb-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span className="font-medium text-foreground">{item.name}</span>
                    </div>
                    <span className="font-extrabold text-foreground">{item.value} leads</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Billing / Payments Channels Chart */}
        {activeTab === "billing" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 h-[280px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="amount"
                  >
                    {paymentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${value}`, "Amount"]} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "10px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="lg:col-span-5 flex flex-col justify-center">
              <h4 className="text-xs font-bold text-foreground mb-3">Revenue Collections</h4>
              <div className="space-y-2">
                {paymentData.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between text-[11px] border-b border-border/40 pb-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span className="font-medium text-foreground">{item.name}</span>
                    </div>
                    <span className="font-extrabold text-foreground">${item.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Marketing Campaigns List */}
        {activeTab === "campaigns" && (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-muted-foreground uppercase font-bold text-[9px] tracking-wider">
                  <th className="p-3">Campaign Name</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Audience Segment</th>
                  <th className="p-3">Leads Captured</th>
                  <th className="p-3">Appointments</th>
                  <th className="p-3 text-right">Revenue</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {campaigns.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/10">
                    <td className="p-3 font-bold text-foreground">{c.name}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.type === "EMAIL" ? "bg-blue-50 text-blue-600 dark:bg-blue-950/20" : "bg-teal-50 text-teal-600 dark:bg-teal-950/20"
                      }`}>
                        {c.type}
                      </span>
                    </td>
                    <td className="p-3 text-muted-foreground text-[10px]">{c.audienceSegment.replace("_", " ")}</td>
                    <td className="p-3 font-semibold text-foreground">{c.leadsCount}</td>
                    <td className="p-3 font-semibold text-foreground">{c.appointmentsCount}</td>
                    <td className="p-3 text-right font-extrabold text-foreground text-xs">
                      ${c.revenue.toLocaleString()}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        c.status === "SENT" ? "bg-teal-50 text-teal-600 border border-teal-200 dark:bg-teal-950/25" : "bg-slate-50 text-slate-500 border border-slate-200 dark:bg-slate-900"
                      }`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
