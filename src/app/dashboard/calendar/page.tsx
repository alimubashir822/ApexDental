import React from "react";
import { prisma } from "@/lib/db";
import { CalendarView } from "@/components/dashboard/CalendarView";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  // Query all appointments with related Patient and Lead tables
  const appointments = await prisma.appointment.findMany({
    include: {
      patient: true,
      lead: true,
    },
    orderBy: {
      dateTime: "asc",
    },
  });

  return (
    <div className="w-full h-full flex flex-col">
      <CalendarView initialAppointments={appointments} />
    </div>
  );
}
