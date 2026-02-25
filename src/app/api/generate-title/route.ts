import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ title: "Voice conversation" });
    }

    const transcript = messages
      .filter((m: { role: string; text: string }) => m.role === "user")
      .slice(0, 4)
      .map((m: { role: string; text: string }) => m.text)
      .join("\n");

    if (!transcript.trim()) {
      return NextResponse.json({ title: "Voice conversation" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a short 3-5 word title for this conversation. 
                 Return ONLY the title, no punctuation, nothing else.
                 
                 Conversation:
                 ${transcript}`,
    });

    const title = response.text?.trim() || "Voice conversation";
    
    return NextResponse.json({ title });

  } catch (error) {
    console.error("[GenerateTitle] Error:", error);
    return NextResponse.json({ title: "Voice conversation" });
  }
}