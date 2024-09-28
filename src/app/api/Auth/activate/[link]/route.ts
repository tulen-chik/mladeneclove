import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import TokenService from "@/services/tokenService";

export async function GET(request: Request, response: Response) {
    try {
        // Extract the activation link from the URL
        const url = new URL(request.url);
        const activationLink = url.pathname.split('/').pop(); // Assumes link is at the end of the URL path

        const user = await sql`SELECT * FROM Users WHERE ActivationLink = ${activationLink}`;

        if (user.rows.length === 0) {
            return NextResponse.json({ error: 'Wrong link' }, { status: 404 });
        }

        // Update the user's activation status
        await sql`UPDATE Users SET IsActivated = TRUE WHERE ActivationLink = ${activationLink}`;

        const newUser = await sql`SELECT * FROM Users WHERE ActivationLink = ${activationLink}`;
        const newUserData = newUser.rows[0];

        const token = TokenService.generateToken({email: newUserData.email, isActivated: newUserData.isactivated, id: newUserData.id});
        await TokenService.saveToken(newUserData.id, token.refreshToken)

        return NextResponse.redirect(String(process.env.API_URL), {headers: {"Set-cookie": `refreshToken=${token.refreshToken}; sameSite=strict; httpOnly=true; maxAge=60*60*24`}});
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
        }
    }
}
