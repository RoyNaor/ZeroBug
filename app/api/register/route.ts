import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import bcrypt from "bcryptjs";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing)
    return NextResponse.json({ error: "Email already in use" }, { status: 400 });

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: { name, email, passwordHash },
  });

  return NextResponse.json({ ok: true });
}
