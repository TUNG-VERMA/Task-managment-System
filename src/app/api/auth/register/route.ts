import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { formatApiError, formatApiSuccess } from "@/lib/utils";
import { hashPassword, setAuthCookie, signToken } from "@/lib/auth";
import { registerSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(formatApiError("Validation failed", parsed.error.flatten()), { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (existingUser) {
      return NextResponse.json(formatApiError("Email already registered"), { status: 409 });
    }

    const passwordHash = await hashPassword(parsed.data.password);
    const user = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        passwordHash,
      },
    });

    const token = signToken({ userId: user.id, email: user.email });
    await setAuthCookie(token);

    return NextResponse.json(formatApiSuccess("Registration successful", { id: user.id, email: user.email }), { status: 201 });
  } catch {
    return NextResponse.json(formatApiError("Internal server error"), { status: 500 });
  }
}
