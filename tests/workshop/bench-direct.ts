import {
  AzureAISearchQueryType,
  AzureAISearchVectorStore,
  AzureOpenAIEmbeddings,
  MemoryVectorStore,
  PDFLoader,
  RecursiveCharacterTextSplitter,
} from "../test.deps.ts";

try {
  const loader = new PDFLoader(
    "./training/azure/data-explorer/azure-data-explorer.pdf",
    {
      // splitPages: false,
    },
  );

  const docs = await loader.load();

  console.log(
    `Loaded document with ${docs.length} total pages`,
  );

  const kqlOverviewStartPage = 958;

  const kqlOverviewEndPage = 2985;

  const kqlDocs = docs.filter((doc) =>
    doc.metadata.loc.pageNumber >= kqlOverviewStartPage &&
    doc.metadata.loc.pageNumber <= kqlOverviewEndPage
  );

  console.log(
    `Loaded document with ${kqlDocs.length} total pages of KQL information`,
  );

  const splitter = new RecursiveCharacterTextSplitter();

  const docOutput = await splitter.splitDocuments(docs);

  console.log(
    `Generated ${docOutput.length} split documents for vector store.`,
  );

  const embeddings = new AzureOpenAIEmbeddings({
    azureOpenAIEmbeddingsApiDeploymentName: Deno.env.get(
      "AZURE_OPENAI_API_EMBEDDING_DEPLOYMENT_NAME",
    ),
  });

  const vectorStore = new AzureAISearchVectorStore(embeddings, {
    search: {
      type: AzureAISearchQueryType.SimilarityHybrid,
    },
  });

  const docsToAdd = docOutput; //.slice(1000, 1250);

  await vectorStore.addDocuments(docsToAdd);

  console.log(`Generated vector store with ${docsToAdd.length} documents`);

  const resultOne = await vectorStore.similaritySearch(
    "write me an example KQL",
    5,
  );

  console.log(JSON.stringify(resultOne, null, 2));
} catch (e) {
  console.error(e);
  Deno.exit(1);
}
