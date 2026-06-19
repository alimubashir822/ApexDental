"use server";

import { redirect } from "next/navigation";
import { prisma } from "./db";
import { setSession, clearSession } from "./auth";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Please enter both email and password." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.password !== password) {
      return { error: "Invalid email or password." };
    }

    await setSession({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      clinicId: user.clinicId,
    });
  } catch (err) {
    console.error("Login action error:", err);
    return { error: "An unexpected error occurred." };
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  await clearSession();
  redirect("/");
}

export async function switchRoleAction(role: string) {
  try {
    const user = await prisma.user.findFirst({
      where: { role },
    });

    if (!user) {
      return { error: `No seeded user found with role ${role}` };
    }

    await setSession({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      clinicId: user.clinicId,
    });
  } catch (err) {
    console.error("Switch role action error:", err);
    return { error: "Failed to switch role." };
  }

  redirect("/dashboard");
}
