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

const getContentAI = (question : string, contentF : string[] | object, viduF : string | object) => {
    return `  
        Dưới đây là cấu trúc bảng từ file SQL với mô tả chi tiết:
        ${contentF}
        
        Câu hỏi của tôi: ${question}
        
        Yêu cầu:
        - Nếu tôi hỏi về việc viết câu query hoặc không phải là một Store procedure, hãy trả về câu query SQL để lấy dữ liệu từ bảng trên.
        - Nếu tôi hỏi về việc viết một Store procedure, hãy trả về mã code của store procedure.
        - Ví dụ đối với câu hỏi về việc vấn tin một bảng dữ liệu, hãy trả về câu truy vấn SQL để lấy dữ liệu từ bảng trên.
        - Ví dụ đối với câu hỏi về việc viết một store procedure như insert, update, delete, hãy trả về mã code của store procedure.


        - Viết truy vấn SQL để lấy dữ liệu từ bảng trên hoặc store Procedure database oracle.
        - Yêu cầu sử dụng kiểu dữ liệu chuẩn theo định nghĩa của Oracle.
        - Yêu cầu sử dụng cú pháp SQL chuẩn của Oracle.

        - Ví dụ chi tiết về cách viết store procedure hoặc truy vấn SQL:
        ${viduF}
        
        Dựa vào các yêu cầu và cấu trúc bảng, hãy đưa ra truy vấn SQL phù hợp.

        Không cần mô tả rõ ràng để tối ưu hóa token.
        Chỉ cần trả lời trọng tâm code một kết quả duy nhất.
        Không cần diễn giải chỉ trả về kết quả sql Oracle database.
        Không cần viết lại hàm kiểm tra dữ liệu.
        Không cần code ví dụ cho hàm kết quả.
        Không cần hướng dẫn cách  sử dụng hàm này.
        Người dùng sẽ tự biết cách sử dụng hàm này nếu bạn viết đúng.
        ---
        Chỉ trả lời câu hỏi về việc viết truy vấn SQL Oracle database.
        Không trả lời câu hỏi khác và chỉ trả lời là không có quyền truy cập thông tin.
        ***
        Yêu cầu phải viết truy vấn SQL Oracle database và tối ưu hóa nhất theo khả năng của bạn.
        `
}
/*
const getContentAI2 = (question : string, contentF : string[] | object, viduF : string | object) => {
    return `  
            I have table structures that were provided, and I would like you to help me generate SQL queries and store procedures.

            The table structures and data example insert are in the following files:
            
            ${contentF}
            
            Based on these tables, please assist with writing SQL queries or store procedures for the following task:
            
            - If I ask for a 'SELECT' query, return a SQL query that retrieves data with specific conditions, if any. Additionally, generate a set of hypothetical data to simulate the query result. 
            * If about Query Ensure the response is formatted in HTML for easy display on a web UI.
            - If I ask for an 'INSERT' or 'UPDATE' query, return only the SQL query without any example data.
            
            - If I ask for a 'STORE PROCEDURE', return only the procedure code without any example of how to call or use it.
            
            Please ensure that the result format is as follows:
            1. For 'SELECT', provide both the SQL query and an example result in table format.
            2. For 'INSERT', 'UPDATE', or 'STORE PROCEDURE', provide only the code without additional details.



            - Example of input clob data:
            ${viduF}

            Here's the user's request:
            ${question}
    `
}
*/
export async function POST(req: Request) {

    const { question } = await req.json();
    const contentF = await contentFile();
    const viduF = await vidu();
    console.log('question:', question)
    const content_ai = getContentAI(question, contentF, viduF);
    try {
      const message : OpenAI.Chat.ChatCompletionCreateParams['messages'] = [
          { role: "system", content: `You are a Senior DBA Database oracle in banking with 15 year experience. 
                                        You are asked to write a SQL query to get the result from the table below.
                                        You need to write a SQL query to get the result from the table with best performance.
                                        ` },
            {   role: "system",
                content: `
                        When generating SQL queries or procedures, analyze the context and:
                        - Use 'NOT EXISTS' or 'NOT IN' based on what offers better performance in the given situation.
                        - Use indexed columns in joins and where conditions.
                        - Avoid 'SELECT *'; specify columns explicitly.
                        - Minimize subqueries, prefer joins when possible.
                        - For large datasets, use bulk operations.
                        `
            },
          {   role: "user", 
              content: content_ai
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


