import { useState } from "react";
import { useAppContext } from "../appContext";

export const useUserLogout = () => {
  const { dispatch } = useAppContext();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<any>(null);

  async function userLogout() {
    try {
      setLoading(true);
      const response = await fetch(`/api/auth/signout`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const responseData = await response.json();
      dispatch({ type: "SET_USER_LOGOUT" });
      setData(responseData);
      return { data: responseData };
    } catch (error: any) {
      setError({ error });
      return { error };
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, data, userLogout };
};

export const useLoginUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  async function loginUser({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    try {
      setLoading(true);
      const response = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const responseData = await response.json();
      if (!response.ok) {
        console.log("response", responseData.error);
        // throw new Error(`Error: ${response.statusText}`);
        setError(responseData.error as string);
      }

      setData(responseData);
      return { data: responseData };
    } catch (error: any) {
      console.error("error", error);
      setError("unknown_error");
      return { error };
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, data, loginUser };
};
