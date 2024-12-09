import { Message } from "@prisma/client";
import { useState } from "react";

export const useFetchThreadsMessages = () => {
  const [loadingFetchThreadsMessages, setLoadingFetchThreadsMessages] =
    useState(false);
  const [errorFetchThreadsMessages, setErrorFetchThreadsMessages] =
    useState<any>(null);
  const [dataFetchThreadsMessages, setDataFetchThreadsMessages] = useState<
    any[]
  >([]);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);

  async function fetchThreadsMessages(
    {
      page,
      pageSize,
      limitMessagesPerThread,
      dateFrom,
      dateTo,
      assistantId,
      teamId,
    }: {
      page: number | null;
      pageSize: number | null;
      limitMessagesPerThread: number | null;
      assistantId: string;
      dateFrom: string | null;
      dateTo: string | null;
      teamId: string;
    },
    userId: string,
  ) {
    if (!userId) return setErrorFetchThreadsMessages("No user id provided");
    page = page || 1;
    pageSize = pageSize || 4;
    limitMessagesPerThread = limitMessagesPerThread || 2;

    const queryParams = new URLSearchParams();
    queryParams.set("page", page.toString());
    queryParams.set("pageSize", pageSize.toString());
    queryParams.set(
      "limitMessagesPerThread",
      limitMessagesPerThread.toString(),
    );

    if (dateFrom) queryParams.set("dateFrom", dateFrom);
    if (dateTo) queryParams.set("dateTo", dateTo);

    const url = `/api/protected/team/${teamId}/assistant/${assistantId}/thread/messages?${queryParams.toString()}`;

    try {
      setLoadingFetchThreadsMessages(true);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId, // Aquí enviamos el userId en los headers
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const responseData: { messages: Message[]; totalThreads: number } =
        await response.json();

      setHasMoreMessages(page * pageSize < responseData.totalThreads);

      setDataFetchThreadsMessages(responseData.messages);
      return {};
    } catch (error: any) {
      setErrorFetchThreadsMessages({ error });
    } finally {
      setLoadingFetchThreadsMessages(false);
    }
  }

  return {
    loadingFetchThreadsMessages,
    errorFetchThreadsMessages,
    dataFetchThreadsMessages,
    fetchThreadsMessages,
    hasMoreMessages,
  };
};

export const useFetchMessageByThread = () => {
  const [loadingFetchMessageByThread, setLoadingFetchMessageByThread] =
    useState(false);
  const [errorFetchMessageByThread, setErrorFetchMessageByThread] =
    useState<any>(null);
  const [dataFetchMessageByThread, setDataFetchMessageByThread] = useState<
    Message[]
  >([]);

  async function fetchMessageByThread({
    threadId,
    userId,
    assistantId,
    teamId,
  }: {
    teamId: string;
    threadId: string;
    userId: string;
    assistantId: string;
  }) {
    if (!userId) return setErrorFetchMessageByThread("No user id provided");

    if (!assistantId)
      return setErrorFetchMessageByThread("Assistant id is not provided");

    if (!threadId)
      return setErrorFetchMessageByThread("Thread id is not provided");

    try {
      setLoadingFetchMessageByThread(true);
      const response = await fetch(
        `/api/protected/team/${teamId}/assistant/${assistantId}/thread/${threadId}/message`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": userId, // Aquí enviamos el userId en los headers
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const responseData = await response.json();

      setDataFetchMessageByThread(responseData);
      return {};
    } catch (error: any) {
      setErrorFetchMessageByThread({ error });
    } finally {
      setLoadingFetchMessageByThread(false);
    }
  }

  return {
    loadingFetchMessageByThread,
    errorFetchMessageByThread,
    dataFetchMessageByThread,
    fetchMessageByThread,
  };
};
