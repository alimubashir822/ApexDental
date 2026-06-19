import React from "react";
import { prisma } from "@/lib/db";
import { PatientRegistry } from "@/components/dashboard/PatientRegistry";

export const dynamic = "force-dynamic";

export default async function PatientsPage() {
  // Query all patient entries along with their related appointments, payments, and logs
  const patients = await prisma.patient.findMany({
    include: {
      appointments: {
        orderBy: {
          dateTime: "desc",
        },
      },
      payments: {
        orderBy: {
          date: "desc",
        },
      },
      messages: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="w-full h-full flex flex-col">
      <PatientRegistry initialPatients={patients} />
    </div>
  );
}
