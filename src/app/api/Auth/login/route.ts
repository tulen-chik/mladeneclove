import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import TokenService from "@/services/tokenService";

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        const existingUserResult = await sql`
            SELECT * FROM Users WHERE Email = ${email};
        `;

        const user = existingUserResult.rows[0]

        if (existingUserResult.rows.length === 0) {
            return NextResponse.json({ error: 'Email wasn\'t found' }, { status: 400 });
        }

        if (bcrypt.compare(password, user.password)) {
            return NextResponse.json({ error: 'Password incorrect' }, { status: 400 });
        }

        const token = TokenService.generateToken({email: user.email, isActivated: user.isactivated, id: user.id});
        await TokenService.saveToken(user.id, token.refreshToken)

        return NextResponse.json({ success: 'Login successful', ...token }, { status: 201, headers: {"Set-cookie": `refreshToken=${token.refreshToken}; sameSite=strict; httpOnly=true; maxAge=60*60*24`}  });
        } catch (error: unknown) {
            if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
        }
    }
}
