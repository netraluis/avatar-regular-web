import prisma from "../prisma";
import { Prisma, UserType } from "@prisma/client";
import { getUserById } from "./user";
import { createClient } from "../supabase/server";

export type GetTeamByTeamId = Prisma.TeamGetPayload<{
  select: {
    selectedLanguages: true;
    headerButton: true;
    subDomain: true;
    defaultLanguage: true;
    welcomeType: true;
    name: true;
    logoUrl: true;
    symbolUrl: true;
    avatarUrl: true;
    paddleSubscriptionId: true;
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
        id: true;
        type: true;
        textHref: {
          select: {
            id: true;
            numberOrder: true;
            menuHeaderId: true;
            hrefLanguages: {
              select: {
                text: true;
                href: true;
                language: true;
                id: true;
                textHrefId: true;
              };
            };
          };
        };
      };
    };
    menuFooter: true;
    customDomain: true;
    assistants: {
      where: {
        isActive: true;
      };
      select: {
        id: true;
        name: true;
        emoji: true;
        url: true;
        assistantCard: {
          select: {
            title: true;
            description: true;
            language: true;
          };
        };
      };
    };
  };
}> | null;

export const getTeamForBubble = async (teamId: string) => {
  const team = await prisma.team.findFirst({
    where: {
      id: teamId,
    },
    select: {
      avatarUrl: true,
      logoUrl: true,
      name: true,
    },
  });

  return team;
};

export const getTeamsByUser = async ({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}) => {
  const supabase = createClient();

  // Obtener el usuario autenticado
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) {
    throw new Error("Unauthorized");
  }

  const { isSuperAdmin } = await getUserById(user.id);

  const where: { team: { isActive: boolean }; userId?: string } = {
    team: {
      isActive: true,
    },
    userId: user.id,
  };

  if (isSuperAdmin) {
    delete where.userId;
  }

  const teams = await prisma.userTeam
    .findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { user: { createdAt: "desc" } },
      select: {
        team: {
          select: {
            id: true,
            name: true,
            subDomain: true,
            isActive: true,
          },
        },
      },
    })
    .then((data) => data.map((team) => team.team));

  const total = await prisma.userTeam.count({
    where,
  });

  const totalPages = Math.ceil(total / pageSize);

  return {
    data: teams,
    meta: {
      total,
      page,
      pageSize,
      totalPages,
    },
  };
};

export const getTeamByTeamId = async ({ teamId }: { teamId: string }) => {
  const supabase = createClient();

  // Obtener el usuario autenticado
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) {
    throw new Error("Unauthorized");
  }

  const { isSuperAdmin } = await getUserById(user.id);

  const where: {
    id: string;
    isActive: boolean;
    users?: { some: { userId: string } };
  } = {
    id: teamId,
    isActive: true,
    users: {
      some: {
        userId: user.id,
      },
    },
  };
  if (isSuperAdmin) {
    delete where.users;
  }

  const selectTeam: Prisma.TeamSelect = {
    selectedLanguages: true,
    headerButton: true,
    subDomain: true,
    defaultLanguage: true,
    id: true,
    welcomeType: true,
    name: true,
    logoUrl: true,
    symbolUrl: true,
    avatarUrl: true,
    paddleSubscriptionId: true,
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
        id: true,
        type: true,
        textHref: {
          select: {
            id: true,
            numberOrder: true,
            menuHeaderId: true,
            hrefLanguages: {
              select: {
                text: true,
                href: true,
                language: true,
                id: true,
                textHrefId: true,
              },
            },
          },
        },
      },
    },
    menuFooter: true,
    customDomain: true,
    assistants: {
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        emoji: true,
        url: true,
        assistantCard: {
          select: {
            title: true,
            description: true,
            language: true,
          },
        },
      },
    },
  };
  //   const response = await fetch(`/api/teams/${id}`);
  //   return response.json();
  const subdomainInfo: Prisma.TeamGetPayload<{
    select: typeof selectTeam;
  }> | null = await prisma.team.findFirst({
    where,
    select: selectTeam,
  });

  return subdomainInfo;
};

