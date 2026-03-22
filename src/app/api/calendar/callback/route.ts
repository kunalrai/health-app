import { NextResponse } from 'next/server';
import { getTokensFromCode, saveTokens } from '@/lib/calendar';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(
      new URL(`/admin?error=${encodeURIComponent(error)}`, request.url)
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL('/admin?error=no_code', request.url)
    );
  }

  try {
    const tokens = await getTokensFromCode(code);
    await saveTokens(tokens);
    return NextResponse.redirect(
      new URL('/admin?success=calendar_connected', request.url)
    );
  } catch (error: any) {
    return NextResponse.redirect(
      new URL(`/admin?error=${encodeURIComponent(error.message)}`, request.url)
    );
  }
}
