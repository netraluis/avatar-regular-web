import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Asegúrate de que la clave no sea pública
});

// async function main() {
//   const stream = await openai.beta.threads.createAndRun({
//       assistant_id: "asst_123",
//       thread: {
//         messages: [
//           { role: "user", content: "Hello" },
//         ],
//       },
//       stream: true
//   });

//   for await (const event of stream) {
//     console.log(event);
//   }
// }

// main();

export const createThread = async (): Promise<OpenAI.Beta.Threads.Thread> => {
  return await openai.beta.threads.create();
};
