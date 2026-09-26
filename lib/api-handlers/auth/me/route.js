// app/api/auth/me/route.js
import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/authGuard";

export async function GET() {
  const user = await getAuthenticatedUser();
  return NextResponse.json({ user });
}
