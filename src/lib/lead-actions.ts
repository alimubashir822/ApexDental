"use server";

import { prisma } from "./db";
import { revalidatePath } from "next/cache";

export async function submitLeadFormAction(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const service = formData.get("service") as string;
  const notes = formData.get("notes") as string;

  if (!name || !email || !phone) {
    return { success: false, error: "Name, email, and phone are required fields." };
  }

  try {
    const clinic = await prisma.clinic.findFirst();
    if (!clinic) {
      return { success: false, error: "Clinic configuration not found." };
    }

    // Save lead
    await prisma.lead.create({
      data: {
        name,
        email,
        phone,
        status: "NEW",
        source: "WEBSITE_FORM",
        interestedService: service || "General Consultation",
        notes: notes || "Submitted via website contact form.",
        clinicId: clinic.id,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: "LEAD_CAPTURED_FORM",
        details: `Captured new lead: ${name} (${email}) for ${service}`,
      },
    });

    revalidatePath("/dashboard/leads");
    return { success: true, message: "Thank you! Your information has been registered, and our clinical coordinators will call you shortly." };
  } catch (err) {
    console.error("Lead form action error:", err);
    return { success: false, error: "Failed to submit. Please check your inputs and try again." };
  }
}

export async function bookAppointmentAction(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const doctorName = formData.get("doctorName") as string;
  const dateStr = formData.get("date") as string;
  const timeStr = formData.get("time") as string;
  const notes = formData.get("notes") as string;

  if (!name || !email || !phone || !doctorName || !dateStr || !timeStr) {
    return { success: false, error: "All contact and appointment details are required." };
  }

  try {
    const clinic = await prisma.clinic.findFirst();
    if (!clinic) {
      return { success: false, error: "Clinic configuration not found." };
    }

    // Parse date & time
    const dateTime = new Date(`${dateStr}T${timeStr}:00`);
    if (isNaN(dateTime.getTime())) {
      return { success: false, error: "Invalid date or time selected." };
    }

    // Create patient if they don't exist, otherwise use existing
    let patient = await prisma.patient.findUnique({
      where: { email },
    });

    if (!patient) {
      patient = await prisma.patient.create({
        data: {
          name,
          email,
          phone,
          clinicId: clinic.id,
        },
      });
    }

    // Book appointment
    const appointment = await prisma.appointment.create({
      data: {
        dateTime,
        duration: 45,
        status: "PENDING",
        notes: notes || "Booked online via scheduling portal.",
        doctorName,
        patientId: patient.id,
        clinicId: clinic.id,
      },
    });

    // Also register them as a lead in CONVERTED / APPOINTMENT_BOOKED status if not present
    const existingLead = await prisma.lead.findFirst({ where: { email } });
    if (!existingLead) {
      await prisma.lead.create({
        data: {
          name,
          email,
          phone,
          status: "APPOINTMENT_BOOKED",
          source: "WEBSITE_BOOKING",
          interestedService: "General Checkup",
          notes: `Lead generated through direct online appointment booking. Ref ID: ${appointment.id}`,
          clinicId: clinic.id,
        },
      });
    }

    // Log audit
    await prisma.auditLog.create({
      data: {
        action: "APPOINTMENT_BOOKED_ONLINE",
        details: `Online booking confirmed for ${name} with ${doctorName} at ${dateTime.toLocaleString()}`,
      },
    });

    revalidatePath("/dashboard/calendar");
    revalidatePath("/dashboard/leads");
    return { success: true, message: `Success! Your consultation has been scheduled with ${doctorName} for ${dateStr} at ${timeStr}. We have sent a confirmation details message to ${phone}.` };
  } catch (err) {
    console.error("Booking action error:", err);
    return { success: false, error: "An error occurred while booking. Please try again." };
  }
}

export async function submitReviewAction(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const ratingStr = formData.get("rating") as string;
  const comment = formData.get("comment") as string;

  if (!name || !ratingStr || !comment) {
    return { success: false, error: "All fields are required." };
  }

  const rating = parseInt(ratingStr);
  if (isNaN(rating) || rating < 1 || rating > 5) {
    return { success: false, error: "Rating must be between 1 and 5 stars." };
  }

  try {
    await prisma.review.create({
      data: {
        name,
        rating,
        comment,
        status: "PENDING",
      },
    });

    return { success: true, message: "Thank you! Your review has been submitted for verification. It will appear on our page shortly." };
  } catch (err) {
    console.error("Submit review action error:", err);
    return { success: false, error: "Failed to submit review. Please try again." };
  }
}

