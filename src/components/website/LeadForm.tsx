"use client";

import React, { useState, useTransition } from "react";
import { submitLeadFormAction } from "@/lib/lead-actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Sparkles, CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";

export function LeadForm({ defaultService }: { defaultService?: string }) {
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<{ success?: boolean; message?: string; error?: string }>({});

  const services = [
    { value: "Dental Implant", label: "Dental Implants" },
    { value: "Invisalign", label: "Invisalign Clear Aligners" },
    { value: "Teeth Whitening", label: "Teeth Whitening" },
    { value: "Dental Veneers", label: "Cosmetic Veneers" },
    { value: "Root Canal", label: "Root Canal Therapy" },
    { value: "General Checkup", label: "General Dentistry & Hygiene" },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const res = await submitLeadFormAction(null, formData);
      setState(res);
      if (res.success) {
        confetti({
          particleCount: 60,
          spread: 50,
          origin: { y: 0.8 },
          colors: ["#14b8a6", "#10b981"],
        });
        (e.target as HTMLFormElement).reset();
      }
    });
  };

  return (
    <Card className="glow-primary border-primary/20 bg-card/85 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-primary font-bold">
          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
          <span>Qualify For Free Consultation</span>
        </CardTitle>
        <CardDescription>
          Submit your query to check treatment eligibility and available slots.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {state.success ? (
          <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
            <CheckCircle2 className="h-12 w-12 text-emerald-500 animate-bounce" />
            <h4 className="font-bold text-foreground text-sm">Form Submitted Successfully!</h4>
            <p className="text-xs text-muted-foreground max-w-xs">{state.message}</p>
            <Button
              variant="outline"
              size="sm"
              className="text-[10px]"
              onClick={() => setState({})}
            >
              Submit Another Inquiry
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {state.error && (
              <div className="p-3 text-xs bg-destructive/10 text-destructive border border-destructive/20 rounded-lg">
                {state.error}
              </div>
            )}
            <Input
              name="name"
              label="Full Name"
              placeholder="e.g. John Smith"
              required
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                name="email"
                type="email"
                label="Email Address"
                placeholder="john@example.com"
                required
              />
              <Input
                name="phone"
                type="tel"
                label="Phone Number"
                placeholder="(555) 000-0000"
                required
              />
            </div>
            <Select
              key={defaultService}
              name="service"
              label="Interested Service"
              options={services}
              defaultValue={defaultService || "Dental Implant"}
            />
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-semibold leading-none text-muted-foreground">
                How can we help? (Optional)
              </label>
              <textarea
                name="notes"
                placeholder="Mention any dental concerns, pain, or schedule requirements..."
                className="flex min-h-[60px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary text-foreground"
              />
            </div>
            <Button
              type="submit"
              className="w-full text-xs py-2.5 font-bold mt-2"
              isLoading={isPending}
            >
              Qualify & Check Slots
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
