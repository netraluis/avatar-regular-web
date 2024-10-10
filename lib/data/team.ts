import prisma from "../prisma";

export const getTeamsByUser = async (userId: string) => {
  //   const response = await fetch(`/api/teams/${id}`);
  //   return response.json();
  const subdomainInfo = await prisma.userTeam
    .findMany({
      where: {
        userId: userId,
      },
      select: {
        team: {
          select: {
            id: true,
            name: true,
            subDomain: true,
          },
        },
      },
    })
    .then((data) => data.map((team) => team.team));

  return subdomainInfo;
};
