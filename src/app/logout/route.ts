import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ECookieName } from '@/lib/types';

export function GET(req: NextRequest): NextResponse {
    cookies().delete(ECookieName.JWT);
    const { origin } = req.nextUrl;
    return NextResponse.redirect(origin);
}
