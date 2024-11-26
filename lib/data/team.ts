import prisma from "../prisma";
import { Prisma } from "@prisma/client";

export type GetTeamByTeamId = Prisma.TeamGetPayload<{
  select: {
    headerButton: true;
    subDomain: true;
    defaultLanguage: true;
    welcomeType: true;
    name: true;
    logoUrl: true;
    symbolUrl: true;
    avatarUrl: true;
    id: true;
    footer: {
      select: {
        text: true;
        language: true;
      };
    };
    welcome: {
      select: {
        text: true;
        description: true;
        language: true;
      };
    };
    menuHeader: {
      select: {
        type: true;
        textHref: true;
      };
    };
    menuFooter: true;
    customDomain: true;
    assistants: {
      select: {
        id: true;
        name: true;
        emoji: true;
        url: true;
        assistantCard: {
          select: {
            title: true;
            description: true;
          };
        };
      };
    };
  };
}> | null;

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

export const getTeamByTeamId = async (
  teamId: string,
  userId: string,
): Promise<GetTeamByTeamId> => {
  //   const response = await fetch(`/api/teams/${id}`);
  //   return response.json();
  const subdomainInfo = await prisma.team.findFirst({
    where: {
      id: teamId,
      users: {
        some: {
          userId: userId, // Verificar que el usuario está relacionado con el equipo
        },
      },
    },
    select: {
      headerButton: true,
      subDomain: true,
      defaultLanguage: true,
      id: true,
      welcomeType: true,
      name: true,
      logoUrl: true,
      symbolUrl: true,
      avatarUrl: true,
      footer: {
        select: {
          text: true,
          language: true,
        },
      },
      welcome: {
        select: {
          text: true,
          description: true,
          language: true,
        },
      },
      menuHeader: {
        select: {
          type: true,
          textHref: true,
        },
      },
      menuFooter: true,
      customDomain: true,
      assistants: {
        select: {
          id: true,
          name: true,
          emoji: true,
          url: true,
          assistantCard: {
            select: {
              title: true,
              description: true,
            },
          },
        },
      },
    },
  });

  return subdomainInfo;
};

export const getAssistantsByTeam = async (teamId: string, userId: string) => {
  const subdomainInfo = await prisma.team.findFirst({
    where: {
      id: teamId,
      users: {
        some: {
          userId: userId, // Verificar que el usuario está relacionado con el equipo
        },
      },
    },
    include: {
      assistants: true, // Incluye todos los asistentes relacionados
    },
  });

  return subdomainInfo;
};

export const createTeam = async ({
  data,
  userId,
}: {
  data: Prisma.TeamCreateInput;
  userId: string;
}) => {
  try {
    // Iniciar la transacción
    return await prisma.$transaction(async (tx: any) => {
      // Crear un nuevo equipo
      const newTeam = await tx.team.create({
        data,
      });

      // Relacionar al usuario con el equipo en la tabla intermedia
      await tx.userTeam.create({
        data: {
          userId: userId, // Id del usuario
          teamId: newTeam.id, // Id del equipo creado
        },
      });

      // Retornar el nuevo equipo
      return newTeam;
    });
  } catch (error) {
    console.error("Error creating team:", error);
    throw new Error("Error creating team");
  } finally {
    await prisma.$disconnect();
  }
};

export const updateTeam = async ({
  teamId,
  data,
}: {
  teamId: string;
  data: Prisma.TeamUpdateInput;
}) => {
  try {
    return await prisma.team.update({
      where: {
        id: teamId,
      },
      data,
      include: {
        assistants: true,
        welcome: true,
        menuHeader: {
          include: {
            textHref: true,
          },
        },
        footer: true,
        menuFooter: true,
        headerButton: true,
      },
    });
  } catch (error) {
    console.error("Error updating team:", error);
    throw new Error("Error updating team");
  } finally {
    await prisma.$disconnect();
  }
};

export const deleteTeam = async ({ teamId }: { teamId: string }) => {
  const team = await prisma.team.delete({
    where: {
      id: teamId,
    },
  });

  return team;
};
