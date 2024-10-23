import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
    // Đường dẫn tới các file SQL
    const filePaths = [
        path.join(process.cwd(), 'public', '1. ADM_CHECKLIST_ITEM.sql'),
        path.join(process.cwd(), 'public', '2.ADM_CHECKLIST_GROUP.sql'),
        path.join(process.cwd(), 'public', '3.ADM_CHECKLIST_MATRIX.sql'),
        // path.join(process.cwd(), 'public', '4. Mô tả CHECKLIST cho AI_TOOL'),
    ];

    try {
        // Đọc từng file và lưu nội dung vào mảng
        const fileContents = await Promise.all(
            filePaths.map(filePath => fs.readFile(filePath, 'utf-8'))
        );

        return NextResponse.json({ fileContents });
    } catch (error) {
        return NextResponse.json({ error: `Error reading files: ${error}` }, { status: 500 });
    }
}
