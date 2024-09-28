import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

export async function GET(request: Request) {
    try {
        // Drop all tables with cascade
        await sql`
            DROP TABLE IF EXISTS ProjectsFiles, Projects, OrdersFiles, Orders, Tokens, Users, Roles CASCADE;
        `;

        // Recreate Roles table
        await sql`
            CREATE TABLE IF NOT EXISTS Roles (
                Id SERIAL PRIMARY KEY,
                Name varchar(255) NOT NULL UNIQUE 
            );
        `;

        // Recreate Users table
        await sql`
            CREATE TABLE IF NOT EXISTS Users (
                Id SERIAL PRIMARY KEY,
                Email VARCHAR(255) NOT NULL UNIQUE, 
                Password VARCHAR(255) NOT NULL, 
                IsActivated BOOLEAN NOT NULL DEFAULT FALSE,
                ActivationLink VARCHAR(255),
                Role_id INT NOT NULL,
                FOREIGN KEY (Role_id) REFERENCES Roles(Id),
                CHECK (Email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}')
            );
        `;

        // Recreate Tokens table
        await sql`
            CREATE TABLE IF NOT EXISTS Tokens (
                Id SERIAL PRIMARY KEY,                            
                RefreshToken VARCHAR(255) NOT NULL,
                User_id INT NOT NULL, 
                FOREIGN KEY (User_id) REFERENCES Users(Id)
            );
        `;

        // Recreate Orders table
        await sql`
            CREATE TABLE IF NOT EXISTS Orders (
                Id SERIAL PRIMARY KEY,
                Description varchar(255) NOT NULL, 
                User_id INT NOT NULL,
                FOREIGN KEY (User_id) REFERENCES Users(Id)
            );
        `;

        // Recreate OrdersFiles table
        await sql`
            CREATE TABLE IF NOT EXISTS OrdersFiles (
                Id SERIAL PRIMARY KEY,
                Link varchar(255) NOT NULL,
                Order_id INT NOT NULL,
                FOREIGN KEY (Order_id) REFERENCES Orders(Id)
            );
        `;

        // Recreate Projects table
        await sql`
            CREATE TABLE IF NOT EXISTS Projects (
                Id SERIAL PRIMARY KEY,
                Name varchar(255) NOT NULL, 
                Description varchar(255) NOT NULL
            );
        `;

        // Recreate ProjectsFiles table
        await sql`
            CREATE TABLE IF NOT EXISTS ProjectsFiles (
                Id SERIAL PRIMARY KEY,
                Link varchar(255) NOT NULL,
                Project_id INT NOT NULL,
                FOREIGN KEY (Project_id) REFERENCES Projects(Id)
            );
        `;

        // Insert data into the Roles table
        await sql`
            INSERT INTO Roles (Name) VALUES ('Admin'), ('User');
        `;

        // Hash the password
        const password = await bcrypt.hash('coolAdmin', 10);

        // Generate the activation link
        const activationLink = uuidv4();

        // Insert data into the Users table, passing variables safely
        await sql`
            INSERT INTO Users (Email, Password, Role_id, ActivationLink, IsActivated) 
            VALUES ('AdminIsTheBest@gmail.com', ${password}, 1, ${activationLink}, TRUE);
        `;

        return NextResponse.json({
            message: "Tables created and data inserted successfully",
        }, { status: 200 });

    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
        }
    }
}
