
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const movies = await prisma.movie.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(movies);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Incoming request body:", body);
    const slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    const movie = await prisma.movie.create({
      data: { ...body, slug }
    });
    return NextResponse.json(movie);
  } catch (error) {
    console.error("Prisma error:", error);
    return NextResponse.json({ error: 'Failed to create entry', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
