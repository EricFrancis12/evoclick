import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export function GET(req: NextRequest): NextResponse {
    cookies().delete('jwt');
    const { origin } = req.nextUrl;
    return NextResponse.redirect(origin);
}