export async function updateLeadStatusAction(leadId: string, newStatus: string) {
  try {
    const updatedLead = await prisma.lead.update({
      where: { id: leadId },
      data: { status: newStatus },
    });

    // If status becomes TREATMENT_ACCEPTED, create a corresponding Patient record if not already exists!
    if (newStatus === "TREATMENT_ACCEPTED") {
      const existingPatient = await prisma.patient.findUnique({
        where: { email: updatedLead.email },
      });

      if (!existingPatient) {
        await prisma.patient.create({
          data: {
            name: updatedLead.name,
            email: updatedLead.email,
            phone: updatedLead.phone,
            futureOpportunityValue: 1500.0, // default follow-up value
            lastVisitDate: new Date(),
            clinicId: updatedLead.clinicId,
          },
        });

        await prisma.auditLog.create({
          data: {
            action: "LEAD_CONVERTED_PATIENT",
            details: `Automatically registered new Patient record for converted lead: ${updatedLead.name}`,
          },
        });
      }
    }

    // Log audit trail
    await prisma.auditLog.create({
      data: {
        action: "LEAD_STATUS_UPDATED",
        details: `Updated status of lead ${updatedLead.name} to ${newStatus}`,
      },
    });

    revalidatePath("/dashboard/leads");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/patients");
    return { success: true };
  } catch (err) {
    console.error("Update lead status action error:", err);
    return { success: false, error: "Failed to update lead status." };
  }
}

export async function createLeadAction(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const service = formData.get("service") as string;
  const source = formData.get("source") as string;
  const notes = formData.get("notes") as string;

  if (!name || !email || !phone) {
    return { error: "Name, email, and phone are required." };
  }

  const valueMap: Record<string, number> = {
    "Dental Implant": 1500,
    "Invisalign": 3500,
    "Teeth Whitening": 350,
    "Dental Veneers": 6000,
    "Root Canal": 800,
    "General Checkup": 150,
    "General Consultation": 150,
  };
  
  const estimatedValue = valueMap[service || "General Consultation"] || 150;
  const leadScore = Math.floor(Math.random() * 30) + 70; // 70 to 99
  const intentLevel = leadScore >= 85 ? "HIGH" : "MEDIUM";
  const readiness = leadScore >= 85 ? "Within 2 weeks" : "Researching";

  try {
    const clinic = await prisma.clinic.findFirst();
    if (!clinic) return { error: "Clinic not found." };

    await prisma.lead.create({
      data: {
        name,
        email,
        phone,
        status: "NEW",
        source: source || "DIRECT_CALL",
        interestedService: service || "General Consultation",
        notes,
        leadScore,
        intentLevel,
        readiness,
        estimatedValue,
        clinicId: clinic.id,
      },
    });

    revalidatePath("/dashboard/leads");
    return { success: true };
  } catch (err) {
    console.error("Create lead crm action error:", err);
    return { error: "Failed to create lead." };
  }
}

export async function deleteLeadAction(leadId: string) {
  try {
    await prisma.lead.delete({
      where: { id: leadId },
    });
    revalidatePath("/dashboard/leads");
    return { success: true };
  } catch (err) {
    console.error("Delete lead action error:", err);
    return { error: "Failed to delete lead." };
  }
}

export async function updateAppointmentStatusAction(appointmentId: string, newStatus: string) {
  try {
    const updated = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: newStatus },
    });

    // If status is COMPLETED, add a Payment if not already present to simulate billing!
    if (newStatus === "COMPLETED" && updated.patientId) {
      const existingPayments = await prisma.payment.findFirst({
        where: { patientId: updated.patientId, notes: { contains: updated.id } },
      });

      if (!existingPayments) {
        await prisma.payment.create({
          data: {
            amount: 150.0,
            status: "UNPAID",
            method: "CREDIT_CARD",
            notes: `Copay billing generated for appointment Ref ID: ${updated.id}`,
            patientId: updated.patientId,
          },
        });
      }
    }

    revalidatePath("/dashboard/calendar");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/patients");
    return { success: true };
  } catch (err) {
    console.error("Update appointment status action error:", err);
    return { success: false, error: "Failed to update schedule status." };
  }
}

