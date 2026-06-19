import React from "react";
import { prisma } from "@/lib/db";
import { CampaignPortal } from "@/components/dashboard/CampaignPortal";

export const dynamic = "force-dynamic";

export default async function CampaignsPage() {
  // Query all campaigns from database
  const campaigns = await prisma.campaign.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="w-full h-full flex flex-col">
      <CampaignPortal initialCampaigns={campaigns} />
    </div>
  );
}
