import * as dotenv from 'dotenv';
dotenv.config();
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeStore } from '@langchain/pinecone';
// console.log("ENV CHECK:", {
//   GEMINI: process.env.GEMINI_API_KEY,
//   PINECONE: process.env.PINECONE_API_KEY,
//   INDEX: process.env.PINECONE_INDEX_NAME,
// });




async function indexing(){
  // load the pdf file
const PDF_PATH = './PDFNODEJS.pdf';
const pdfLoader = new PDFLoader(PDF_PATH);
const rawDocs = await pdfLoader.load();

// Create the chunking
const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,//So the context doesnt get loose half in the previous
  });
const chunkedDocs = await textSplitter.splitDocuments(rawDocs);

// console.log(chunkedDocs.length); 

// Vectors Embedding for the 266--> vectors Configuring the embedder
const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY,
    model: 'text-embedding-004',
  });


// Configure the vector database
const pinecone = new Pinecone();
const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);

// final step to put the embedded vectors into the database


await PineconeStore.fromDocuments(chunkedDocs, embeddings, {
    pineconeIndex,
    maxConcurrency: 5,
  });
}

indexing();