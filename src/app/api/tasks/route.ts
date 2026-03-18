import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { decrypt, encrypt } from "@/lib/crypto";
import { getAuthFromRequest } from "@/lib/auth";
import { formatApiError, formatApiSuccess } from "@/lib/utils";
import { taskSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  try {
    const auth = getAuthFromRequest(request);
    if (!auth) {
      return NextResponse.json(formatApiError("Unauthorized"), { status: 401 });
    }

    const body = await request.json();
    const parsed = taskSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(formatApiError("Validation failed", parsed.error.flatten()), { status: 400 });
    }

    const task = await prisma.task.create({
      data: {
        title: parsed.data.title,
        encryptedDescription: encrypt(parsed.data.description),
        status: parsed.data.status,
        userId: auth.userId,
      },
    });

    return NextResponse.json(formatApiSuccess("Task created successfully", {
      id: task.id,
      title: task.title,
      description: parsed.data.description,
      status: task.status,
      createdAt: task.createdAt,
    }), { status: 201 });
  } catch {
    return NextResponse.json(formatApiError("Internal server error"), { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const auth = getAuthFromRequest(request);
    if (!auth) {
      return NextResponse.json(formatApiError("Unauthorized"), { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page") || 1);
    const limit = Math.min(Number(searchParams.get("limit") || 10), 20);
    const status = searchParams.get("status");
    const search = searchParams.get("search") || "";

    const where = {
      userId: auth.userId,
      ...(status && status !== "ALL" ? { status: status as "OPEN" | "IN_PROGRESS" | "COMPLETED" } : {}),
      ...(search ? { title: { contains: search, mode: "insensitive" as const } } : {}),
    };

    const [tasks, totalItems] = await Promise.all([
      prisma.task.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.task.count({ where }),
    ]);

    const totalPages = Math.max(1, Math.ceil(totalItems / limit));

    return NextResponse.json(
      formatApiSuccess("Tasks fetched successfully", {
        tasks: tasks.map((task) => ({
          id: task.id,
          title: task.title,
          description: decrypt(task.encryptedDescription),
          status: task.status,
          createdAt: task.createdAt,
        })),
        pagination: {
          page,
          limit,
          totalItems,
          totalPages,
        },
      })
    );
  } catch {
    return NextResponse.json(formatApiError("Internal server error"), { status: 500 });
  }
}
