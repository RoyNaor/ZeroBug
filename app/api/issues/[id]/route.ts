// app/api/issues/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { updateIssueSchema } from "@/app/validationSchema";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const issueId = Number(id);
    if (!Number.isFinite(issueId)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const body = await req.json();
    const parsed = updateIssueSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { assigneeId, ...rest } = parsed.data;

    // Normalize empty string description to null
    if ("description" in rest && rest.description === "") {
      (rest as any).description = null;
    }

    // Build update data
    const updateData: any = { ...rest };

    // Only change assignment if the client sent assigneeId (can be null to unassign)
    if ("assigneeId" in parsed.data) {
      if (assigneeId == null || assigneeId === "") {
        updateData.assignedTo = null; // unassign
      } else {
        // Validate the user exists
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
        updateData.assignedTo = assigneeId; // assign
      }
    }

    const updated = await prisma.issue.update({
      where: { id: issueId },
      data: updateData,
      include: {
        assignee: { select: { id: true, name: true, email: true, image: true } },
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (err: any) {
    if (err?.code === "P2025") {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }
    console.error("PATCH /api/issues/[id] error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    const { id } = await params;
    const issueId = Number(id);
    if (!Number.isFinite(issueId)) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    }

    await prisma.issue.delete({ where: { id: issueId } });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err: any) {
    if (err?.code === 'P2025') {
      return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
    }
    console.error('DELETE /api/issues/[id] error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}