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

export const createTeam = async ({
  team: { teamName },
  userId,
}: {
  team: { teamName: string };
  userId: string;
}) => {
  try {
    // Iniciar la transacción
    return await prisma.$transaction(async (tx) => {
      // Crear un nuevo equipo
      const newTeam = await tx.team.create({
        data: {
          name: teamName,
          subDomain: teamName, // Puedes ajustar subDomain si lo necesitas
        },
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
