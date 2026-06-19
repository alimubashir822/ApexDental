import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database for CareFlow AI...");

  // Delete all existing data
  await prisma.task.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.review.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.followUp.deleteMany();
  await prisma.message.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.user.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.clinic.deleteMany();

  // 1. Create a Clinic
  const clinic = await prisma.clinic.create({
    data: {
      name: "Apex Dental & Growth Clinic",
      address: "100 Medical Plaza, Suite 400, Boston, MA 02111",
      phone: "(555) 234-5678",
      email: "info@apexdentalgrowth.com",
    },
  });

  // 2. Create Staff Users with different roles (password is admin123)
  const users = [
    {
      email: "owner@medstack.com",
      name: "Dr. Sarah Mitchell",
      role: "OWNER",
      password: "admin123",
      clinicId: clinic.id,
    },
    {
      email: "doctor@medstack.com",
      name: "Dr. Alexander Patel",
      role: "DOCTOR",
      password: "admin123",
      clinicId: clinic.id,
    },
    {
      email: "manager@medstack.com",
      name: "Elena Rostova",
      role: "MANAGER",
      password: "admin123",
      clinicId: clinic.id,
    },
    {
      email: "receptionist@medstack.com",
      name: "Mark Harrison",
      role: "RECEPTIONIST",
      password: "admin123",
      clinicId: clinic.id,
    },
    {
      email: "marketing@medstack.com",
      name: "Chloe Chen",
      role: "MARKETING",
      password: "admin123",
      clinicId: clinic.id,
    },
  ];

  for (const u of users) {
    await prisma.user.create({ data: u });
  }

  // 3. Create Sample Leads (supporting scoring and funnel value metrics)
  const leadData = [
    {
      name: "John Smith",
      email: "john.smith@gmail.com",
      phone: "(555) 101-2020",
      status: "NEW",
      source: "GOOGLE_ADS",
      interestedService: "Dental Implant",
      notes: "Looking to replace a missing lower molar. Wants implant cost details.",
      leadScore: 92,
      intentLevel: "HIGH",
      readiness: "Within 2 weeks",
      estimatedValue: 1500.0,
      clinicId: clinic.id,
    },
    {
      name: "Emily Johnson",
      email: "emily.j@yahoo.com",
      phone: "(555) 303-4040",
      status: "CONSULTATION_REQUESTED",
      source: "WEBSITE_CHAT",
      interestedService: "Invisalign",
      notes: "Enquired via website chatbot. Asked if clear aligners split payments.",
      leadScore: 84,
      intentLevel: "HIGH",
      readiness: "Researching",
      estimatedValue: 3500.0,
      clinicId: clinic.id,
    },
    {
      name: "Michael Brown",
      email: "mbrown@gmail.com",
      phone: "(555) 505-6060",
      status: "APPOINTMENT_BOOKED",
      source: "FACEBOOK",
      interestedService: "Teeth Whitening",
      notes: "Booked whitening checkup. Interested in summer bleaching promotions.",
      leadScore: 78,
      intentLevel: "MEDIUM",
      readiness: "Researching",
      estimatedValue: 350.0,
      clinicId: clinic.id,
    },
    {
      name: "Jessica Davis",
      email: "jdavis@outlook.com",
      phone: "(555) 707-8080",
      status: "VISITED",
      source: "REFERRAL",
      interestedService: "Root Canal",
      notes: "Referred by Dr. Carter. Had emergency crown pain checkup.",
      leadScore: 68,
      intentLevel: "MEDIUM",
      readiness: "Within 2 weeks",
      estimatedValue: 800.0,
      clinicId: clinic.id,
    },
    {
      name: "William Wilson",
      email: "wwilson@gmail.com",
      phone: "(555) 909-0000",
      status: "TREATMENT_ACCEPTED",
      source: "DIRECT_CALL",
      interestedService: "Dental Veneers",
      notes: "Inquired directly. Approved treatment plan for 6 veneers.",
      leadScore: 98,
      intentLevel: "HIGH",
      readiness: "Within 2 weeks",
      estimatedValue: 6000.0,
      clinicId: clinic.id,
    },
  ];

  const leads = [];
  for (const l of leadData) {
    const createdLead = await prisma.lead.create({ data: l });
    leads.push(createdLead);
  }

  // 4. Create Patients (supporting LTV, Risk reactivation check)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const eighteenMonthsAgo = new Date();
  eighteenMonthsAgo.setMonth(eighteenMonthsAgo.getMonth() - 19);

  const patientData = [
    {
      name: "William Wilson",
      email: "wwilson@gmail.com",
      phone: "(555) 909-0000",
      dateOfBirth: "1985-04-12",
      gender: "Male",
      address: "45 Pine St, Boston, MA 02116",
      futureOpportunityValue: 2000.0,
      lastVisitDate: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      satisfactionScore: 98,
      clinicId: clinic.id,
    },
    {
      name: "Sophia Martinez",
      email: "sophia.m@gmail.com",
      phone: "(555) 123-4567",
      dateOfBirth: "1992-08-24",
      gender: "Female",
      address: "128 Beacon St, Boston, MA 02108",
      futureOpportunityValue: 0.0,
      lastVisitDate: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      satisfactionScore: 95,
      clinicId: clinic.id,
    },
    {
      name: "James Taylor",
      email: "james.t@gmail.com",
      phone: "(555) 987-6543",
      dateOfBirth: "1978-11-03",
      gender: "Male",
      address: "89 Common Ave, Boston, MA 02115",
      futureOpportunityValue: 500.0,
      lastVisitDate: new Date(today.getTime()), // Today
      satisfactionScore: 92,
      clinicId: clinic.id,
    },
    {
      name: "Olivia Anderson",
      email: "olivia.a@yahoo.com",
      phone: "(555) 456-7890",
      dateOfBirth: "2000-01-15",
      gender: "Female",
      address: "12 High St, Brookline, MA 02446",
      futureOpportunityValue: 4500.0,
      lastVisitDate: eighteenMonthsAgo, // 19 months ago (TRIGGERS RETENTION RISK)
      satisfactionScore: 88,
      clinicId: clinic.id,
    },
  ];

  const patients = [];
  for (const p of patientData) {
    const createdPatient = await prisma.patient.create({ data: p });
    patients.push(createdPatient);
  }

  // 5. Create Campaigns
  const campaignData = [
    {
      name: "Summer Smile Whitening Blast",
      type: "EMAIL",
      subject: "Get 30% Off Professional Teeth Whitening!",
      content: "Hi {{name}},\n\nSummer is here, and it's time to let your smile shine! We are offering a 30% discount on professional, in-office teeth whitening for the next 14 days.\n\nClick here to book your slot: https://apexdentalgrowth.com/book\n\nBest,\nApex Dental Clinic Team",
      audienceSegment: "ALL",
      status: "SENT",
      leadsCount: 250,
      appointmentsCount: 75,
      conversionsCount: 30,
      revenue: 7000.0,
      clinicId: clinic.id,
    },
    {
      name: "Dental Implant Conversion outreach",
      type: "SMS",
      content: "Apex Growth: Missing teeth? Get a free implant consultation this month. Only 5 slots left! Book now: https://apexdentalgrowth.com/book",
      audienceSegment: "LEADS_ONLY",
      status: "SENT",
      leadsCount: 120,
      appointmentsCount: 22,
      conversionsCount: 15,
      revenue: 45000.0,
      clinicId: clinic.id,
    },
    {
      name: "Annual Checkup Recall Campaign",
      type: "EMAIL",
      subject: "It's time for your annual dental checkup!",
      content: "Dear {{name}},\n\nOur records show it has been over 12 months since your last dental checkup. Routine exams are crucial to catching issues early and keeping your teeth healthy.\n\nSchedule your annual cleaning here: https://apexdentalgrowth.com/book\n\nWarm regards,\nApex Dental Clinic",
      audienceSegment: "INACTIVE_PATIENTS",
      status: "DRAFT",
      leadsCount: 0,
      appointmentsCount: 0,
      conversionsCount: 0,
      revenue: 0.0,
      clinicId: clinic.id,
    },
  ];

  for (const c of campaignData) {
    await prisma.campaign.create({ data: c });
  }

  // 6. Create Appointments
  const appointments = [
    {
      dateTime: new Date(today.getTime() + 9 * 60 * 60 * 1000), // 09:00 AM Today
      duration: 30,
      status: "CONFIRMED",
      notes: "Routine checkup and cleaning",
      doctorName: "Dr. Alexander Patel",
      patientId: patients[1].id, // Sophia
      clinicId: clinic.id,
    },
    {
      dateTime: new Date(today.getTime() + 10.5 * 60 * 60 * 1000), // 10:30 AM Today
      duration: 60,
      status: "COMPLETED",
      notes: "Filling on upper left bicuspid",
      doctorName: "Dr. Alexander Patel",
      patientId: patients[2].id, // James
      clinicId: clinic.id,
    },
    {
      dateTime: new Date(today.getTime() + 12 * 60 * 60 * 1000), // 12:00 PM Today
      duration: 45,
      status: "PENDING",
      notes: "Invisalign consultation",
      doctorName: "Dr. Alexander Patel",
      patientId: patients[3].id, // Olivia
      clinicId: clinic.id,
    },
    {
      dateTime: new Date(today.getTime() + 14 * 60 * 60 * 1000), // 02:00 PM Today
      duration: 30,
      status: "CONFIRMED",
      notes: "Consultation booked by lead",
      doctorName: "Dr. Alexander Patel",
      leadId: leads[2].id, // Michael Brown (Lead status: APPOINTMENT_BOOKED)
      clinicId: clinic.id,
    },
    {
      dateTime: new Date(today.getTime() + 24 * 60 * 60 * 1000 + 11 * 60 * 60 * 1000), // 11:00 AM Tomorrow
      duration: 120,
      status: "CONFIRMED",
      notes: "Veneers preparation - 6 teeth",
      doctorName: "Dr. Alexander Patel",
      patientId: patients[0].id, // William
      clinicId: clinic.id,
    },
  ];

  for (const appt of appointments) {
    await prisma.appointment.create({ data: appt });
  }

  // 7. Create Payments
  const payments = [
    {
      amount: 150.0,
      status: "PAID",
      date: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      method: "CREDIT_CARD",
      notes: "Co-pay for routine cleanup",
      patientId: patients[1].id,
    },
    {
      amount: 320.0,
      status: "PAID",
      date: new Date(today.getTime()), // Today
      method: "INSURANCE",
      notes: "Cavity filling",
      patientId: patients[2].id,
    },
    {
      amount: 1500.0,
      status: "UNPAID",
      date: new Date(today.getTime() + 24 * 60 * 60 * 1000), // Tomorrow
      method: "BANK_TRANSFER",
      notes: "Deposit for veneer treatment",
      patientId: patients[0].id,
    },
  ];

  for (const pay of payments) {
    await prisma.payment.create({ data: pay });
  }

  // 8. Create Messages
  const messages = [
    {
      direction: "INBOUND",
      channel: "CHAT",
      content: "Hello, I am looking for dental implant pricing.",
      leadId: leads[1].id, // Emily
      clinicId: clinic.id,
      createdAt: new Date(today.getTime() - 2 * 60 * 60 * 1000),
    },
    {
      direction: "OUTBOUND",
      channel: "CHAT",
      content: "Hello! Our basic dental implants start at $1,500. We also offer monthly payment plans. Would you like to schedule a consultation with Dr. Patel?",
      leadId: leads[1].id, // Emily
      clinicId: clinic.id,
      createdAt: new Date(today.getTime() - 1.9 * 60 * 60 * 1000),
    },
    {
      direction: "INBOUND",
      channel: "CHAT",
      content: "Yes, that sounds good. Do you have slots this week?",
      leadId: leads[1].id, // Emily
      clinicId: clinic.id,
      createdAt: new Date(today.getTime() - 1.8 * 60 * 60 * 1000),
    },
    {
      direction: "OUTBOUND",
      channel: "SMS",
      content: "Hi Michael, your appointment for Teeth Whitening with Dr. Patel is scheduled for today at 2:00 PM. See you soon!",
      leadId: leads[2].id, // Michael
      clinicId: clinic.id,
      createdAt: new Date(today.getTime() - 4 * 60 * 60 * 1000),
    },
  ];

  for (const msg of messages) {
    await prisma.message.create({ data: msg });
  }

  // 9. Create Reviews
  const reviews = [
    {
      name: "Alice Parker",
      rating: 5,
      comment: "Dr. Mitchell and the team were fantastic! The clinic is clean, and the staff is super friendly. The implants are perfect.",
      status: "APPROVED",
      createdAt: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000),
    },
    {
      name: "David K.",
      rating: 5,
      comment: "Highly recommend the Invisalign treatment. Fast results and convenient payment options.",
      status: "APPROVED",
      createdAt: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      name: "Marcus Aurelius",
      rating: 4,
      comment: "Good dental clinic, doctor Patel was very thorough. Booking process online was very fast.",
      status: "APPROVED",
      createdAt: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      name: "Robert Downey",
      rating: 5,
      comment: "Awesome teeth whitening service, got shades lighter in just one session!",
      status: "PENDING",
      createdAt: new Date(),
    },
  ];

  for (const rev of reviews) {
    await prisma.review.create({ data: rev });
  }

  // 10. Create Automated Tasks
  const taskData = [
    {
      title: "Call high-intent lead: John Smith",
      description: "AI qualified lead for Dental Implant with 92% readiness score. Needs call to confirm consultation slot.",
      status: "PENDING",
      dueDate: new Date(today.getTime() + 12 * 60 * 60 * 1000), // Today in 12h
      clinicId: clinic.id,
    },
    {
      title: "Review Invisalign chatbot query: Emily Johnson",
      description: "Chatbot automatically generated consultation request. Validate insurance PPO status.",
      status: "PENDING",
      dueDate: new Date(today.getTime() + 24 * 60 * 60 * 1000), // Tomorrow
      clinicId: clinic.id,
    },
    {
      title: "Inactive patient reactivation: Olivia Anderson",
      description: "Patient hasn't visited in 19 months. Trigger hygiene cleaning reactivation campaign sequence.",
      status: "PENDING",
      dueDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000), // In 2 days
      clinicId: clinic.id,
    },
  ];

  for (const t of taskData) {
    await prisma.task.create({ data: t });
  }

  console.log("Database seeded successfully with CareFlow AI data!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
