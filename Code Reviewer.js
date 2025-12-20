import { GoogleGenAI,Type } from "@google/genai";
import {exec} from "child_process";
import readlineSync from "readline-sync";
import os, { type } from "os";
import "dotenv/config";
import util from "util";

const platform = os.platform();
const execute = util.promisify(exec);

const ai = new GoogleGenAI({});

async function readfile({command}){
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

const FileReader = {
  name:"readfile",
  description: "It takes the terminal command to read content from any location just give the right location of the file and the command to analyze it ",
  parameters :{
    type: Type.OBJECT,
    properties:{
      command:{
        type: Type.STRING,
        description: `It is the terminal command which will take command like  
        type "F:\CODING(MU)\DS\Binary_Search.cpp" 

        
        that will help you to see files in a folder and then give review of the code`,
    }
    },
    required: ['command']
  }
}
const History = [];

async function CodeReviewer(){
  while(true){
    const result = await ai.models.generateContent({
      model : "gemini-2.5-flash",
      contents: History,
      config:{
        systemInstruction:`Analyze the code in the file and give me a review of the code i have written in that file, no need to print code
        
        IMPORTANT: Just give a small review of what is happening in the code and just tell if it is tigh tor wrong`,

        tools:[
          {
            functionDeclarations : [FileReader]
          }
        ]
      },
    });

    if(result.functionCalls && result.functionCalls.length>0){
      console.log("My function is called");
      const functionCall = result.functionCalls[0];
      const {name,args} = functionCall;

      const toolResponse = await readfile(args);

      const functionResponsePart = {
            name: functionCall.name,
            response: {
                result: toolResponse,
            },
        };

      History.push({
        role: "model",
        parts:[
          {
            functionCall: functionCall,
          },
        ],
      }) ;

      History.push({
        role: "user",
        parts:[
          {
            functionResponse: functionResponsePart,
          },
        ],

      })
    }
    else{
      console.log(result.text);
      History.push({
        role:"model",
        parts:[{text:result.text}]
      })
      break;
    }
  }
}

while(true){
  const question = readlineSync.question("Give the addresss of code and instruction ---->");
  if(question=='exit'){
    break;
  }
  History.push({
    role:"user",
    parts:[{text:question}]
  });

  await CodeReviewer();
}
