import { getDuplicateTeamBySubdomain } from "@/lib/data/team";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { subdomain: string } },
) {
  try {
    // const userId = request.headers.get("x-user-id");

    // if (!userId) {
    //   return new NextResponse("user need to be log in", {
    //     status: 400,
    //   });
    // }

    // Extraer los parámetros de la ruta
    const { subdomain } = params;

    if (!subdomain) {
      return new NextResponse("subdomain is required", {
        status: 400,
      });
    }

    const teams = await getDuplicateTeamBySubdomain(subdomain);

    console.log({ teams, teamBoolean: !!teams.data });

    if (!teams.success) {
      return new NextResponse(JSON.stringify(teams), {
        status: 400,
      });
    }

    return new NextResponse(JSON.stringify(teams), {
      status: 200,
    });
  } catch (error) {
    console.error("Error retrieving user id:", error);

    return new NextResponse("Failed retrieving user id", {
      status: 500,
    });
  }
}
