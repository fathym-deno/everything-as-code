// import { awaitAllCallbacks, AzureChatOpenAI } from '../test.deps.ts';
import * as parse from "npm:pdf-parse";
import { PDFLoader } from "npm:langchain/document_loaders/fs/pdf";

const loader = new PDFLoader("./training/azure/data-explorer/azure-data-explorer.pdf", {
  splitPages: false,
});
    
const docs = await loader.load();

console.log(docs);