"use server";

import { prisma } from "./db";
import { processChatbotMessage, ChatMessage } from "./ai-service";

export async function sendChatbotMessageAction(message: string, history: ChatMessage[]) {
  try {
    const clinic = await prisma.clinic.findFirst();
    if (!clinic) {
      return { reply: "Clinic setup is in progress. Please check back shortly!" };
    }
    const result = await processChatbotMessage(message, history, clinic.id);
    return result;
  } catch (err) {
    console.error("Chatbot action error:", err);
    return { reply: "Sorry, I had an error processing that. Could you try again?" };
  }
}
