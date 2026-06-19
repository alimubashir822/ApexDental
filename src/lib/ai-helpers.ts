export interface ChatMessage {
  role: "assistant" | "user";
  content: string;
}

// AI Marketing assistant generator
export function generateCampaignCopy(service: string, offer: string, channel: "EMAIL" | "SMS") {
  if (channel === "SMS") {
    return `Apex Growth Clinic: Hey! Get ready for a gorgeous smile. We are offering a special ${offer} on ${service}! Limited slots available this week. Book your checkup now: apexdental.com/book`;
  }

  return {
    subject: `Exclusive Offer: ${offer} on ${service}! ✨`,
    content: `Dear Patient,\n\nWe have exciting news! For a limited time, Apex Dental & Growth Clinic is running a special promotion on our premium ${service} treatment.\n\nHere are the details:\n• Special Offer: ${offer}\n• Fully customized treatment plan\n• Managed by our senior orthodontists\n\nDon't miss this opportunity to revitalize your confidence. Book your session directly online or reply to this email!\n\nBook here: https://apexdentalgrowth.com/book\n\nWarm regards,\nDr. Sarah Mitchell & Team`,
  };
}

// AI growth advisor
export function getGrowthRecommendations() {
  return [
    {
      id: "rec1",
      impact: "HIGH",
      title: "Reallocate Google Ads Spend",
      description: "Google Ads generate 60% of your raw dental implant leads, but Website Chat conversions are 2x higher. Direct more traffic to interactive chat pages to lower cost-per-acquisition by ~15%.",
      category: "Ad Optimization",
    },
    {
      id: "rec2",
      impact: "MEDIUM",
      title: "Activate Patient Recall Flow",
      description: "We detected 42 patients who haven't visited in 12+ months. Launching the 'Annual Checkup Recall' email template is projected to book 8-12 appointments and generate ~$3,500 in hygiene revenue.",
      category: "Patient Retention",
    },
    {
      id: "rec3",
      impact: "HIGH",
      title: "Invisalign SMS Sequence",
      description: "Invisalign leads have a 45% higher booking rate if contacted within 5 minutes. We recommend enabling the automated SMS 'Day 0 Follow-up' trigger in settings.",
      category: "Automation",
    },
  ];
}
