import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma, UserRole } from "@shaan-e-taj/database";

export async function POST(req: Request) {
  const { name, email, phone, password } = await req.json();
  if (!password || (!email && !phone)) {
    return NextResponse.json({ error: "Email/phone and password required" }, { status: 400 });
  }

  const existing = await prisma.user.findFirst({
    where: email ? { email } : { phone },
  });
  if (existing) {
    return NextResponse.json({ error: "Account already exists" }, { status: 409 });
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const isAdmin =
    adminEmail && email?.toLowerCase() === adminEmail.toLowerCase();

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      name,
      email: email || null,
      phone: phone || null,
      passwordHash,
      role: isAdmin ? UserRole.ADMIN : UserRole.CUSTOMER,
    },
  });

  return NextResponse.json({ ok: true, userId: user.id });
}
