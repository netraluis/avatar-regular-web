import { Client } from "@notionhq/client";
const apiKey = process.env.NOTION_API_KEY;

const notion = new Client({
  auth: apiKey,
});

interface Content {
  text: {
    value: string;
  };
}
interface Message {
  id: string;
  role: string;
  content: Content[];
}

const chunksize = 1800

function splitTextIntoChunks(text: string, chunkSize = chunksize) {
  const chunks: any = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  return chunks;
}

const getTheLastQuestionAndAnswer = async (message: Message[]) => {
  const patron = /【[^】]*】/g;

  const question = message[1].content[0].text.value.replace(
    patron,
    ""
  );
  const answer = message[0].content[0].text.value.replace(
    patron,
    ""
  );

  let arrayQuestion = [question]
  if(question.length >= chunksize){
    arrayQuestion = splitTextIntoChunks(question)
  }

  let arrayAnswer = [answer]
  if(answer.length >= chunksize){
    arrayAnswer = splitTextIntoChunks(answer)
  }

  return { question: arrayQuestion, answer: arrayAnswer };
}

export async function addNewRow(message: Message[], newDatabaseId: any) {
  const { question, answer } = await getTheLastQuestionAndAnswer(message);

  const propertiesForNewPages: any = {
    pregunta: {
      type: "title",
      title: [{ type: "text", text: { content: question[0] } }],
    },
    Resposta: {
      type: "rich_text",
      rich_text: [{ type: "text", text: { content: answer[0] } }],
    },
    Preguntes: {
      type: "number",
      number: message.length / 2,
    },
  };

  const databaseId = newDatabaseId;
  // If there is no ID (if there's an error), return.
  if (!databaseId) return;
  const newPage = await notion.pages.create({
    parent: {
      database_id: databaseId,
    },
    properties: propertiesForNewPages,
  });

  for (let i = 1; i < question.length; i++) {
    await notion.blocks.children.append({
      block_id: newPage.id,
      children: [
        {
          "paragraph": {
            "rich_text": [
              {
                "type": "text",
                "text": {
                  "content": question[i],
                },
              },
            ],
          },
        },
      ],
    });
  }

  for (let i = 1; i < answer.length; i++) {
    await notion.blocks.children.append({
      block_id: newPage.id,
      children: [
        {
          "paragraph": {
            "rich_text": [
              {
                "type": "text",
                "text": {
                  "content": answer[i],
                },
              },
            ],
          },
        },
      ],
    });
  }

  return newPage.id;
}

export async function updateQuestionsCounter (pageId: string, questions: number, message: Message[]) {
  await notion.pages.update({
    page_id: pageId,
    properties: {
      Preguntes: {
        type: "number",
        number: questions
      }
    }
  })

  const { question, answer } = await getTheLastQuestionAndAnswer(message);

  await notion.blocks.children.append({
    block_id: pageId,
    children: [
      {
        "heading_2": {
          "rich_text": [
            {
              "text": {
                "content": `Pregunta: ${question[0]}`
              }
            }
          ]
        }
      }
    ],
  });

  for (let i = 1; i < question.length; i++) {
    await notion.blocks.children.append({
      block_id: pageId,
      children: [
        {
          "heading_2": {
            "rich_text": [
              {
                "type": "text",
                "text": {
                  "content": `${question[i]}`,
                },
              },
            ],
          },
        },
      ],
    });
  }

    await notion.blocks.children.append({
    block_id: pageId,
    children: [
      {
        "paragraph": {
          "rich_text": [
            {
              "text": {
                "content": `Resposta: ${answer[0]}`,
              }
            }
          ]
        }
      }
    ],
  });

  for (let i = 1; i < answer.length; i++) {
    await notion.blocks.children.append({
      block_id: pageId,
      children: [
        {
          "paragraph": {
            "rich_text": [
              {
                "type": "text",
                "text": {
                  "content":`${answer[i]}`,
                },
              },
            ],
          },
        },
      ],
    });
  }
}