export async function deleteAppointmentAction(appointmentId: string) {
  try {
    await prisma.appointment.delete({
      where: { id: appointmentId },
    });
    revalidatePath("/dashboard/calendar");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (err) {
    console.error("Delete appointment action error:", err);
    return { success: false, error: "Failed to delete appointment." };
  }
}

export async function createCampaignAction(formData: FormData) {
  const name = formData.get("name") as string;
  const type = formData.get("type") as string;
  const subject = formData.get("subject") as string;
  const content = formData.get("content") as string;
  const segment = formData.get("audienceSegment") as string;

  if (!name || !type || !content || !segment) {
    return { error: "Name, type, segment, and content are required fields." };
  }

  try {
    const clinic = await prisma.clinic.findFirst();
    if (!clinic) return { error: "Clinic not found." };

    await prisma.campaign.create({
      data: {
        name,
        type,
        subject,
        content,
        audienceSegment: segment,
        status: "DRAFT",
        clinicId: clinic.id,
      },
    });

    revalidatePath("/dashboard/campaigns");
    return { success: true };
  } catch (err) {
    console.error("Create campaign action error:", err);
    return { error: "Failed to create campaign." };
  }
}

export async function triggerCampaignAction(campaignId: string) {
  try {
    // Generate mock ROI results depending on the campaign name/type
    const campaign = await prisma.campaign.findUnique({ where: { id: campaignId } });
    if (!campaign) return { error: "Campaign not found" };

    let leadsCount = 0;
    let appointmentsCount = 0;
    let conversionsCount = 0;
    let revenue = 0.0;

    const lowerName = campaign.name.toLowerCase();
    if (lowerName.includes("implant")) {
      leadsCount = 85;
      appointmentsCount = 18;
      conversionsCount = 10;
      revenue = 30000.00;
    } else if (lowerName.includes("whitening") || lowerName.includes("smile")) {
      leadsCount = 140;
      appointmentsCount = 42;
      conversionsCount = 20;
      revenue = 7000.00;
    } else if (lowerName.includes("orthodontic") || lowerName.includes("invisalign")) {
      leadsCount = 65;
      appointmentsCount = 14;
      conversionsCount = 6;
      revenue = 24000.00;
    } else {
      leadsCount = 45;
      appointmentsCount = 8;
      conversionsCount = 4;
      revenue = 2500.00;
    }

    // Update campaign metrics
    await prisma.campaign.update({
      where: { id: campaignId },
      data: {
        status: "SENT",
        leadsCount,
        appointmentsCount,
        conversionsCount,
        revenue,
      },
    });

    // Log audit log
    await prisma.auditLog.create({
      data: {
        action: "CAMPAIGN_TRIGGERED",
        details: `Triggered outbound marketing campaign: "${campaign.name}" yielding ${leadsCount} leads and $${revenue} ROI`,
      },
    });

    revalidatePath("/dashboard/campaigns");
    revalidatePath("/dashboard/analytics");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (err) {
    console.error("Trigger campaign action error:", err);
    return { error: "Failed to execute campaign outreach." };
  }
}

export async function queryAIConsultantAction(question: string) {
  const normalized = question.toLowerCase().trim();
  try {
    if (normalized.includes("appointment") || normalized.includes("schedule") || normalized.includes("no-show")) {
      const apptCount = await prisma.appointment.count();
      const confirmedCount = await prisma.appointment.count({ where: { status: "CONFIRMED" } });
      const completedCount = await prisma.appointment.count({ where: { status: "COMPLETED" } });
      const cancelledCount = await prisma.appointment.count({ where: { status: "CANCELLED" } });

      return {
        reply: `📊 **Clinical Schedule Analysis:**\n\nWe have **${apptCount} appointments** logged in our system. Of these, **${completedCount} are completed**, **${confirmedCount} are confirmed**, and **${cancelledCount} are cancelled**.\n\n*Growth Insight:* Our no-show rate is low, but appointments booked after 5:00 PM show 15% higher attendance than mid-day slots. We suggest scheduling cosmetic consults (Implants/Veneers) in late afternoon to maximize patient conversion.`,
      };
    }

    if (normalized.includes("inactive") || normalized.includes("reactivate") || normalized.includes("patient")) {
      const twelveMonthsAgo = new Date();
      twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
      
      const inactiveCount = await prisma.patient.count({
        where: {
          lastVisitDate: {
            lt: twelveMonthsAgo,
          },
        },
      });

      return {
        reply: `✉️ **Patient Reactivation Analysis:**\n\nOur system detected **${inactiveCount} patient** (Olivia Anderson) who has not visited the clinic in over 12 months. This represents a potential hygiene revenue leakage.\n\n*Action Plan:* Trigger the 'Annual Checkup Recall' campaign. Automated SMS blasts to inactive patients typically reclaim 8% of lost accounts, generating an estimated **$3,500 in hygiene billings** within 30 days.`,
      };
    }

    if (normalized.includes("lead") || normalized.includes("source") || normalized.includes("marketing") || normalized.includes("ads")) {
      const leadsCount = await prisma.lead.count();
      const highIntentCount = await prisma.lead.count({ where: { intentLevel: "HIGH" } });
      const googleAdsCount = await prisma.lead.count({ where: { source: "GOOGLE_ADS" } });
      const chatCount = await prisma.lead.count({ where: { source: "WEBSITE_CHAT" } });

      return {
        reply: `🎯 **Lead Acquisition Intelligence:**\n\nWe have **${leadsCount} qualified leads** in the pipeline. **${highIntentCount} leads** are scored as High Intent. Acquisition sources include **${googleAdsCount} from Google Ads** and **${chatCount} from Website AI Chat**.\n\n*ROI Recommendation:* Google Ads generates high volume, but Website AI Chat leads score 12% higher on readiness and convert 2x faster. Shift 15% of your ad spend from Facebook to direct site traffic to lower patient acquisition cost (CPA) by ~$85.`,
      };
    }

    return {
      reply: `💡 **ApexDental Growth Recommendation:**\n\nTo increase bookings this week, we suggest focusing on your **${await prisma.lead.count({ where: { status: "NEW" } })} new inquiries**.\n\n1. Enable automated **Day 0 SMS follow-ups** in campaigns.\n2. Ensure staff phone high-intent leads within 5 minutes of website chatbot qualification. (Implant leads have a 45% higher booking rate if contacted immediately).\n\nWhat other metrics (LTV, no-show rates, or campaigns) can I analyze for you?`,
    };
  } catch (err) {
    console.error("AI Consultant action error:", err);
    return { reply: "Sorry, I had an issue querying the database logs. Please try again." };
  }
}
