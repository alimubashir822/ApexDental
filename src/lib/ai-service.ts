import { prisma } from "./db";

import { ChatMessage } from "./ai-helpers";
export type { ChatMessage };

export async function processChatbotMessage(
  message: string,
  history: ChatMessage[],
  clinicId: string
): Promise<{ reply: string; leadsCreated?: boolean }> {
  const normalized = message.toLowerCase().trim();
  
  // Combine history content to find what we already know
  const allMessages = [...history, { role: "user", content: message }] as ChatMessage[];
  const userMessages = allMessages.filter(m => m.role === "user").map(m => m.content);
  const userTextCombined = userMessages.join(" ");

  // Simple state extractor
  const emails = userTextCombined.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
  const phones = userTextCombined.match(/(?:\+?\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}/g) || [];
  
  // Extract name by looking at introduction patterns
  let name = "";
  for (const msg of userMessages) {
    const nameMatch = msg.match(/(?:my name is|i am|i'm|this is) ([a-zA-Z]{2,}(?:\s+[a-zA-Z]{2,})?)/i);
    if (nameMatch) {
      name = nameMatch[1];
      break;
    }
  }

  // Extract service interest
  let service = "General Consultation";
  if (userTextCombined.includes("implant")) {
    service = "Dental Implant";
  } else if (userTextCombined.includes("invisalign") || userTextCombined.includes("braces")) {
    service = "Invisalign";
  } else if (userTextCombined.includes("whiten") || userTextCombined.includes("bleach")) {
    service = "Teeth Whitening";
  } else if (userTextCombined.includes("veneer")) {
    service = "Dental Veneers";
  } else if (userTextCombined.includes("canal") || userTextCombined.includes("ache") || userTextCombined.includes("pain")) {
    service = "Root Canal";
  }

  // 1. If we have name, email, and phone, we can create the lead!
  const hasEmail = emails.length > 0;
  const hasPhone = phones.length > 0;
  const hasName = name.length > 0;

  if (hasEmail && hasPhone && hasName) {
    const emailVal = emails[0]!;
    const phoneVal = phones[0]!;

    // Check if lead already exists
    const existingLead = await prisma.lead.findFirst({
      where: {
        email: emailVal,
        clinicId,
      },
    });

    if (!existingLead) {
      await prisma.lead.create({
        data: {
          name,
          email: emailVal,
          phone: phoneVal,
          status: "NEW",
          source: "WEBSITE_CHAT",
          interestedService: service,
          notes: `Lead automatically captured by AI Receptionist chatbot. Customer query: "${message}"`,
          clinicId,
        },
      });

      // Log audit
      await prisma.auditLog.create({
        data: {
          action: "LEAD_CAPTURED_AI",
          details: `AI Receptionist automatically qualified and captured lead: ${name} (${emailVal})`,
        },
      });

      return {
        reply: `Fantastic news, ${name}! 🎉 I've successfully verified your contact details (${emailVal} and ${phoneVal}) and registered your interest in our ${service} treatment. One of our scheduling coordinators will call you shortly to confirm your booking date. Is there anything else I can assist you with today?`,
        leadsCreated: true,
      };
    } else {
      return {
        reply: `Welcome back, ${name}! I see you're already in our system for ${existingLead.interestedService}. I've noted down your current query: "${message}" and alerted our receptionist. We'll be in touch!`,
        leadsCreated: false,
      };
    }
  }

  // 2. Chatbot conversational flow
  if (normalized.includes("hello") || normalized.includes("hi") || normalized.includes("hey")) {
    return {
      reply: "Hello! I am the Apex AI Receptionist. I can explain our dental treatments, estimate pricing, check doctor schedules, or help you book an appointment. How can I help you today?",
    };
  }

  if (normalized.includes("cost") || normalized.includes("price") || normalized.includes("how much")) {
    return {
      reply: "Our diagnostic consults are free when booking a treatment! Here is our basic guide:\n\n• Professional Whitening: $350\n• Teeth Fillings: $150 - $250\n• Root Canal: $600 - $800\n• Invisalign Clear Aligners: $3,500 - $5,000\n• Premium Implant (post + crown): $1,500+\n\nWould you like to book a consultation? If so, please share your full name to start.",
    };
  }

  if (normalized.includes("implant")) {
    return {
      reply: "We specialize in premium Dental Implants. They look and function exactly like natural teeth and last a lifetime. To check if you're a good candidate, Dr. Patel offers a free 3D imaging scan. To schedule this, could you share your name?",
    };
  }

  if (normalized.includes("invisalign") || normalized.includes("aligner")) {
    return {
      reply: "Invisalign clear aligners are a comfortable, invisible way to straighten teeth. Treatment takes between 6 to 12 months on average. We offer flexible payment plans starting at $99/month. What is your name so I can check Dr. Patel's calendar for you?",
    };
  }

  if (normalized.includes("insurance") || normalized.includes("cover")) {
    return {
      reply: "We accept all major PPO insurance plans (including Delta Dental, Blue Cross, Aetna, Cigna, and MetLife). We also file claims on your behalf to maximize your benefits! Let's get your consultation set up. What is your full name?",
    };
  }

  // 3. Fallback / prompting for missing fields
  if (!hasName) {
    return {
      reply: "That sounds like a treatment we can certainly help with! What is your full name so I can register your query?",
    };
  }

  if (!hasEmail) {
    return {
      reply: `Thanks, ${name}. What email address should we use to send you Dr. Patel's scheduling links and pricing options?`,
    };
  }

  if (!hasPhone) {
    return {
      reply: `Got it. Lastly, ${name}, what is the best mobile number for us to call or text you to confirm your appointment time?`,
    };
  }

  return {
    reply: "Thank you for the message. I'm noting that in your file, and we'll have a staff member reach out to you shortly. You can also book a specific time directly using our 'Book Appointment' link in the top menu!",
  };
}
