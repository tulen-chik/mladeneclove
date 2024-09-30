import {sql} from "@vercel/postgres";
import {NextRequest, NextResponse} from "next/server";
import {extname} from "path";
import {v4} from "uuid";
import {unlinkSync} from "fs";

interface File {
    Id: number,
    Link: string;
}

interface Product {
    id: number;
    Name: string;
    Description: string;
    Quantity: number;
    Cost: number;
    files: File[];
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const productId = parseInt(params.id, 10);

        // Fetch the product along with its associated files
        const productResult = await sql`
      SELECT p.*, f.Link 
      FROM Products p
      LEFT JOIN productsFiles f ON f.product_id = p.id
      WHERE p.id = ${productId};
    `;

        if (productResult.rowCount === 0) {
            // Product not found
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        // Initialize the product data
        const initialProduct: Product = {
            id: 0,
            Name: '',
            Description: '',
            Quantity: 0,
            Cost: 0,
            files: [],
        };

        // Structure the product data
        const productData = productResult.rows.reduce((acc: Product, row: any) => {
            const { Link, ...productInfo } = row;

            // Assign product properties
            Object.assign(acc, productInfo);

            // Push file links if available
            if (Link) {
                acc.files.push({ Id: row.FileId, Link }); // Ensure FileId is captured, if available
            }

            return acc;
        }, initialProduct);

        // Return the structured product data
        return NextResponse.json(productData);

    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}


export async function PUT(req: NextRequest) {
    try {
        const id = req.nextUrl.searchParams.get("id"); // Extracting product ID from params
        const body = await req.json(); // Assuming body is received as JSON

        // Find the existing product
        const existingProductResult = await sql`
      SELECT * FROM Products WHERE id = ${id};
    `;

        const product = existingProductResult.rows[0];
        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        // Prepare updated data
        const updatedData = {
            Name: body.Name,
            Description: body.Description,
            Quantity: body.Quantity,
            Cost: body.Cost,
        };

        // Update the product in the database
        await sql`
      UPDATE Products 
      SET Name = ${updatedData.Name}, 
          Description = ${updatedData.Description}, 
          Quantity = ${updatedData.Quantity}, 
          Cost = ${updatedData.Cost} 
      WHERE id = ${id};
    `;

        const uploadPaths: string[] = [];

        // Check if files are present and process them
        if (body.files && typeof body.files === 'object' && Object.keys(body.files).length > 0) {
            const files = body.files;

            await Promise.all(
                Object.keys(files).map(async (key) => {
                    const file = files[key];
                    const originalExtension = extname(file.name);
                    const uploadPath = `/Files/${v4()}${originalExtension}`;
                    await file.mv(uploadPath); // Move the file
                    uploadPaths.push(uploadPath);
                })
            );

            // Prepare file records for bulk insertion
            const fileRecords = uploadPaths.map(path => ({
                Link: path,
                ProductId: id, // Product ID for the newly uploaded files
            }));

            // Bulk insert file records
            await Promise.all(fileRecords.map(record =>
                sql`
          INSERT INTO Files (Link, ProductId) 
          VALUES (${record.Link}, ${record.ProductId});
        `
            ));
        }

        // Return the updated product
        return NextResponse.json({ ...product, ...updatedData }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const productId = parseInt(params.id, 10);

        // Fetch the product by ID
        const productQuery = await sql`
      SELECT * FROM Products WHERE id = ${productId};
    `;

        if (productQuery.rowCount === 0) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        // Fetch associated files
        const filesQuery = await sql`
      SELECT Link FROM productsFiles WHERE Product_Id = ${productId};
    `;

        // Process and unlink the files
        for (const file of filesQuery.rows) {
            if (file.Link) {
                unlinkSync(file.Link);
            }
        }

        // Delete associated files from the database
        await sql`
      DELETE FROM productsFiles WHERE Product_Id = ${productId};
    `;

        // Delete the product
        await sql`
      DELETE FROM Products WHERE id = ${productId};
    `;

        return NextResponse.json({ message: 'Product deleted' });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}