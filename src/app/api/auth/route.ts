
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { encrypt } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { email, password, name, type } = await request.json();

    if (type === "register") {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { email, password: hashedPassword, name },
      });
      const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      const session = await encrypt({ user: { id: user.id, email: user.email, name: user.name }, expires });
      cookies().set("session", session, { expires, httpOnly: true });
      return NextResponse.json({ message: "Registered" });
    }

    if (type === "login") {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }
      const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      const session = await encrypt({ user: { id: user.id, email: user.email, name: user.name }, expires });
      cookies().set("session", session, { expires, httpOnly: true });
      return NextResponse.json({ message: "Logged in" });
    }

    if (type === "logout") {
      cookies().set("session", "", { expires: new Date(0) });
      return NextResponse.json({ message: "Logged out" });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
