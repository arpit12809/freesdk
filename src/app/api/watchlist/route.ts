
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email! } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const watchlist = await prisma.watchlist.findMany({
    where: { userId: user.id },
    include: { movie: true },
  });
  return NextResponse.json(watchlist.map(w => w.movie));
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email! } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { movieId } = await request.json();
  try {
    const item = await prisma.watchlist.create({
      data: { userId: user.id, movieId },
    });
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: "Already in watchlist" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email! } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { movieId } = await request.json();
  await prisma.watchlist.delete({
    where: { 
      userId_movieId: { userId: user.id, movieId }
    },
  });
  return NextResponse.json({ message: "Removed" });
}
