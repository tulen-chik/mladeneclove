import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

async function dropTables() {
    await sql`DROP TABLE IF EXISTS ProjectsFiles, Projects, OrdersFiles, Orders, Tokens, Users, Roles CASCADE;`;
}

async function createTables() {
    await sql`
    CREATE TABLE IF NOT EXISTS Roles (Id SERIAL PRIMARY KEY, Name varchar(255) NOT NULL UNIQUE);
    CREATE TABLE IF NOT EXISTS Users (Id SERIAL PRIMARY KEY, Email VARCHAR(255) NOT NULL UNIQUE, Password VARCHAR(255) NOT NULL, IsActivated BOOLEAN NOT NULL DEFAULT FALSE, ActivationLink VARCHAR(255), Role_id INT NOT NULL, FOREIGN KEY (Role_id) REFERENCES Roles(Id), CHECK (Email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}'));
    CREATE TABLE IF NOT EXISTS Tokens (Id SERIAL PRIMARY KEY, RefreshToken VARCHAR(255) NOT NULL, User_id INT NOT NULL, FOREIGN KEY (User_id) REFERENCES Users(Id));
    CREATE TABLE IF NOT EXISTS Orders (Id SERIAL PRIMARY KEY, Description varchar(255) NOT NULL, User_id INT NOT NULL, FOREIGN KEY (User_id) REFERENCES Users(Id));
    CREATE TABLE IF NOT EXISTS OrdersFiles (Id SERIAL PRIMARY KEY, Link varchar(255) NOT NULL, Order_id INT NOT NULL, FOREIGN KEY (Order_id) REFERENCES Orders(Id));
    CREATE TABLE IF NOT EXISTS Products (Id SERIAL PRIMARY KEY, Name varchar(255) NOT NULL, Description varchar(255) NOT NULL, Cost DOUBLE NOT NULL, Quantity INT NOT NULL);
    CREATE TABLE IF NOT EXISTS ProductsFiles (Id SERIAL PRIMARY KEY, Link varchar(255) NOT NULL, Project_id INT NOT NULL, FOREIGN KEY (Project_id) REFERENCES Projects(Id));
  `;
}

async function insertInitialData() {
    // Insert Roles
    await sql`INSERT INTO Roles (Name) VALUES ('Admin'), ('User')`;

    // Hash password and generate activation link
    const password = await bcrypt.hash('coolAdmin', 10);
    const activationLink = uuidv4();

    // Insert User
    await sql`
    INSERT INTO Users (Email, Password, Role_id, ActivationLink, IsActivated) 
    VALUES ('AdminIsTheBest@gmail.com', ${password}, 1, ${activationLink}, TRUE);
  `;
}

// export async function GET(request: Request) {
//     try {
//         await dropTables();
//         await createTables();
//         await insertInitialData();
//
//         return NextResponse.json({ message: "Tables created and data inserted successfully" }, { status: 200 });
//     } catch (error: unknown) {
//         return NextResponse.json({ error: error instanceof Error ? error.message : 'An unknown error occurred' }, { status: 500 });
//     }
// }
