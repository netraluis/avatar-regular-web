import { AssistantResponse } from "ai";
import OpenAI from "openai";
import clientPromise from "../mongodb";
import { addNewRow, updateQuestionsCounter } from "@/app/helper/notion";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
export const maxDuration = 60;
export const dynamic = "force-dynamic";

const databaseId = process.env.DATABASE_ID

export interface MessageDb {
  date: Date;
  threadId: string;
  message: string;
}

const manageThreadId = async (input: { threadId: string | null }) => {
  if (!input.threadId) {
    // const client = await clientPromise;

    // const db = client.db();

    const threadId = (await openai.beta.threads.create({})).id;

    // await db.collection("threads").insertOne({
    //   date: new Date(),
    //   threadId,
    // });

    return {threadId, isNew: true};
  } else {
    return {threadId: input.threadId, isNew: false};
  }
};

export async function POST(req: Request) {
  // Parse the request body
  const input: {
    threadId: string | null;
    message: string;
  } = await req.json();

  // Create a thread if needed and save it to the database
  const {threadId, isNew} = await manageThreadId(input);

  // Add a message to the thread
  const createdMessage = await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: input.message,
  });

  return AssistantResponse(
    { threadId, messageId: createdMessage.id },
    async ({ forwardStream, sendDataMessage }) => {
      // Run the assistant on the thread
      const runStream = openai.beta.threads.runs.stream(threadId, {
        assistant_id:
          process.env.OPENAI_ASSISTANT_ID ??
          (() => {
            throw new Error("ASSISTANT_ID is not set");
          })(),
      });

      // forward run status would stream message deltas
      let runResult = await forwardStream(runStream);
      console.log({runResult})
      if(runResult && runResult.status === "completed" && runResult.thread_id) {
        const threadMessages: any = await openai.beta.threads.messages.list(runResult.thread_id, {
          order: "desc",
        });
        try {
          if(isNew){
            const pageId = await addNewRow(threadMessages?.data, databaseId);
            const client = await clientPromise;
            console.log({pageId,})
            const db = client.db();
            await db.collection("threads").insertOne({
              date: new Date(),
              threadId,
              pageId
            });
          }else{
            const client = await clientPromise;
  
            const db = client.db();
            const dbThread = await db.collection("threads").findOne({
              threadId,
            });
  
            if (!dbThread) {
              // return null;
              throw new Error('Thread not found');
            }
          
            if (!('pageId' in dbThread)) {
              throw new Error('Thread data does not contain pageId');
            }
  
            const pageId = dbThread.pageId;

            console.log({pageId, dbThread})
  
            // // hacemos el update
            await updateQuestionsCounter(pageId, threadMessages.data.length / 2, threadMessages?.data);
          }
        }catch(e){
          console.error(e)
        }
   
      }
    }
  );
}
