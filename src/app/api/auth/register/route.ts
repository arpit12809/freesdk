
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ error: "Email already exists" }, { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 10);
    
    await prisma.user.create({
      data: { 
        email, 
        password: hashedPassword, 
        name, 
        isVerified: true 
      },
    });

    return NextResponse.json({ message: "Registered successfully! You can now login." });
  } catch (error: any) {
    console.error("Auth Error:", error);
    return NextResponse.json({ error: "Failed to process registration" }, { status: 500 });
  }
}
