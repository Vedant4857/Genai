import { GoogleGenAI } from "@google/genai";
import 'dotenv/config'
import readlineSync from "readline-sync"

const ai = new GoogleGenAI({});


async function main() {
  const chat = ai.chats.create({
    model: "gemini-2.0-flash",
    history: [],
    config: {
      systemInstruction: `You are a coding tutor you will only give answer related to coding question and nothing else
      -dont answer anything which is not related to coding, 
      -always answer in two lines not more than that
      -reply rudely if they ask question not related to coding 
      Ex: You fool ask only questions related to coing` ,
    },
  });

  while(true){

    const question = readlineSync.question("Ask me Questions only related to Coding: ");

    if(question=='exit'){
      break;
    }

    const response = await chat.sendMessage({
      message:question
    })
    console.log("Response:", response.text);

  }
  
}
await main();