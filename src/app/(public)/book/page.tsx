"use client";

import React, { useState, useTransition } from "react";
import { bookAppointmentAction } from "@/lib/lead-actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Calendar as CalendarIcon, Clock, CheckCircle2, User, Phone, Mail, FileText } from "lucide-react";
import confetti from "canvas-confetti";

export default function BookPage() {
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<{ success?: boolean; message?: string; error?: string }>({});

  const doctors = [
    { value: "Dr. Alexander Patel", label: "Dr. Alexander Patel (Orthodontics & General)" },
    { value: "Dr. Sarah Mitchell", label: "Dr. Sarah Mitchell (Cosmetic Restoration & Implants)" },
  ];

  const timeSlots = [
    { value: "09:00", label: "09:00 AM" },
    { value: "10:00", label: "10:00 AM" },
    { value: "11:00", label: "11:00 AM" },
    { value: "12:00", label: "12:00 PM" },
    { value: "14:00", label: "02:00 PM" },
    { value: "15:00", label: "03:00 PM" },
    { value: "16:00", label: "04:00 PM" },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const res = await bookAppointmentAction(null, formData);
      setState(res);
      if (res.success) {
        confetti({
          particleCount: 80,
          spread: 55,
          origin: { y: 0.8 },
          colors: ["#14b8a6", "#4f46e5"],
        });
        (e.target as HTMLFormElement).reset();
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column info */}
        <div className="lg:col-span-4 space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Schedule Consultation</h1>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              Book a real-time reservation. Converted status will update on the Lead Pipeline inside the dashboard immediately!
            </p>
          </div>
          
          <div className="p-5 rounded-xl border border-border bg-card space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-primary">Need urgent assistance?</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              For emergency trauma, pain consults, or same-day cancellations, please phone our clinical coordinators directly.
            </p>
            <div className="text-sm font-bold text-foreground">
              📞 (555) 234-5678
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">What happens next?</h4>
            <ul className="text-xs text-muted-foreground space-y-2">
              <li className="flex items-start space-x-2">
                <span className="h-4 w-4 bg-primary/10 text-primary flex items-center justify-center rounded-full shrink-0 text-[10px] font-bold">1</span>
                <span>Receive instant SMS details confirmation</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="h-4 w-4 bg-primary/10 text-primary flex items-center justify-center rounded-full shrink-0 text-[10px] font-bold">2</span>
                <span>Your details appear inside the CRM dashboard in real-time</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="h-4 w-4 bg-primary/10 text-primary flex items-center justify-center rounded-full shrink-0 text-[10px] font-bold">3</span>
                <span>Arrival checking via receptionist pipeline</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right column form */}
        <div className="lg:col-span-8">
          <Card className="shadow-lg border-border/60">
            <CardHeader className="border-b border-border/30 bg-muted/10">
              <CardTitle className="flex items-center space-x-2 text-foreground font-bold">
                <CalendarIcon className="h-5 w-5 text-primary" />
                <span>Reserve Appointment Slot</span>
              </CardTitle>
              <CardDescription>
                Provide your contact and desired doctor timing.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {state.success ? (
                <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
                  <CheckCircle2 className="h-16 w-16 text-emerald-500 animate-bounce" />
                  <h3 className="font-extrabold text-foreground text-lg">Appointment Scheduled!</h3>
                  <p className="text-sm text-muted-foreground max-w-md">{state.message}</p>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => setState({})}
                    className="mt-2 text-xs"
                  >
                    Schedule Another Slot
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {state.error && (
                    <div className="p-4 text-xs bg-destructive/10 text-destructive border border-destructive/20 rounded-lg">
                      {state.error}
                    </div>
                  )}

                  {/* Personal info section */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border/40 pb-1.5 flex items-center space-x-1.5">
                      <User size={13} />
                      <span>1. Patient Information</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        name="name"
                        label="Full Name"
                        placeholder="John Smith"
                        required
                      />
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
                        placeholder="(555) 123-4567"
                        required
                      />
                    </div>
                  </div>

                  {/* Booking details section */}
                  <div className="space-y-4 pt-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border/40 pb-1.5 flex items-center space-x-1.5">
                      <Clock size={13} />
                      <span>2. Scheduling Options</span>
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Select
                        name="doctorName"
                        label="Select Practitioner"
                        options={doctors}
                        defaultValue="Dr. Alexander Patel"
                      />
                      
                      <Input
                        name="date"
                        type="date"
                        label="Select Date"
                        min={new Date().toISOString().split("T")[0]}
                        required
                      />

                      <Select
                        name="time"
                        label="Desired Time Slot"
                        options={timeSlots}
                        defaultValue="09:00"
                      />
                    </div>
                  </div>

                  {/* Notes section */}
                  <div className="space-y-4 pt-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border/40 pb-1.5 flex items-center space-x-1.5">
                      <FileText size={13} />
                      <span>3. Clinical Concerns (Optional)</span>
                    </h3>
                    <div className="flex flex-col space-y-1.5">
                      <textarea
                        name="notes"
                        placeholder="Specify if you have pain, need implants, tooth cleaning, veneers, or orthodontic alignments..."
                        className="flex min-h-[90px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary text-foreground"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full font-bold py-3 text-xs uppercase tracking-wider"
                    isLoading={isPending}
                  >
                    Confirm Booking Reservation
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
