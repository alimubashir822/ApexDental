"use client";

import React, { useState, useTransition } from "react";
import { loginAction } from "@/lib/auth-actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Activity, Key, Sparkles, UserCheck } from "lucide-react";

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const demoAccounts = [
    { role: "Owner", email: "owner@apexdental.com", desc: "Dr. Sarah Mitchell" },
    { role: "Doctor", email: "doctor@apexdental.com", desc: "Dr. Alexander Patel" },
    { role: "Manager", email: "manager@apexdental.com", desc: "Elena Rostova" },
    { role: "Receptionist", email: "receptionist@apexdental.com", desc: "Mark Harrison" },
    { role: "Marketing Staff", email: "marketing@apexdental.com", desc: "Chloe Chen" },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await loginAction(formData);
      if (result && result.error) {
        setError(result.error);
      }
    });
  };

  const autofillDemo = (email: string) => {
    const emailInput = document.getElementById("email") as HTMLInputElement;
    const passwordInput = document.getElementById("password") as HTMLInputElement;
    if (emailInput && passwordInput) {
      emailInput.value = email;
      passwordInput.value = "admin123";
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 px-4 font-sans relative">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:20px_30px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)] pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        
        {/* Logo Header */}
        <div className="text-center flex flex-col items-center">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-3">
            <Activity className="h-6 w-6 text-primary animate-pulse" />
          </div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">ApexDental CRM Portal</h1>
          <p className="text-xs text-muted-foreground mt-1">Healthcare Practice Growth & Operations Platform</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl border-border bg-card/85 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-base font-bold text-foreground">Sign In to Workspace</CardTitle>
            <CardDescription>Enter credentials to access clinical schedules and leads.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-xs bg-destructive/10 text-destructive border border-destructive/20 rounded-lg">
                  {error}
                </div>
              )}

              <Input
                id="email"
                name="email"
                type="email"
                label="Email Address"
                placeholder="doctor@apexdental.com"
                required
              />

              <Input
                id="password"
                name="password"
                type="password"
                label="Password"
                placeholder="••••••••"
                required
              />

              <Button
                type="submit"
                className="w-full text-xs font-bold py-2.5"
                isLoading={isPending}
              >
                Enter Workspace
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Credentials Sandbox Assist */}
        <div className="p-4 rounded-xl border border-primary/15 bg-primary/5 space-y-3">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-primary">
            <Sparkles size={14} className="text-primary animate-pulse" />
            <span>Sandbox Seeding Guide</span>
          </div>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            Click on any credential set below to autofill inputs. The default password is <code className="bg-muted px-1 py-0.5 rounded font-mono font-bold text-foreground text-[10px]">admin123</code>.
          </p>
          <div className="grid grid-cols-1 gap-1.5">
            {demoAccounts.map((acct) => (
              <button
                key={acct.email}
                onClick={() => autofillDemo(acct.email)}
                className="w-full text-left text-[11px] px-2.5 py-1.5 rounded-lg border border-border bg-card hover:bg-muted/80 transition-colors flex items-center justify-between text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <span><strong>{acct.role}:</strong> {acct.desc}</span>
                <span className="font-mono text-[9px] text-primary underline">{acct.email}</span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
