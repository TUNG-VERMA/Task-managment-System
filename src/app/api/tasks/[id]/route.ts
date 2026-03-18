import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthFromRequest } from "@/lib/auth";
import { decrypt, encrypt } from "@/lib/crypto";
import { formatApiError, formatApiSuccess } from "@/lib/utils";
import { taskSchema } from "@/lib/validators";

type Context = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, context: Context) {
  try {
    const auth = getAuthFromRequest(request);
    if (!auth) return NextResponse.json(formatApiError("Unauthorized"), { status: 401 });

    const { id } = await context.params;
    const task = await prisma.task.findFirst({ where: { id, userId: auth.userId } });
    if (!task) return NextResponse.json(formatApiError("Task not found"), { status: 404 });

    return NextResponse.json(formatApiSuccess("Task fetched successfully", {
      id: task.id,
      title: task.title,
      description: decrypt(task.encryptedDescription),
      status: task.status,
      createdAt: task.createdAt,
    }));
  } catch {
    return NextResponse.json(formatApiError("Internal server error"), { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: Context) {
  try {
    const auth = getAuthFromRequest(request);
    if (!auth) return NextResponse.json(formatApiError("Unauthorized"), { status: 401 });

    const { id } = await context.params;
    const body = await request.json();
    const parsed = taskSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(formatApiError("Validation failed", parsed.error.flatten()), { status: 400 });
    }

    const task = await prisma.task.findFirst({ where: { id, userId: auth.userId } });
    if (!task) return NextResponse.json(formatApiError("Task not found"), { status: 404 });

    const updated = await prisma.task.update({
      where: { id },
      data: {
        title: parsed.data.title,
        encryptedDescription: encrypt(parsed.data.description),
        status: parsed.data.status,
      },
    });

    return NextResponse.json(formatApiSuccess("Task updated successfully", {
      id: updated.id,
      title: updated.title,
      description: decrypt(updated.encryptedDescription),
      status: updated.status,
      createdAt: updated.createdAt,
    }));
  } catch {
    return NextResponse.json(formatApiError("Internal server error"), { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: Context) {
  try {
    const auth = getAuthFromRequest(request);
    if (!auth) return NextResponse.json(formatApiError("Unauthorized"), { status: 401 });

    const { id } = await context.params;
    const task = await prisma.task.findFirst({ where: { id, userId: auth.userId } });
    if (!task) return NextResponse.json(formatApiError("Task not found"), { status: 404 });

    await prisma.task.delete({ where: { id } });
    return NextResponse.json(formatApiSuccess("Task deleted successfully"));
  } catch {
    return NextResponse.json(formatApiError("Internal server error"), { status: 500 });
  }
}
