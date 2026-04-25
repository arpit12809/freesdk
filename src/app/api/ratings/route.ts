
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const movieId = searchParams.get("movieId");
  const session = await getServerSession(authOptions);

  if (movieId && session?.user) {
    const user = await prisma.user.findUnique({ where: { email: session.user.email! } });
    const rating = await prisma.rating.findUnique({
      where: { userId_movieId: { userId: user!.id, movieId } }
    });
    return NextResponse.json({ score: rating?.score || 0 });
  }

  // Fallback: return user's ratings for the dashboard
  if (session?.user) {
    const user = await prisma.user.findUnique({ where: { email: session.user.email! } });
    const ratings = await prisma.rating.findMany({ where: { userId: user!.id } });
    return NextResponse.json(ratings);
  }

  return NextResponse.json([]);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { movieId, score } = await request.json();
  const user = await prisma.user.findUnique({ where: { email: session.user.email! } });

  const rating = await prisma.rating.upsert({
    where: { userId_movieId: { userId: user!.id, movieId } },
    update: { score },
    create: { userId: user!.id, movieId, score },
  });

  return NextResponse.json(rating);
}
