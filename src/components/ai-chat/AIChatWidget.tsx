"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, Sparkles } from "lucide-react";
import { sendChatbotMessageAction } from "@/lib/chat-actions";
import { ChatMessage } from "@/lib/ai-helpers";
import confetti from "canvas-confetti";

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hi! I'm your AI Medical Receptionist. Ask me anything about our services, insurance coverage, treatment pricing, or doctors! Let me know if you want to book a consultation.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    "How much do Dental Implants cost?",
    "Do you take insurance?",
    "I need Invisalign pricing",
    "Book an appointment",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMessage: ChatMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await sendChatbotMessageAction(text, messages);
      setIsTyping(false);
      
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.reply },
      ]);

      if (response.leadsCreated) {
        // Trigger lead capture celebration!
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.8 },
          colors: ["#14b8a6", "#0d9488", "#0f766e", "#1e1b4b"],
        });
      }
    } catch (err) {
      console.error(err);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Oops, I encountered a connection issue. Please try again." },
      ]);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 font-sans">
      {/* Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer animate-bounce relative group"
        >
          <MessageSquare className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-rose-500 rounded-full border-2 border-background animate-pulse" />
          <div className="absolute right-16 bg-card text-foreground text-xs px-3 py-1.5 rounded-lg border border-border shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            Chat with AI Receptionist
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="flex flex-col w-[calc(100vw-32px)] sm:w-[380px] h-[calc(100vh-120px)] sm:h-[520px] max-h-[580px] rounded-2xl border border-border bg-card shadow-2xl overflow-hidden glass-panel transition-all duration-300 scale-100 origin-bottom-right">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-primary text-primary-foreground">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary-foreground/15">
                <Bot className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">AI Assistant</h4>
                <div className="flex items-center space-x-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-primary-foreground/75">Online & Qualified</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 p-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex items-start space-x-2 max-w-[85%] ${
                    msg.role === "user" ? "flex-row-reverse space-x-reverse" : "flex-row"
                  }`}
                >
                  <div
                    className={`flex items-center justify-center h-6 w-6 rounded-full shrink-0 ${
                      msg.role === "user"
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <User className="h-3.5 w-3.5" />
                    ) : (
                      <Bot className="h-3.5 w-3.5" />
                    )}
                  </div>
                  <div
                    className={`rounded-xl px-3 py-2 text-xs leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted text-foreground border border-border/40"
                    } whitespace-pre-wrap`}
                  >
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2 max-w-[85%]">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary shrink-0">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                  <div className="bg-muted text-foreground border border-border/40 rounded-xl px-3 py-2.5">
                    <div className="flex space-x-1">
                      <div className="h-1.5 w-1.5 bg-foreground/30 rounded-full animate-bounce" />
                      <div className="h-1.5 w-1.5 bg-foreground/30 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="h-1.5 w-1.5 bg-foreground/30 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="p-3 bg-muted/30 border-t border-border/10">
            <div className="flex flex-wrap gap-1.5">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSendMessage(prompt)}
                  className="text-[10px] bg-card hover:bg-muted border border-border text-muted-foreground hover:text-foreground px-2 py-1 rounded-full cursor-pointer transition-all shrink-0 flex items-center space-x-1"
                >
                  <Sparkles size={8} className="text-primary/70" />
                  <span>{prompt}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-3 bg-card border-t border-border flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendMessage(input);
              }}
              placeholder="Ask AI Receptionist..."
              className="flex-1 bg-muted border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-primary text-foreground"
            />
            <button
              onClick={() => handleSendMessage(input)}
              className="h-8 w-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center shadow hover:bg-primary/95 transition-colors cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
