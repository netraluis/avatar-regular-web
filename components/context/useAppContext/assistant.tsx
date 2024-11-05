import { useState } from "react";
import { useAppContext } from "../appContext";

export const useFetchAssistantsByTeamId = () => {
  const { dispatch } = useAppContext();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState([]);

  async function fetchAssistantsByTeamId(teamId: string, userId: string) {
    if (!teamId) return setError("No team id provided");
    try {
      setLoading(true);
      const response = await fetch(`/api/protected/team/${teamId}/assistants`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const responseData = await response.json();

      const teamSelectedResponse = await fetch(
        `/api/protected/team/${teamId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": userId, // Aquí enviamos el userId en los headers
          },
        }
      );

      if (!teamSelectedResponse.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const teamSelected = await teamSelectedResponse.json();

      dispatch({
        type: "SET_ASSISTANTS",
        payload: { assistants: responseData, teamSelected },
      });

      setData(responseData);
    } catch (error: any) {
      setError({ error });
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, data, fetchAssistantsByTeamId };
};
