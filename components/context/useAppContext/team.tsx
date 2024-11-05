import { useState } from "react";
import { useAppContext } from "../appContext";
import { Team } from "@prisma/client";

export const useFetchTeamsByUserId = () => {
    const { dispatch } = useAppContext();
  
    const [loadingTeamsByUserId, setLoadingTeamsByUserId] = useState(false);
    const [errorTeamsByUserId, setErrorTeamsByUserId] = useState<any>(null);
    const [dataTeamsByUserId, setDataTeamsByUserId] = useState<Team[]>([]);
  
    async function fetchTeamsByUserId(userId: string) {
      if (!userId) return setErrorTeamsByUserId("No user id provided");
      try {
        setLoadingTeamsByUserId(true);
        const response = await fetch(`/api/protected/team`, {
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
  
        const teamSelected = responseData.length > 0 ? responseData[0] : {};
        dispatch({
          type: "SET_TEAMS",
          payload: { teams: responseData, teamSelected },
        });
        setDataTeamsByUserId(responseData);
        return { teams: responseData, teamSelected };
      } catch (error: any) {
        setErrorTeamsByUserId({ error });
      } finally {
        setLoadingTeamsByUserId(false);
      }
    }
  
    return {
      loadingTeamsByUserId,
      errorTeamsByUserId,
      dataTeamsByUserId,
      fetchTeamsByUserId,
    };
  };