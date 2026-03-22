import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../../convex/_generated/api';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_URL;
  if (!convexUrl) throw new Error('NEXT_PUBLIC_CONVEX_URL is not set');
  const convex = new ConvexHttpClient(convexUrl);
  const { sessionId } = await req.json();
  if (!sessionId) return NextResponse.json({ error: 'sessionId required' }, { status: 400 });

  // Return existing or create new
  const existing = await convex.query(api.conversations.getBySession, { sessionId });
  if (existing) return NextResponse.json({ conversationId: existing._id });

  const id = await convex.mutation(api.conversations.create, { sessionId });
  return NextResponse.json({ conversationId: id });
}
