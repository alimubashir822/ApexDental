"use client";

import React, { useState, useTransition } from "react";
import { updateAppointmentStatusAction, deleteAppointmentAction } from "@/lib/lead-actions";
import { bookAppointmentAction } from "@/lib/lead-actions";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Clock,
  User,
  CheckCircle,
  XCircle,
  Calendar,
  X,
  Sparkles,
} from "lucide-react";
import confetti from "canvas-confetti";

interface Appointment {
  id: string;
  dateTime: Date;
  duration: number;
  status: string;
  notes: string | null;
  doctorName: string;
  patient?: { name: string; email: string; phone: string } | null;
  lead?: { name: string; email: string; phone: string } | null;
}

export function CalendarView({ initialAppointments }: { initialAppointments: Appointment[] }) {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const doctors = [
    { value: "Dr. Alexander Patel", label: "Dr. Alexander Patel (Orthodontics)" },
    { value: "Dr. Sarah Mitchell", label: "Dr. Sarah Mitchell (Cosmetic Surgery)" },
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

  // Helper values for generating month calendar
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Generate days array
  const calendarDays = [];
  // Padding for previous month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  // Days of current month
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(new Date(year, month, i));
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Filter appointments for selected date
  const selectedDateAppointments = appointments.filter((appt) => {
    const apptDate = new Date(appt.dateTime);
    return (
      apptDate.getDate() === selectedDate.getDate() &&
      apptDate.getMonth() === selectedDate.getMonth() &&
      apptDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  // Check if a day has appointments for dots
  const dayHasAppointments = (day: Date) => {
    return appointments.some((appt) => {
      const apptDate = new Date(appt.dateTime);
      return (
        apptDate.getDate() === day.getDate() &&
        apptDate.getMonth() === day.getMonth() &&
        apptDate.getFullYear() === day.getFullYear()
      );
    });
  };

  const handleStatusChange = async (apptId: string, status: string) => {
    // Optimistic state update
    setAppointments((prev) =>
      prev.map((a) => (a.id === apptId ? { ...a, status } : a))
    );

    startTransition(async () => {
      await updateAppointmentStatusAction(apptId, status);
      if (status === "COMPLETED") {
        confetti({
          particleCount: 50,
          spread: 40,
          origin: { y: 0.8 },
          colors: ["#10b981", "#34d399"],
        });
      }
    });
  };

  const handleDeleteAppointment = async (apptId: string) => {
    if (!confirm("Are you sure you want to cancel and remove this appointment?")) return;

    setAppointments((prev) => prev.filter((a) => a.id !== apptId));
    startTransition(async () => {
      await deleteAppointmentAction(apptId);
    });
  };

  const handleNewBooking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await bookAppointmentAction(null, formData);
      if (res.success) {
        setIsBookOpen(false);
        window.location.reload();
      }
    });
  };

  const apptColors: Record<string, "primary" | "secondary" | "success" | "warning" | "destructive" | "outline"> = {
    PENDING: "warning",
    CONFIRMED: "primary",
    COMPLETED: "success",
    CANCELLED: "destructive",
  };

  return (
    <div className="space-y-6 w-full h-full flex flex-col">
      {/* Header controls */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-sm font-bold text-foreground">Clinic Scheduler Calendar</h2>
          <p className="text-[10px] text-muted-foreground">Schedule clinical times, balance physician shifts, and log checkins.</p>
        </div>
        <Button
          onClick={() => setIsBookOpen(true)}
          className="text-xs font-bold py-1.5 px-3 flex items-center space-x-1"
        >
          <Plus size={14} />
          <span>New Reservation</span>
        </Button>
      </div>

      {/* Main Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch flex-1 h-[530px] overflow-hidden">
        
        {/* Left Side: Month Grid Card */}
        <div className="lg:col-span-7 border border-border bg-card rounded-xl p-4 flex flex-col h-full overflow-hidden shadow-sm">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4 shrink-0">
            <h3 className="text-xs font-extrabold text-foreground">
              {monthNames[month]} {year}
            </h3>
            <div className="flex items-center space-x-1">
              <button
                onClick={handlePrevMonth}
                className="p-1 border border-border rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1 border border-border rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Weekday Names Header */}
          <div className="grid grid-cols-7 gap-1 text-center font-bold text-muted-foreground text-[10px] border-b border-border pb-1.5 shrink-0">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 flex-1 mt-2 text-xs">
            {calendarDays.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="bg-transparent" />;
              }

              const isSelected =
                day.getDate() === selectedDate.getDate() &&
                day.getMonth() === selectedDate.getMonth() &&
                day.getFullYear() === selectedDate.getFullYear();

              const hasAppt = dayHasAppointments(day);

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={`h-full min-h-[50px] rounded-lg border flex flex-col items-center justify-center p-1.5 transition-all cursor-pointer hover:border-primary/50 hover:bg-primary/5 relative ${
                    isSelected
                      ? "border-primary bg-primary/10 text-primary font-bold shadow-sm"
                      : "border-border/30 bg-card text-foreground"
                  }`}
                >
                  <span>{day.getDate()}</span>
                  {hasAppt && (
                    <span className="absolute bottom-1.5 h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Day Schedule timeline list */}
        <div className="lg:col-span-5 border border-border bg-card rounded-xl flex flex-col h-full overflow-hidden shadow-sm">
          <div className="p-4 border-b border-border bg-muted/10 shrink-0">
            <h3 className="text-xs font-bold text-foreground">
              Schedule: {selectedDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">List of patient reservations on selected day</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {selectedDateAppointments.length === 0 ? (
              <div className="h-full flex flex-col justify-center items-center p-8 text-center text-xs text-muted-foreground border border-dashed border-border/60 rounded-xl">
                <Calendar className="h-8 w-8 text-muted/30 mb-2" />
                <p>No appointments booked for this day.</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsBookOpen(true)}
                  className="mt-2 text-[10px] font-bold"
                >
                  Book Schedule Slot
                </Button>
              </div>
            ) : (
              selectedDateAppointments.map((appt) => (
                <div
                  key={appt.id}
                  className="p-3 border border-border rounded-xl bg-muted/15 space-y-3 hover:border-primary/10 transition-colors"
                >
                  <div className="flex items-start justify-between text-xs">
                    <div className="space-y-1">
                      <div className="font-bold text-foreground flex items-center space-x-1.5">
                        <User size={12} className="text-primary" />
                        <span>{appt.patient?.name ?? appt.lead?.name ?? "Anonymous Patient"}</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground flex items-center space-x-1.5">
                        <Clock size={10} />
                        <span>{new Date(appt.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({appt.duration} mins)</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        Doctor: <span className="font-semibold text-foreground">{appt.doctorName}</span>
                      </div>
                    </div>
                    <Badge variant={apptColors[appt.status] || "outline"}>
                      {appt.status}
                    </Badge>
                  </div>

                  {appt.notes && (
                    <div className="p-2 text-[10px] text-muted-foreground bg-card border border-border/40 rounded italic leading-relaxed">
                      Notes: "{appt.notes}"
                    </div>
                  )}

                  {/* Actions buttons */}
                  <div className="flex items-center justify-between border-t border-border/30 pt-2.5 mt-2">
                    <div className="flex space-x-1">
                      {appt.status === "PENDING" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-[9px] px-2 py-0.5 h-6 font-semibold"
                          onClick={() => handleStatusChange(appt.id, "CONFIRMED")}
                          disabled={isPending}
                        >
                          Confirm
                        </Button>
                      )}
                      {appt.status === "CONFIRMED" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-[9px] px-2 py-0.5 h-6 font-semibold text-emerald-600 hover:bg-emerald-500/10 border-emerald-500/20"
                          onClick={() => handleStatusChange(appt.id, "COMPLETED")}
                          disabled={isPending}
                        >
                          Checkout
                        </Button>
                      )}
                      {appt.status !== "CANCELLED" && appt.status !== "COMPLETED" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-[9px] px-2 py-0.5 h-6 font-semibold text-rose-600 hover:bg-rose-500/10 border-rose-500/20"
                          onClick={() => handleStatusChange(appt.id, "CANCELLED")}
                          disabled={isPending}
                        >
                          Cancel Appt
                        </Button>
                      )}
                    </div>

                    <button
                      onClick={() => handleDeleteAppointment(appt.id)}
                      className="p-1 text-muted-foreground hover:text-destructive hover:bg-muted rounded border border-border/40 cursor-pointer"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Modal: Book Appointment */}
      {isBookOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-md rounded-2xl border border-border shadow-2xl overflow-hidden glass-panel">
            <form onSubmit={handleNewBooking}>
              <div className="flex items-center justify-between p-4 border-b border-border bg-muted/20">
                <h3 className="text-sm font-bold text-foreground flex items-center space-x-1.5">
                  <Calendar size={15} className="text-primary" />
                  <span>Manually Schedule Slot</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsBookOpen(false)}
                  className="text-muted-foreground hover:text-foreground hover:bg-muted p-1.5 rounded-lg cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <Input
                  name="name"
                  label="Patient / Lead Name"
                  placeholder="e.g. Michael Brown"
                  required
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    name="email"
                    type="email"
                    label="Email Address"
                    placeholder="mbrown@email.com"
                    required
                  />
                  <Input
                    name="phone"
                    type="tel"
                    label="Phone Number"
                    placeholder="(555) 111-2222"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Select
                    name="doctorName"
                    label="Select Doctor"
                    options={doctors}
                    defaultValue="Dr. Alexander Patel"
                  />
                  <Select
                    name="time"
                    label="Time Slot"
                    options={timeSlots}
                    defaultValue="09:00"
                  />
                </div>

                <Input
                  name="date"
                  type="date"
                  label="Appointment Date"
                  min={new Date().toISOString().split("T")[0]}
                  required
                />

                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs font-semibold leading-none text-muted-foreground">
                    Clinical Notes
                  </label>
                  <textarea
                    name="notes"
                    placeholder="Orthodontic consultation or whitening procedure followups..."
                    className="flex min-h-[60px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary text-foreground"
                  />
                </div>
              </div>

              <div className="p-4 border-t border-border bg-muted/20 flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => setIsBookOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="text-xs font-bold"
                  isLoading={isPending}
                >
                  Confirm Schedule
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
