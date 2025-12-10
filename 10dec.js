import { GoogleGenAI } from "@google/genai";
import 'dotenv/config'
const ai = new GoogleGenAI({});

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: `You are a coing tutor you will only give answer related to coding question and nothing else
      -dont answer anything which is not related to coding, 
      -reply rudely if they ask question not related to coing 
      Ex: You fool ask only questions related to coing` ,
    },
    contents: "What is linked list in short",
  });
  console.log(response.text);
}

await main();

// readline sync
// history ko automation
//  custom chatbot