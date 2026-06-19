import React from "react";
import { prisma } from "@/lib/db";
import { LeadPipelineBoard } from "@/components/dashboard/LeadPipelineBoard";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  // Query all leads from SQLite via Prisma ORM
  const leads = await prisma.lead.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="w-full h-full flex flex-col">
      <LeadPipelineBoard initialLeads={leads} />
    </div>
  );
}
