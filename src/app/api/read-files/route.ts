import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
    const dirPath = path.join(process.cwd(), 'public');

    try {
        const files = await fs.readdir(dirPath);
        return NextResponse.json({ files });
    } catch (error) {
        return NextResponse.json({ error: `Error reading files : ${error}` }, { status: 500 });
    }
}
