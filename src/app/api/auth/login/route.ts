import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { comparePassword, setAuthCookie, signToken } from "@/lib/auth";
import { formatApiError, formatApiSuccess } from "@/lib/utils";
import { loginSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(formatApiError("Validation failed", parsed.error.flatten()), { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (!user) {
      return NextResponse.json(formatApiError("Invalid credentials"), { status: 401 });
    }

    const valid = await comparePassword(parsed.data.password, user.passwordHash);
    if (!valid) {
      return NextResponse.json(formatApiError("Invalid credentials"), { status: 401 });
    }

    const token = signToken({ userId: user.id, email: user.email });
    await setAuthCookie(token);

    return NextResponse.json(formatApiSuccess("Login successful"), { status: 200 });
  } catch {
    return NextResponse.json(formatApiError("Internal server error"), { status: 500 });
  }
}
