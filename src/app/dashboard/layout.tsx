import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { logoutAction } from "@/lib/auth-actions";
import { RoleSwitcher } from "@/components/dashboard/RoleSwitcher";
import { FranchiseSelector } from "@/components/dashboard/FranchiseSelector";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Megaphone,
  Sparkles,
  BarChart3,
  LogOut,
  Activity,
  User,
  ShieldCheck,
  PhoneCall,
  Settings,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Redirect to login page if no active session cookie is present
  if (!session) {
    redirect("/login");
  }

  // Define sidebar navigation link mapping by role permissions
  const links = [
    {
      href: "/dashboard",
      label: "Overview",
      icon: LayoutDashboard,
      roles: ["OWNER", "DOCTOR", "MANAGER", "RECEPTIONIST", "MARKETING"],
    },
    {
      href: "/dashboard/leads",
      label: "Lead Pipeline",
      icon: Users,
      roles: ["OWNER", "MANAGER", "RECEPTIONIST", "MARKETING"],
    },
    {
      href: "/dashboard/patients",
      label: "Patients Registry",
      icon: ShieldCheck,
      roles: ["OWNER", "DOCTOR", "MANAGER", "RECEPTIONIST"],
    },
    {
      href: "/dashboard/calendar",
      label: "Appointment Calendar",
      icon: Calendar,
      roles: ["OWNER", "DOCTOR", "MANAGER", "RECEPTIONIST"],
    },
    {
      href: "/dashboard/campaigns",
      label: "Marketing Campaigns",
      icon: Megaphone,
      roles: ["OWNER", "MARKETING", "MANAGER"],
    },
    {
      href: "/dashboard/ai-assistant",
      label: "AI Growth Advisor",
      icon: Sparkles,
      roles: ["OWNER", "MARKETING", "MANAGER"],
    },
    {
      href: "/dashboard/analytics",
      label: "Analytics & ROI",
      icon: BarChart3,
      roles: ["OWNER", "MARKETING", "MANAGER"],
    },
    {
      href: "/dashboard/voice-agent",
      label: "AI Voice Agent",
      icon: PhoneCall,
      roles: ["OWNER", "MANAGER", "RECEPTIONIST"],
    },
    {
      href: "/dashboard/settings",
      label: "White-Label Settings",
      icon: Settings,
      roles: ["OWNER", "MANAGER"],
    },
  ];

  // Filter links based on logged-in user's role
  const allowedLinks = links.filter((link) => link.roles.includes(session.role));

  const roleColors: Record<string, string> = {
    OWNER: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    DOCTOR: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    MANAGER: "bg-teal-500/10 text-teal-600 border-teal-500/20",
    RECEPTIONIST: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    MARKETING: "bg-rose-500/10 text-rose-600 border-rose-500/20",
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      {/* Sidebar Area */}
      <aside className="w-64 border-r border-border bg-card flex flex-col h-full shrink-0">
        {/* Sidebar Header Logo */}
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link href="/" className="flex items-center space-x-2 text-primary font-bold">
            <Activity className="h-5 w-5 text-primary" />
            <span className="tracking-tight text-foreground font-extrabold text-sm">MedStack<span className="text-primary font-medium">CRM</span></span>
          </Link>
        </div>

        {/* Location Selector */}
        <FranchiseSelector />

        {/* Sidebar Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {allowedLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center space-x-3 px-3 py-2 text-xs font-semibold text-muted-foreground rounded-lg hover:bg-muted hover:text-foreground transition-all duration-150"
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Sandbox Switcher panel */}
        <div className="p-4 border-t border-border space-y-4">
          <RoleSwitcher currentRole={session.role} />
          
          <form action={logoutAction} className="w-full">
            <button
              type="submit"
              className="flex items-center justify-center space-x-2 w-full text-xs font-bold text-rose-600 hover:bg-rose-500/10 hover:text-rose-700 py-2 rounded-lg border border-transparent transition-all cursor-pointer"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-8 shrink-0">
          <div>
            <h2 className="text-sm font-bold text-foreground">Clinic Workspace</h2>
            <p className="text-[10px] text-muted-foreground">Apex Dental & Growth Platform</p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-muted/60 px-3 py-1.5 rounded-lg border border-border">
              <div className="h-5 w-5 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                <User size={12} />
              </div>
              <div className="text-left leading-none">
                <div className="text-[11px] font-bold text-foreground">{session.name}</div>
                <div className="text-[9px] text-muted-foreground mt-0.5">{session.email}</div>
              </div>
            </div>

            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${roleColors[session.role] || "bg-muted text-muted-foreground"}`}>
              {session.role}
            </span>
          </div>
        </header>

        {/* Dynamic Inner Page Scroll Area */}
        <main className="flex-1 overflow-y-auto bg-muted/10 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
