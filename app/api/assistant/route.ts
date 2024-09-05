import OpenAI from "openai";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const body = await request.json();
  const { question, threadId } = body;
  // const threadId = (await request.json()).threadId;
  // console.log({ question, threadId });
  return await main({ question, threadId });
}

async function main({
  question,
  threadId,
}: {
  question: string;
  threadId: string;
}) {
  try {
    const response = [];
    // Create a new thread if does not exist
    console.log({ threadId }, !!threadId);
    const actualThread = threadId
      ? threadId
      : (await openai.beta.threads.create()).id;

    await openai.beta.threads.messages.create(actualThread, {
      role: "user",
      content: question,
    });

    if (!process.env.OPENAI_ASSISTANT_ID) {
      console.log("No assistant id found");
      return Response.json({ message: "No assistant id found" });
    }
    let run = await openai.beta.threads.runs.createAndPoll(actualThread, {
      assistant_id: process.env.OPENAI_ASSISTANT_ID,
    });

    if (run.status === "completed") {
      const messages = await openai.beta.threads.messages.list(run.thread_id);
      for (const message of messages.data.reverse()) {
        if (message.role === "assistant") {
          response.push({
            who: "AI Andorra UE",
            message: message.content[0]
              ? (message.content[0] as any).text.value
              : "no tenemos contenido",
          });
        }
      }
      return Response.json({ response, threadId: actualThread });
    } else {
      console.log(run.status);
      return Response.json({ message: "failed" });
    }
  } catch (error) {
    console.log(error);
    return Response.json({ message: "Error" });
  }
}
