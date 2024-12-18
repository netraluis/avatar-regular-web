import { useState } from "react";
import { useAppContext } from "../appContext";
import { Prisma, User } from ".prisma/client";

export const useFetchUserByUserId = () => {
  const { dispatch } = useAppContext();

  const [loadingUserLocalByUserId, setLoadingUserLocalByUserId] =
    useState(false);
  const [errorUserLocalByUserId, setErrorUserLocalByUserId] =
    useState<any>(null);
  const [dataUserLocalByUserId, setDataUserLocalByUserId] =
    useState<User | null>(null);

  async function fetchUserLocalByUserId(userId: string) {
    if (!userId) return setErrorUserLocalByUserId("No user id provided");
    try {
      setLoadingUserLocalByUserId(true);
      const response = await fetch(`/api/protected/user/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId, // Aquí enviamos el userId en los headers
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const responseData = await response.json();

      // const UserLocalelected = responseData.length > 0 ? responseData[0] : {};
      dispatch({
        type: "SET_USER_LOCAL",
        payload: responseData,
      });
      setDataUserLocalByUserId(responseData);
      return {
        UserLocal: responseData.UserLocal,
        UserLocalelected: responseData.UserLocalelected,
      };
    } catch (error: any) {
      setErrorUserLocalByUserId({ error });
    } finally {
      setLoadingUserLocalByUserId(false);
    }
  }

  return {
    loadingUserLocalByUserId,
    errorUserLocalByUserId,
    dataUserLocalByUserId,
    fetchUserLocalByUserId,
  };
};

export const useUpdateUserLocal = () => {
  const { dispatch } = useAppContext();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState([]);

  async function updateUserLocal(
    userLocalId: string,
    data: Prisma.UserUpdateInput,
  ) {
    if (!userLocalId) return setError("No userLocal id provided");
    try {
      setLoading(true);

      const userLocalResponse = await fetch(
        `/api/protected/user/${userLocalId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": userLocalId, // Aquí enviamos el userId en los headers
          },
          body: JSON.stringify({ data }),
        },
      );

      const userLocal = await userLocalResponse.json();

      if (!userLocalResponse.ok) {
        return setError({ error: userLocal.errorCode });
        // throw new Error(`Error: ${userLocalResponse.statusText}`);
      }

      dispatch({
        type: "SET_USER_LOCAL",
        payload: userLocal.data,
      });

      setData(userLocal);
    } catch (error: any) {
      setError({ error });
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, data, updateUserLocal };
};