export const getAssistantsByTeam = async (teamId: string, userId: string) => {
  const subdomainInfo = await prisma.team.findFirst({
    where: {
      id: teamId,
      isActive: true,
      users: {
        some: {
          userId: userId, // Verificar que el usuario está relacionado con el equipo
        },
      },
    },
    include: {
      assistants: {
        where: {
          isActive: true,
        },
      }, // Incluye todos los asistentes relacionados
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
          type: UserType.OWNER,
        },
      });

      // Retornar el nuevo equipo
      return newTeam;
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      // console.log("Error code:", error.code, "Error message:", error.message);
      return { errorCode: error.code, errorMessage: error.message };
    }
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
    const updateData = await prisma.team.update({
      where: {
        id: teamId,
      },
      data,
      select: {
        selectedLanguages: true,
        headerButton: true,
        subDomain: true,
        defaultLanguage: true,
        id: true,
        welcomeType: true,
        name: true,
        logoUrl: true,
        symbolUrl: true,
        avatarUrl: true,
        paddleSubscriptionId: true,
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
            id: true,
            type: true,
            textHref: {
              select: {
                id: true,
                numberOrder: true,
                menuHeaderId: true,
                hrefLanguages: {
                  select: {
                    text: true,
                    href: true,
                    language: true,
                    id: true,
                    textHrefId: true,
                  },
                },
              },
            },
          },
        },
        menuFooter: true,
        customDomain: true,
        assistants: {
          where: {
            isActive: true,
          },
          select: {
            id: true,
            name: true,
            emoji: true,
            url: true,
            assistantCard: {
              select: {
                title: true,
                description: true,
                language: true,
              },
            },
          },
        },
      },
    });

    return { success: true, data: updateData };
  } catch (error: any) {
    if (error.code === "P2002") {
      // console.log("Error code:", error.code, "Error message:", error.message);
      return {
        success: false,
        errorCode: error.code,
        errorMessage: error.message,
      };
    }
    console.error("Error updating team:", error);
    return {
      success: false,
      errorCode: "UNKNOWN_ERROR",
      errorMessage: "An unexpected error occurred.",
    };
  } finally {
    await prisma.$disconnect();
  }
};

export const deleteTeam = async ({ teamId }: { teamId: string }) => {
  const team = await prisma.team.update({
    where: {
      id: teamId,
    },
    data: {
      isActive: false,
      subDomain: `${teamId}-deleted`,
    },
  });

  await prisma.assistant.updateMany({
    where: {
      teamId: teamId,
    },
    data: {
      isActive: false,
    },
  });

  return team;
};

export const getDuplicateTeamBySubdomain = async (subDomain: string) => {
  try {
    const team = await prisma.team.findFirst({
      where: {
        subDomain,
      },
    });
    return {
      success: true,
      data: !!team,
    };
  } catch (error) {
    return {
      success: false,
      errorCode: "UNKNOWN_ERROR",
      errorMessage: "An unexpected error occurred.",
    };
  }
};

export const updateTeamByField = async ({
  teamId,
  field,
  value,
}: {
  teamId: string;
  field: string;
  value: string | null;
}) => {
  try {
    const team = await prisma.team.update({
      where: {
        id: teamId,
      },
      data: {
        [field]: value,
      },
      select: {
        selectedLanguages: true,
        headerButton: true,
        subDomain: true,
        defaultLanguage: true,
        id: true,
        welcomeType: true,
        name: true,
        logoUrl: true,
        symbolUrl: true,
        avatarUrl: true,
        paddleSubscriptionId: true,
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
            id: true,
            type: true,
            textHref: {
              select: {
                id: true,
                numberOrder: true,
                menuHeaderId: true,
                hrefLanguages: {
                  select: {
                    text: true,
                    href: true,
                    language: true,
                    id: true,
                    textHrefId: true,
                  },
                },
              },
            },
          },
        },
        menuFooter: true,
        customDomain: true,
        assistants: {
          where: {
            isActive: true,
          },
          select: {
            id: true,
            name: true,
            emoji: true,
            url: true,
            assistantCard: {
              select: {
                title: true,
                description: true,
                language: true,
              },
            },
          },
        },
      },
    });

    return team;
  } catch (error) {
    console.log({ error });
    return {
      success: false,
      errorCode: "UNKNOWN_ERROR",
      errorMessage: "An unexpected error occurred.",
    };
  }
};

export const getTeamForSubscription = async ({
  teamId,
}: {
  teamId: string;
}) => {
  const team = await prisma.team.findFirst({
    where: {
      id: teamId,
    },
    select: {
      id: true,
      paddleSubscriptionId: true,
    },
  });

  return team;
};
