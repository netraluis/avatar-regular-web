import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Asegúrate de que la clave no sea pública
});

export const createVectorStore = async ({
  name,
}: {
  name: string;
}): Promise<OpenAI.Beta.VectorStores.VectorStore> => {
  return await openai.beta.vectorStores.create({
    name,
  });
};

export const getVectorStoreFiles = async (
  vectorStoreId: string,
): Promise<OpenAI.Beta.VectorStores.Files.VectorStoreFilesPage> => {
  return await openai.beta.vectorStores.files.list(vectorStoreId);
};

export const deleteVectorStoreFile = async (vectorStoreId: string) => {
  return await openai.beta.vectorStores.del(vectorStoreId);
};
