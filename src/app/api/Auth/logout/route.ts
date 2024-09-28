import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const cookies = request.headers.get('cookie');
        const refreshCookie = cookies
            ?.split('; ')
            .find(cookie => cookie.startsWith('refreshCookie='))
            ?.split('=')[1];

        if (!refreshCookie) {
            return NextResponse.json({ error: 'No refresh token found' }, { status: 400 });
        }

        await sql`DELETE FROM Tokens WHERE refreshToken = ${refreshCookie}`;

        const response = NextResponse.json({ success: 'Logout was successful' }, { status: 200 });
        response.cookies.delete('refreshCookie');

        return response;
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
        }
    }
}
