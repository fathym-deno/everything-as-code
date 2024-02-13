// import { awaitAllCallbacks, AzureChatOpenAI } from '../test.deps.ts';
import * as parse from "pdf-parse";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";

const loader = new PDFLoader("../../training/azure/data-explorer/azure-data-explorer.pdf");
    
const docs = await loader.load();