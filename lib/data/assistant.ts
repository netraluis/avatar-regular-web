import prisma from "../prisma";

export const getAssistantsByTeam = async (teamId: string) => {
  const teamInfo = await prisma.assistant.findMany({
    where: {
      teamId: teamId,
    },
  });
  return teamInfo;
};
