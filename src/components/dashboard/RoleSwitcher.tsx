"use client";

import React, { useState, useTransition } from "react";
import { switchRoleAction } from "@/lib/auth-actions";
import { Shield, Sparkles } from "lucide-react";

export function RoleSwitcher({ currentRole }: { currentRole: string }) {
  const [isPending, startTransition] = useTransition();
  const [selectedRole, setSelectedRole] = useState(currentRole);

  const roles = [
    { name: "OWNER", label: "Owner (Dr. Mitchell)", color: "border-purple-500/50 text-purple-600 bg-purple-50 dark:bg-purple-950/20 dark:text-purple-400" },
    { name: "DOCTOR", label: "Doctor (Dr. Patel)", color: "border-blue-500/50 text-blue-600 bg-blue-50 dark:bg-blue-950/20 dark:text-blue-400" },
    { name: "MANAGER", label: "Manager (Elena Rostova)", color: "border-teal-500/50 text-teal-600 bg-teal-50 dark:bg-teal-950/20 dark:text-teal-400" },
    { name: "RECEPTIONIST", label: "Receptionist (Mark Harrison)", color: "border-amber-500/50 text-amber-600 bg-amber-50 dark:bg-amber-950/20 dark:text-amber-400" },
    { name: "MARKETING", label: "Marketing (Chloe Chen)", color: "border-rose-500/50 text-rose-600 bg-rose-50 dark:bg-rose-950/20 dark:text-rose-400" },
  ];

  const handleSwitch = (role: string) => {
    setSelectedRole(role);
    startTransition(async () => {
      await switchRoleAction(role);
    });
  };

  return (
    <div className="p-3 border border-primary/20 rounded-xl bg-primary/5 backdrop-blur-md">
      <div className="flex items-center space-x-2 text-xs font-semibold text-primary mb-1">
        <Shield size={14} className="text-primary" />
        <span>Platform Role Sandbox</span>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/70 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
        </span>
      </div>
      <p className="text-[10px] text-muted-foreground mb-2">
        Instant authentication switch to inspect dynamic views.
      </p>
      <div className="flex flex-col space-y-1">
        {roles.map((r) => (
          <button
            key={r.name}
            disabled={isPending}
            onClick={() => handleSwitch(r.name)}
            className={`w-full text-left text-[11px] px-2.5 py-1.5 rounded-lg border transition-all duration-200 cursor-pointer flex items-center justify-between ${
              selectedRole === r.name
                ? `${r.color} font-bold ring-2 ring-primary/20`
                : "border-border bg-card text-foreground hover:bg-muted"
            }`}
          >
            <span>{r.label}</span>
            {selectedRole === r.name && <Sparkles size={10} className="text-primary animate-pulse" />}
          </button>
        ))}
      </div>
      {isPending && (
        <div className="mt-1 text-center text-[9px] text-muted-foreground animate-pulse">
          Simulating secure session reload...
        </div>
      )}
    </div>
  );
}
