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
import { Separator } from "@/components/ui/separator";

import { useRouter, useParams, usePathname } from "next/navigation";
import { Combobox } from "../combo-box";
import React, { useEffect } from "react";
import { useAppContext } from "../context/appContext";
import { Option } from "@/types/types";
import { useFetchTeamsByUserId } from "../context/useAppContext/team";
import { useFetchAssistantsByTeamId } from "../context/useAppContext/assistant";
import { useUserLogout } from "../context/useAppContext/user";

export default function Dashboard({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const {
    state: { teams, teamSelected, assistantsByTeam, user },
  } = useAppContext();
  const { teamId, assistantId } = useParams();

  const [assistantSelected, setAssistantSelected] = React.useState(null);
  const { fetchTeamsByUserId } = useFetchTeamsByUserId();
  const { fetchAssistantsByTeamId } = useFetchAssistantsByTeamId();
  const { userLogout } = useUserLogout();
  const pathname = usePathname();

  useEffect(() => {
    if (user?.user?.id && teamId) {
      fetchAssistantsByTeamId(teamId as string, user.user.id);
    }
  }, []);

  useEffect(() => {
    if (user?.user?.id) {
      fetchTeamsByUserId(user.user.id);
    }
  }, [user?.user?.id]);

  // useEffect(() => {
  //   if (userId) {
  //     fetchTeamsByUserId(userId);
  //     dispatch({
  //       type: "SET_USER",
  //       payload: { user: { id: userId } },
  //     });
  //   }
  // }, [userId]);

  useEffect(() => {
    const assistantSelected: any =
      assistantsByTeam &&
      assistantsByTeam.find((assistant) => assistant.id === assistantId);
    if (assistantSelected) {
      setAssistantSelected(assistantSelected);
    }
  }, [assistantsByTeam, assistantId]);

  const handleAssistantRouteChange = (assistantId: string) => {
    router.push(`/team/${teamId}/assistant/${assistantId}`);
  };

  const handleTeamRouteChange = (teamId: string) => {
    router.push(`/team/${teamId}`);
  };

  const handleCreateNewTeamRoute = () => {
    router.push("/team/new");
  };

  const handleTeamSettingsRoute = (subMenu: string) => {
    const newPath = `/team/${teamId}/settings/${subMenu}`;
    router.push(newPath);
  };

  if (
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/confirm" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password"
  ) {
    return <>{children}</>;
  }

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 p-4">
        <Image
          src="/chatbotforSymbol.svg"
          alt="Logo"
          width={17}
          height={17}
          className="cursor-pointer"
          onClick={() => router.push("/")}
        />
        <Breadcrumb className="hidden md:flex">
          <BreadcrumbList>
            {teamSelected && (
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Combobox
                    options={teams as Option[]}
                    optionSelected={teamSelected as Option}
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
                      options={assistantsByTeam}
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
        {user?.user?.id && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full bg-gradient-to-r from-red-500 to-yellow-500 "
              >
                {/* <Image
                  src="/avatar.png"
                  width={36}
                  height={36}
                  alt="Avatar"
                  className=" rounded-full"
                /> */}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={async () => {
                  await userLogout();
                  router.push("/login");
                }}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </header>
      <Separator />
      <div className="grow overflow-auto flex flex-col">{children}</div>
    </div>
  );
}
