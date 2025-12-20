// Cursor
import { GoogleGenAI,Type } from "@google/genai";
import {exec} from "child_process";
import util from "util"
import readlineSync from "readline-sync";
import 'dotenv/config';
import os from 'os'

const platform = os.platform();

const execute = util.promisify(exec);

const ai = new GoogleGenAI({})


async function executeCommand({command}){
  try{
    const {stdout,stderr} = await execute(command);

    if(stderr){
      return `Error: ${stderr}`
    }
     return `Success: ${stdout}`
  }
 

  catch(err){
    return `Error: ${err}`
  }
  
}


const commandExecuter = {
  name:"executeCommand",
  description: "It takes any shell/terminal command and executes it. it will help us create , read, write, update and delete any folder or files ",
  parameters: {
    type: Type.OBJECT,
    properties:{
      command:{
        type: Type.STRING,
        description: "It is the terminal/shell command. Ex: mkdir calculator, ni file.txt, cd Genai, echo > index.html ",
      }
    },
    required: ['command']
  }
}

const History = [];
async function buildWebsite() {

  while(true){
    const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: History,
        config: { 
          systemInstruction:`You are a website builder , which will create the frontened part of the website using terminal/shell command
          Ypu will give shell/terminal command one by one and we and our tool will execute it
          
          Give the command accorig to the operating system we are using 
          My current operating system is: ${platform}

          kindly use best practice for commands, it should handle multi line write also efficiently
          
          Your Job:
          1.Analyse the user query
          2.TAKE NECCESSARY ACTION after analysing the query by giving the proper shell command acc to os of the user
          
          Step by step guide:
          1.First create folder for the website which we have to create , ex:mkdir calculator
          2. Give shell /terminal command to create html file, 
          3.Give shell /terminal command to create css file
          4.Give shell /terminal command to create javascript file
          5.Give shell /terminal command to write  html file
          6. .Give shell /terminal command to write  css file
          7..Give shell /terminal command to write  javascipt file
          8. fix the error if they are present at any step by writing updating and deleteing
          `,
          tools: [
            {functionDeclarations:[commandExecuter]}
          ]
         },
       });

       if(result.functionCalls && result.functionCalls.length > 0){
        console.log("My function is called");
        const functionCall = result.functionCalls[0];

        const {name,args} = functionCall;

        const toolResponse = await executeCommand(args);

        const functionResponsePart = {
            name: functionCall.name,
            response: {
                result: toolResponse,
            },
        };


        // Send the function response back to the model.
       History.push({
       role: "model",
        parts: [{functionCall: functionCall}],
        });

        History.push({
            role:'user',
            parts:[{functionResponse: functionResponsePart}]
        })

       }
       else{
        console.log(result.text);
        History.push({
          role: "model",
          parts:[{text:result.text}]
        })

       }
  }

}

while(true){
  const question = readlineSync.question("Ask me anything::");

  if(question =='exit'){
    break;
  }
  History.push({
    role: 'user',
    parts: [{text:question}]
  })
  await buildWebsite();
}


