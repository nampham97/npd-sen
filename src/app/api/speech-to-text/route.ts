
import { NextResponse } from 'next/server';
import OpenAI from "openai";
import fs, { createReadStream } from "fs";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
}
);

export async function POST(req: Request) {

  const body = req.body;

  const audio = body.get('audio');
  try{

    // const transcription : string = await client.audio.transcriptions.create({
    //   file: createReadStream(audioFile),
    //   model: "whisper-1",
    //   response_format: "text",
    // });


    return NextResponse.json({ ai_answer: '' });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Failed to fetch GPT-4.0 response' }, { status: 500 });
  }
}

async function get_ai_whisper(file : OpenAI.Audio.TranscriptionCreateParams['file']) : Promise<string> {
    const transcription : string = await client.audio.transcriptions.create({
        file: file,
        model: "whisper-1",
        response_format: "text",
      });

    return transcription;
}