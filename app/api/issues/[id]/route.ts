import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { updateIssueSchema } from "@/app/validationSchema"; 

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // Next.js 15
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

    const data = parsed.data;

    if ("description" in data && data.description === "") {
      (data as any).description = null;
    }

    const updated = await prisma.issue.update({
      where: { id: issueId },
      data,
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