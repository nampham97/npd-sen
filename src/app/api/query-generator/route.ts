import { NextResponse } from 'next/server';
import callFromAIWithGPT4 from "@/app/helpers/callAIFromProvider";
import OpenAI from "openai";
import { promises as fs } from 'fs';
import path from 'path';

async function contentFile(){
    const filePaths = [
        path.join(process.cwd(), 'public', '1. ADM_CHECKLIST_ITEM.sql'),
        path.join(process.cwd(), 'public', '2.ADM_CHECKLIST_GROUP.sql'),
        path.join(process.cwd(), 'public', '3.ADM_CHECKLIST_MATRIX.sql'),
    ];

    try {
        // Đọc từng file và lưu nội dung vào mảng
        const fileContents = await Promise.all(
            filePaths.map(filePath => fs.readFile(filePath, 'utf-8'))
        );

        return fileContents;
    } catch (error) {
        return { error: `Error reading files: ${error}` };
    }
}

async function vidu(){
    const filePaths = [
        path.join(process.cwd(), 'public', '4. Mô tả CHECKLIST cho AI_TOOL'),
    ];

    try {
        // Đọc từng file và lưu nội dung vào mảng
        const fileContents = await Promise.all(
            filePaths.map(filePath => fs.readFile(filePath, 'utf-8'))
        );

        return fileContents;
    } catch (error) {
        return { error: `Error reading files: ${error}` };
    }
}

export async function POST(req: Request) {

    const { question } = await req.json();
    const contentF = await contentFile();
    const viduF = await vidu();
    console.log('contentF:', contentF)
    console.log('viduF:', viduF)
    try {
      const message : OpenAI.Chat.ChatCompletionCreateParams['messages'] = [
          { role: "system", content: "You are a helpful assistant." },
          {   role: "user", 
              content: `  
                         Dưới đây là cấu trúc bảng từ file SQL với mô tả chi tiết:
                        ${contentF}
                        
                        Câu hỏi của tôi: ${question}
                        
                        Yêu cầu:
                        - Viết store Procedure database oracle.
                        - Yêu cầu sử dụng kiểu dữ liệu chuẩn theo định nghĩa của Oracle.
                        - Ví dụ chi tiết về input bảng ${viduF}
                        
                        Dựa vào các yêu cầu và cấu trúc bảng, hãy đưa ra truy vấn SQL phù hợp.
                        Không cần mô tả rõ ràng để tối ưu hóa token.
                        Chỉ cần trả lời trọng tâm code một kết quả duy nhất.
                        Không cần diễn giải chỉ trả về kết quả sql Oracle database.
                        Không cần viết lại hàm kiểm tra dữ liệu.
                        Không cần code ví dụ cho hàm kết quả.
                        Không cần hướng dẫn cách  sử dụng hàm này.
                        Người dùng sẽ tự biết cách sử dụng hàm này nếu bạn viết đúng.
                      `
          },    
      ];
      console.log('message:', message)
      const result = await callFromAIWithGPT4(message);
      console.log('ket qua response:', result)

        return NextResponse.json({ result });
    } catch (error) {
        console.error('Error calling OpenAI:', error);
        return NextResponse.json({ error: 'Error generating response' }, { status: 500 });
    }
}
