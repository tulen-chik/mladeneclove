import {Payload} from "@/types";
import jwt from "jsonwebtoken";
import {sql} from "@vercel/postgres";

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_SECRET || 'your-refresh-secret-key';
const TOKEN_EXPIRATION = '1h';
const TOKEN_REFRESH_EXPIRATION = '30d';

export default class TokenService {
    static generateToken(payload: Payload): { accessToken: string, refreshToken: string } {
        const accessToken = jwt.sign(payload, JWT_SECRET, {expiresIn: TOKEN_EXPIRATION});
        const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {expiresIn: TOKEN_REFRESH_EXPIRATION});
        return {
            accessToken,
            refreshToken,
        }
    }

    static async saveToken(userID: number, refreshToken: string) {
        const tokenData = await sql`SELECT * FROM Tokens WHERE User_id = ${userID}`;
        console.log(userID)
        if (tokenData.rows.length > 0) {
            await sql`UPDATE Tokens SET RefreshToken = ${refreshToken} WHERE User_id = ${userID}`;
            return { userId: userID, refreshToken };
        } else {
            await sql`INSERT INTO Tokens (User_id, RefreshToken) VALUES (${userID}, ${refreshToken})`;
            return { userId: userID, refreshToken };
        }
    }

}