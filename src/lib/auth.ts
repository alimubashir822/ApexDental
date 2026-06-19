import { cookies } from "next/headers";

export interface Session {
  userId: string;
  email: string;
  name: string;
  role: string; // OWNER, DOCTOR, MANAGER, RECEPTIONIST, MARKETING
  clinicId: string;
}

export async function getSession(): Promise<Session | null> {
  try {
    const cookieStore = await cookies();
    const sessionVal = cookieStore.get("medstack_session")?.value;
    if (!sessionVal) return null;
    return JSON.parse(decodeURIComponent(sessionVal)) as Session;
  } catch (err: any) {
    if (err && err.message && err.message.includes("Dynamic server usage")) {
      // Next.js dynamic server usage error is expected during build prerendering
    } else {
      console.error("Failed to parse session cookie:", err);
    }
    return null;
  }
}

export async function setSession(session: Session) {
  const cookieStore = await cookies();
  cookieStore.set("medstack_session", encodeURIComponent(JSON.stringify(session)), {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete("medstack_session");
}
