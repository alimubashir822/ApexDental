"use client";

import React, { useState, useRef, useEffect, useTransition } from "react";
import { queryAIConsultantAction } from "@/lib/lead-actions";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Bot, Send, Sparkles, User, HelpCircle, Loader2 } from "lucide-react";
import confetti from "canvas-confetti";

interface ChatMessage {
  role: "assistant" | "user";
  content: string;
}

export function AIPracticeConsultant() {
  const [isPending, startTransition] = useTransition();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hello! I am your CareFlow Practice Advisor. Ask me anything about clinic operations, LTV statistics, reactivation strategies, or marketing channels.",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const presets = [
    "Analyze no-shows",
    "Identify inactive patients",
    "Compare marketing lead sources",
  ];

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isPending) return;

    const userMsg: ChatMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    startTransition(async () => {
      const res = await queryAIConsultantAction(text);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.reply },
      ]);
      
      confetti({
        particleCount: 30,
        spread: 30,
        colors: ["#6366f1", "#4f46e5"],
      });
    });
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isPending]);

  return (
    <Card className="border-border shadow-sm flex flex-col h-[520px]">
      <CardHeader className="border-b border-border/30 bg-muted/10 shrink-0">
        <CardTitle className="text-xs font-bold text-foreground flex items-center space-x-1.5">
          <Sparkles className="h-4 w-4 text-primary animate-pulse" />
          <span>Interactive Growth Intelligence Chat</span>
        </CardTitle>
        <CardDescription>
          Ask CareFlow to analyze appointments, LTV logs, and lead conversions.
        </CardDescription>
      </CardHeader>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`flex items-start space-x-2 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse space-x-reverse" : "flex-row"}`}>
              <div className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 border ${
                msg.role === "user" ? "bg-secondary text-secondary-foreground" : "bg-primary/10 text-primary border-primary/20"
              }`}>
                {msg.role === "user" ? <User size={12} /> : <Bot size={12} />}
              </div>
              <div className={`rounded-xl px-3 py-2 leading-relaxed border ${
                msg.role === "user" ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-foreground border-border/50"
              } whitespace-pre-wrap`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}

        {isPending && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2">
              <div className="h-6 w-6 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
                <Bot size={12} />
              </div>
              <div className="bg-muted border border-border/50 text-muted-foreground rounded-xl px-3 py-2 flex items-center space-x-2">
                <Loader2 size={12} className="animate-spin text-primary" />
                <span>Analyzing SQL database logs...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Preset helpers */}
      <div className="p-3 border-t border-border/30 bg-muted/20 shrink-0">
        <div className="flex flex-wrap gap-1.5">
          {presets.map((p) => (
            <button
              key={p}
              disabled={isPending}
              onClick={() => handleSendMessage(p)}
              className="text-[10px] bg-card border border-border text-muted-foreground hover:text-foreground px-2.5 py-1 rounded-full cursor-pointer hover:bg-muted font-medium transition-colors flex items-center space-x-1"
            >
              <HelpCircle size={10} className="text-primary/70" />
              <span>{p}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input textbox */}
      <div className="p-3 border-t border-border bg-card flex items-center space-x-2 shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isPending}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSendMessage(input);
          }}
          placeholder="Ask AI Growth Advisor (e.g. no-shows, reactivation)..."
          className="flex-1 bg-muted border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-primary text-foreground disabled:opacity-50"
        />
        <button
          onClick={() => handleSendMessage(input)}
          disabled={isPending}
          className="h-8 w-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center shadow hover:bg-primary/95 transition-all cursor-pointer disabled:opacity-50"
        >
          <Send size={13} />
        </button>
      </div>
    </Card>
  );
}
