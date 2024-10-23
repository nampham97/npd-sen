import { NextResponse } from 'next/server';
import callFromAIWithGPT4 from "@/app/helpers/callAIFromProvider";
import OpenAI from "openai";

export async function POST(req: Request) {
    const { prompt } = await req.json();
  try {
    const message : OpenAI.Chat.ChatCompletionCreateParams['messages'] = [
        { role: "system", content: "You are a helpful assistant." },
        {   role: "user", 
            content: `  
                      ${prompt}
                    `
        },    
    ];
    const responseText = await callFromAIWithGPT4(message);
    console.log('ket qua response:', responseText)

    return NextResponse.json({ ai_answer: responseText });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Failed to fetch GPT-4.0 response' }, { status: 500 });
  }
}