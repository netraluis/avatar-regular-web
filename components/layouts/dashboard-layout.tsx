"use client";

import Image from "next/image";
import { Slash } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useRouter, useParams } from "next/navigation";
import { Combobox } from "../combo-box";
import { assistantsTeamSelected, teams } from "../mockData";

export default function Dashboard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { teamId, assistantId } = useParams();

  console.log({ teamId, assistantId });

  const teamSelected = teams.find((team) => team.id === teamId);
  const assistantSelected = assistantsTeamSelected.find(
    (assistant) => assistant.id === assistantId,
  );

  const handleAssistantRouteChange = (assistantId: string) => {
    // Divide la ruta actual en segmentos
    // const segments = pathname.split("/");
    // console.log({ segments });

    // // Reemplaza el último segmento con el nuevo valor
    // segments[segments.length - 1] = assistantId;

    // // Une los segmentos para formar la nueva ruta
    // const newPath = segments.join("/");

    // console.log({ newPath });

    // Navega a la nueva ruta
    router.push(`/team/${teamId}/assistant/${assistantId}`);
  };

  const handleTeamRouteChange = (teamId: string) => {
    // const newPath = `${teamId}`;
    router.push(`/team/${teamId}`);
  };

  const handleCreateNewTeamRoute = () => {
    console.log("hola");
    router.push("/team/");
  };

  const handleTeamSettingsRoute = (subMenu: string) => {
    const newPath = `/team/${teamId}/settings/${subMenu}`;
    router.push(newPath);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
              {teamSelected && (
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Combobox
                      options={teams}
                      optionSelected={teamSelected}
                      subject="team"
                      routerHandler={handleTeamRouteChange}
                      createNewTeamRoute={handleCreateNewTeamRoute}
                      settingsRouteHandler={handleTeamSettingsRoute}
                    />
                  </BreadcrumbLink>
                </BreadcrumbItem>
              )}
              {assistantId && assistantSelected && (
                <>
                  <BreadcrumbSeparator>
                    <Slash className="h-4 w-4 text-muted-foreground" />
                  </BreadcrumbSeparator>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Combobox
                        options={assistantsTeamSelected}
                        optionSelected={assistantSelected}
                        subject="assistant"
                        routerHandler={handleAssistantRouteChange}
                        createNewTeamRoute={handleCreateNewTeamRoute}
                        settingsRouteHandler={handleTeamSettingsRoute}
                      />
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
          <div className="relative ml-auto flex-1 md:grow-0"></div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
              >
                <Image
                  src="/avatar.png"
                  width={36}
                  height={36}
                  alt="Avatar"
                  className="overflow-hidden rounded-full"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        {children}
      </div>
    </div>
  );
}
