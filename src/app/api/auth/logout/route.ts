import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth";
import { formatApiSuccess } from "@/lib/utils";

export async function POST() {
  await clearAuthCookie();
  return NextResponse.json(formatApiSuccess("Logged out successfully"));
}
