import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({apiKey:"AIzaSyC1GpSS2SS61uCbJ-JBQ39T-gCEOLrpMKU"});

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
      role: "user",
      parts: [{ text: "What is my name?" }],
      },
      {
        role: "model",
        parts: [{ text: "As an AI, I don't have access to personal information" }],
      },
      {
      role: "user",
      parts: [{ text: "My name is vedant" }],
      },
      {
      role: "model",
      parts: [{ text: "Thank you for telling me! Hello, Vedant!" }],
      },
      {
      role: "user",
      parts: [{ text: "What is my name?" }],
      },

    ],
  });
  console.log(response.text);
}

await main();

// readline sync
// history ko automation
//  custom chatbot