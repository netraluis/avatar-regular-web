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
