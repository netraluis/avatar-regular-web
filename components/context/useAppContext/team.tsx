import { useState } from "react";
import { useAppContext } from "../appContext";
import { Prisma, Team } from "@prisma/client";

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

      // const teamSelected = responseData.length > 0 ? responseData[0] : {};
      dispatch({
        type: "SET_TEAMS",
        payload: {
          teams: responseData.teams,
          teamSelected: responseData.teamSelected,
        },
      });
      setDataTeamsByUserId(responseData);
      return {
        teams: responseData.teams,
        teamSelected: responseData.teamSelected,
      };
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

export const useFetchTeamsByUserIdAndTeamId = () => {
  const { dispatch } = useAppContext();

  const [loadingTeamsByUserIdAndTeamId, setLoadingTeamsByUserIdAndTeamId] = useState(false);
  const [errorTeamsByUserIdAndTeamId, setErrorTeamsByUserIdAndTeamId] = useState<any>(null);
  const [dataTeamsByUserIdAndTeamId, setDataTeamsByUserIdAndTeamId] = useState<Team[]>([]);

  async function fetchTeamsByUserIdAndTeamId(userId: string, teamId: string) {
    if (!userId) return setErrorTeamsByUserIdAndTeamId("No user id provided");
    try {
      setLoadingTeamsByUserIdAndTeamId(true);
      const response = await fetch(`/api/protected/team/${teamId}`, {
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

      // const teamSelected = responseData.length > 0 ? responseData[0] : {};
      dispatch({
        type: "SET_TEAM",
        payload: {
          // teams: 
          // teams: responseData.teams,
          teamSelected: responseData,
        },
      });
      setDataTeamsByUserIdAndTeamId(responseData);
      return {
        teams: responseData.teams,
        teamSelected: responseData.teamSelected,
      };
    } catch (error: any) {
      setErrorTeamsByUserIdAndTeamId({ error });
    } finally {
      setLoadingTeamsByUserIdAndTeamId(false);
    }
  }

  return {
    loadingTeamsByUserIdAndTeamId,
    errorTeamsByUserIdAndTeamId,
    dataTeamsByUserIdAndTeamId,
    fetchTeamsByUserIdAndTeamId,
  };
};

export const useCreateTeam = () => {
  const { dispatch } = useAppContext();

  const [loadingCreateTeam, setLoadingCreateTeam] = useState(false);
  const [errorCreateTeam, setErrorCreateTeam] = useState<any>(null);
  const [createTeamData, setCreateTeamData] = useState<Team | null>(null);

  async function createTeam({
    data,
    userId,
  }: {
    data: Prisma.TeamCreateInput;
    userId: string;
  }) {
    try {
      setLoadingCreateTeam(true);
      const response = await fetch(`/api/protected/team`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      if (!response.ok) {
        if (responseData.errorCode === "P2002") {
          return setErrorCreateTeam({
            errorCode: responseData.errorCode,
            message: "Team name already exists",
          });
        }
        throw new Error(`Error: ${response.statusText}`);
      }
      dispatch({
        type: "SET_TEAM_CREATION",
        payload: { newTeam: responseData },
      });
      setCreateTeamData(responseData);
    } catch (error: any) {
      setErrorCreateTeam({ error });
    } finally {
      setLoadingCreateTeam(false);
    }
  }

  return { loadingCreateTeam, errorCreateTeam, createTeamData, createTeam };
};

export const useUpdateTeam = () => {
  const { dispatch } = useAppContext();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState([]);

  async function updateTeam(
    teamId: string,
    data: Prisma.TeamUpdateInput,
    userId: string,
  ) {
    if (!teamId) return setError("No team id provided");
    try {
      setLoading(true);

      const teamSelectedResponse = await fetch(
        `/api/protected/team/${teamId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": userId, // Aquí enviamos el userId en los headers
          },
          body: JSON.stringify({ data }),
        },
      );

      const teamSelected = await teamSelectedResponse.json();

      if (!teamSelectedResponse.ok) {
        return setError({ error: teamSelected.errorCode });
        // throw new Error(`Error: ${teamSelectedResponse.statusText}`);
      }

      dispatch({
        type: "SET_TEAM_SELECTED",
        payload: teamSelected.data,
      });

      setData(teamSelected);
    } catch (error: any) {
      setError({ error });
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, data, updateTeam };
};

export const useDeleteTeam = () => {
  const { dispatch } = useAppContext();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [deleteTeamdata, setDeleteTeamdata] = useState([]);

  async function deleteTeam(teamId: string, userId: string) {
    if (!teamId) return setError("No team id provided");
    try {
      setLoading(true);

      const teamSelectedResponse = await fetch(
        `/api/protected/team/${teamId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": userId, // Aquí enviamos el userId en los headers
          },
        },
      );

      if (!teamSelectedResponse.ok) {
        throw new Error(`Error: ${teamSelectedResponse.statusText}`);
      }

      const teamSelected = await teamSelectedResponse.json();

      dispatch({
        type: "SET_TEAM_DELETE",
        payload: teamSelected.id,
      });

      setDeleteTeamdata(teamSelected);
    } catch (error: any) {
      setError({ error });
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, deleteTeamdata, deleteTeam };
};

export const useExistSubdomain = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState(null);

  async function existSubdomain(subdomain: string) {
    if (!subdomain) return setError("No subdomain provided");
    setError(null);
    setData(null);

    try {
      setLoading(true);

      const teamSelectedResponse = await fetch(
        `/api/protected/team/subdomain/${subdomain}`,
        {
          method: "GET",
        },
      );
      const teamSelected = await teamSelectedResponse.json();

      if (!teamSelectedResponse.ok) {
        return setError({ error: teamSelected.errorCode });
      }

      setData(teamSelected.data);
      return teamSelected.data;
    } catch (error: any) {
      setError({ error });
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, data, existSubdomain };
};
