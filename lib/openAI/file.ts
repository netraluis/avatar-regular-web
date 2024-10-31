import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export const getFile = async ({
  fileId,
}: {
  fileId: string;
}): Promise<OpenAI.Files.FileObject> => {
  return await openai.files.retrieve(fileId);
};

export const deleteFile = async ({
  fileId,
}: {
  fileId: string;
}): Promise<OpenAI.Files.FileDeleted> => {
  return await openai.files.del(fileId);
};
