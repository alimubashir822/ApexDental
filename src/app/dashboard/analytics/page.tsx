import React from "react";
import { prisma } from "@/lib/db";
import { AnalyticsDashboard } from "@/components/dashboard/AnalyticsDashboard";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  // Query campaigns
  const campaigns = await prisma.campaign.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Query leads by source
  const leadsGrouped = await prisma.lead.groupBy({
    by: ["source"],
    _count: { id: true },
  });
  const sourceData = leadsGrouped.map((l) => ({
    name: l.source.replace("_", " "),
    value: l._count.id,
  }));

  // Query payments by method
  const paymentsGrouped = await prisma.payment.groupBy({
    by: ["method"],
    _sum: { amount: true },
    where: { status: "PAID" },
  });
  const paymentData = paymentsGrouped.map((p) => ({
    name: p.method.replace("_", " "),
    amount: p._sum.amount ?? 0.0,
  }));

  // Query appointments by status
  const appointmentsGrouped = await prisma.appointment.groupBy({
    by: ["status"],
    _count: { id: true },
  });
  const appointmentStats = appointmentsGrouped.map((a) => ({
    name: a.status,
    count: a._count.id,
  }));

  return (
    <div className="w-full h-full flex flex-col">
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-xl font-extrabold text-foreground tracking-tight">Practice Analytics & ROI</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Clinic metrics tracker: diagnostic receipts, conversions, and campaign results.</p>
      </div>

      <AnalyticsDashboard
        campaigns={campaigns}
        sourceData={sourceData}
        paymentData={paymentData}
        appointmentStats={appointmentStats}
      />
    </div>
  );
}
