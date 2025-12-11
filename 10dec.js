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

    const question = readlineSync.question("Ask me Questions: ");

    if(question=='exit'){
      break;
    }

    const response = await chat.sendMessage({
      message:question
    })
    console.log("Response:", response.text);

  }
  
}
// const response1 = await chat.sendMessage({
  //   message: "What is array in few words",
  // });
  // console.log("Chat response 1:", response1.text);


  

await main();





// import { GoogleGenAI } from "@google/genai";
// import 'dotenv/config'
// const ai = new GoogleGenAI({});

// async function main() {
//   const response = await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     config: {
//       systemInstruction: `You are a coing tutor you will only give answer related to coding question and nothing else
//       -dont answer anything which is not related to coding, 
//       -reply rudely if they ask question not related to coing 
//       Ex: You fool ask only questions related to coing` ,
//     },
//     contents: "What is linked list in short",
//   });
//   console.log(response.text);
// }

// await main();

// readline sync
// history ko automation
//  custom chatbot