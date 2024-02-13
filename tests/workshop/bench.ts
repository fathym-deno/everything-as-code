import { awaitAllCallbacks, AzureChatOpenAI, PDFLoader } from '../test.deps.ts';

Deno.test('Workshop Bench', async (t) => {
//   const model = new AzureChatOpenAI({
//     modelName: 'gpt-4',
//     temperature: 0.7,
//     // maxTokens: 1000,
//     maxRetries: 5,
//     verbose: true,
//   });

  await t.step('Invoke Test', async () => {
    const loader = new PDFLoader("../../training/azure/data-explorer/azure-data-explorer.pdf");
    
    const docs = await loader.load();

    console.log({ docs });
  });

  await awaitAllCallbacks();
});