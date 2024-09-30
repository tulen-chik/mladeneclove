import { sql } from '@vercel/postgres';
import { v4 } from 'uuid';
import { extname } from 'path';
import { NextResponse } from 'next/server';

interface Product {
    id: number;
    Name: string;
    Description: string;
    Quantity: number;
    Cost: number;
    files: string[];
}

export async function POST(req: Request) {
    try {
        const { files, body } = await req.json();

        // Validate the files input
        if (!files || typeof files !== 'object' || Object.keys(files).length === 0) {
            return NextResponse.json({ error: 'Files are required' }, { status: 400 });
        }

        const uploadPaths: string[] = [];

        // Create a new product in the database
        const newProductResult = await sql<Product[]>`
      INSERT INTO Products (Name, Description, Quantity, Cost)
      VALUES (${body.Name}, ${body.Description}, ${body.Quantity}, ${body.Cost}) 
      RETURNING *;
    `;

        // Ensure the new product was created and safely handle types
        if (newProductResult.rows[0].length === 0) {
            return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
        }

        const newProduct: Product = newProductResult.rows[0][0];

        // Process each file
        await Promise.all(Object.keys(files).map(async (key) => {
            const file = files[key];
            const originalExtension = extname(file.name);
            const uploadPath = `/Files/${v4()}${originalExtension}`;
            await file.mv(uploadPath);
            uploadPaths.push(uploadPath);
        }));

        // Prepare file records for bulk insertion
        const fileRecords = uploadPaths.map(path => ({
            Link: path,
            ProductId: newProduct.id,
        }));

        // Insert all file records into the database
        await Promise.all(fileRecords.map(record =>
            sql`
        INSERT INTO Files (Link, ProductId)
        VALUES (${record.Link}, ${record.ProductId});
      `
        ));

        return NextResponse.json(newProduct, { status: 201 }); // Return the newly created product
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const perPage = 10;
        const offset = (page - 1) * perPage;

        // Fetch the total count of products
        const totalCountResult = await sql`SELECT COUNT(*) FROM Products;`;
        const totalProducts = parseInt(totalCountResult.rows[0].count, 10);
        const totalPages = Math.ceil(totalProducts / perPage);

        // Fetch products with pagination and related files
        const productsResult = await sql`
      SELECT p.*, f.Link
      FROM Products p
      LEFT JOIN Files f ON f.ProductId = p.id
      ORDER BY p.id
      LIMIT ${perPage} OFFSET ${offset};
    `;

        // Group products and their related file links
        const products: Product[] = productsResult.rows.reduce((acc: Product[], row: any) => {
            const { id, Name, Description, Quantity, Cost, Link } = row;
            const existingProduct = acc.find(product => product.id === id);

            if (existingProduct) {
                if (Link) {
                    existingProduct.files.push(Link);
                }
            } else {
                acc.push({
                    id,
                    Name,
                    Description,
                    Quantity,
                    Cost,
                    files: Link ? [Link] : [],
                });
            }

            return acc;
        }, []);

        return NextResponse.json({
            products,
            totalProducts,
            totalPages,
            currentPage: page,
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}