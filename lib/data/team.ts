import { teams } from "@/components/mockData";

export const getTeam = async (id?: string | undefined) => {
  //   const response = await fetch(`/api/teams/${id}`);
  //   return response.json();
  return id ? teams.find((team) => team.id === id) : teams[0];
};
