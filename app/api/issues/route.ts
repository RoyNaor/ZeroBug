// app/api/issues/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { createIssueSchema } from "@/app/validationSchema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = createIssueSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { assigneeId, ...rest } = parsed.data;

    // Validate assignee if provided
    let assignedTo: string | null | undefined = undefined;
    if (typeof assigneeId !== "undefined") {
      if (assigneeId == null || assigneeId === "") {
        assignedTo = null;
      } else {
        const exists = await prisma.user.findUnique({
          where: { id: assigneeId },
          select: { id: true },
        });
        if (!exists) {
          return NextResponse.json(
            { error: "Assignee not found" },
            { status: 400 }
          );
        }
        assignedTo = assigneeId;
      }
    }

    const created = await prisma.issue.create({
      data: { ...rest, ...(typeof assignedTo !== "undefined" ? { assignedTo } : {}) },
      include: {
        assignee: { select: { id: true, name: true, email: true, image: true } },
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("POST /api/issues error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
