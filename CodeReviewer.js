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
  description: "It takes the terminal command to read content from any location just give the right location of the file and the command to read it ",
  parameters :{
    type: Type.OBJECT,
    properties:{
      command:{
        type: Type.STRING,
        description: `It is the terminal command which will take command like type 
        $text = [IO.File]::ReadAllText("C:\CODING(MU)\DS\game.cpp"); 
        $text = $text.Replace("oldText","newText"); 
        [IO.File]::WriteAllText("C:\CODING(MU)\DS\game.cpp",$text)

        
        that will help you to see files in a folder and then make changes required`,
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
        systemInstruction:`You are a code reviewer and will read the code of the file whose location i will give you and you will generate a terminal command used to read the code from the file and send it to the function i have provided and see the file content,

        Give the command according to the Operarting system we are using.
         My Current user Operating system is: ${platform}.

         Kindly use best practice for commands, it should handle multine write also efficiently.
        
        Then you will do whatever instruction i will give you and you will chnage the content in the file with improvements 
        
        IMPORTANT: Dont return the file content just make the changes in the original file and save it do these operation using write command or save command using the function just print done at last 
        
        what i want:
        Get-Content → return content to AI
        AI edits code logically
        AI generates full rewritten file
        Tool overwrites file

        
`,

        tools:[
          {
            functionDeclarations : [FileReader]
          }
        ]
      },
    });

    if(result.functionCalls && result.functionCalls.length>0){
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
  const question = readlineSync.question("Give the addresss of code and iinstruction ---->");
  if(question=='exit'){
    break;
  }
  History.push({
    role:"user",
    parts:[{text:question}]
  });

  await CodeReviewer();
}
