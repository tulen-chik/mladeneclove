import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import {v4} from 'uuid';
import MailService from "@/services/mailService";
import TokenService from "@/services/tokenService";

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();
        const role: string = "User";

        const existingUserResult = await sql`
            SELECT * FROM Users WHERE Email = ${email};
        `;

        if (existingUserResult.rows.length > 0) {
            return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const activationLink = v4();
        const result = await sql`
            INSERT INTO Users (Email, Password, Role_id, ActivationLink)
            VALUES (${email}, ${hashedPassword}, (SELECT Id FROM Roles WHERE Name = ${role}), ${activationLink})
            RETURNING Id, Email, Role_id, IsActivated;
        `;
        await MailService.sendActivationMail(email, `${process.env.API_URL}/api/Auth/activate/${activationLink}`);
        const newUser = result.rows[0];
        const token = TokenService.generateToken({email: newUser.email, isActivated: newUser.isactivated, id: newUser.id});
        await TokenService.saveToken(newUser.id, token.refreshToken)
        return NextResponse.json({ success: 'User registered successfully', ...token }, { status: 201, headers: {"Set-cookie": `refreshToken=${token.refreshToken}; sameSite=strict; httpOnly=true; maxAge=60*60*24`} });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
        }
    }
}
