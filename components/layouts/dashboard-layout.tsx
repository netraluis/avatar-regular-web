"use client";

import Image from "next/image";
import { Slash, Settings } from "lucide-react";

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
import {
  useFetchTeamsByUserId,
  useFetchTeamsByUserIdAndTeamId,
} from "../context/useAppContext/team";
import { useFetchAssistantsByTeamId, useFetchAssistantSelected } from "../context/useAppContext/assistant";
import { useUserLogout } from "../context/useAppContext/user";
import { assistantSettingsNav, teamsSettingsNav } from "@/lib/helper/navbar";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { SelectCharging } from "../loaders/loadersSkeleton";

const header = {
  userAuth: {
    contact: "Contacta",
    signup: "Registra’t",
    login: "Inicia sessió",
  },
  dashboard: {
    dashboard: "Assistents",
    // history: "Historial",
    resources: "Recursos",
    help: "Ajuda",
    settings: "Configuració",
  },
};

export default function Dashboard({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const {
    state: { teams, teamSelected, assistantsByTeam, assistantSelected, user },
  } = useAppContext();
  const { teamId, assistantId } = useParams();

  const { fetchTeamsByUserId, loadingTeamsByUserId } = useFetchTeamsByUserId();
  const { fetchTeamsByUserIdAndTeamId, loadingTeamsByUserIdAndTeamId } = useFetchTeamsByUserIdAndTeamId();
  const { fetchAssistantsByTeamId } = useFetchAssistantsByTeamId();
  const fetchAssistantSelected = useFetchAssistantSelected()
  const { userLogout } = useUserLogout();
  const pathname = usePathname();

  const pathSegments = pathname.split("/").filter(Boolean);
  const lastTwoSegments = pathSegments.slice(-2).join("/");

  // Comparar los valores extraídos con `/team/${teamId}`
  const isDashboardActive = lastTwoSegments === `team/${teamId}`;
  const isSettingsActive = lastTwoSegments === `team/${teamId}/settings`;

  useEffect(() => {
    const fetchData = async () => {
      if(assistantId && teamId && user?.user?.id){
        await fetchTeamsByUserId(user.user.id);
        await fetchTeamsByUserIdAndTeamId(teamId as string, user.user.id,);
        await fetchAssistantSelected.fetchAssistantsByAssistantSelected(teamId as string, assistantId as string,user.user.id);
      }else  if (user?.user?.id && teamId) {
        await fetchTeamsByUserId(user.user.id);
        await fetchTeamsByUserIdAndTeamId(teamId as string, user.user.id);
      } else if (user?.user?.id) {
        const res = await fetchTeamsByUserId(user.user.id);
        if (res && res.teamSelected) {
          await fetchTeamsByUserIdAndTeamId(res.teamSelected.id as string, user.user.id);
        }
      }
    }

    fetchData();
  }, [ user?.user?.id]);

  useEffect(() => {
    const fetchData = async () => {
      if (user?.user?.id && teamId) {
        await fetchTeamsByUserIdAndTeamId(teamId as string, user.user.id);
      } 
    }

    fetchData();
  }, [ teamId ]);


  useEffect(() => {
    const fetchData = async () => {
      if(assistantId && teamId && user?.user?.id){
        await fetchAssistantSelected.fetchAssistantsByAssistantSelected(teamId as string, assistantId as string,user.user.id);
      }
    }
    fetchData();
  }, [ assistantId]);


  useEffect(() => {
    if (user?.user?.id && teamId) {
      fetchAssistantsByTeamId(teamId as string, user.user.id);
    }
  }, []);

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

  const handleAssistantsSettingsRoute = (subMenu: string) => {
    const newPath = `/team/${teamId}/assistant/${assistantId}/${subMenu}`;
    router.push(newPath);
  };

  if (
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/confirm" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password"
  ) {
    return (
      <div className="h-screen w-full flex flex-col overflow-hidden">
        <header className="justify-between flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 p-4 flex">
          <Image
            src="/chatbotforLogo.svg"
            alt="Logo"
            width={170}
            height={170}
            className="cursor-pointer"
            onClick={() => router.push("/")}
          />
          <div>
            <Button asChild variant="link">
              <a
                href="https://wa.me/376644253?"
                target="_blank"
                rel="noopener noreferrer"
              >
                {header.userAuth.contact}
              </a>
            </Button>
            {pathname === "/login" && (
              <Button
                onClick={() => {
                  router.push("/signup");
                }}
                variant="secondary"
              >
                {header.userAuth.signup}
              </Button>
            )}
            {pathname === "/signup" && (
              <Button
                onClick={() => {
                  router.push("/login");
                }}
                variant="secondary"
              >
                {header.userAuth.login}
              </Button>
            )}
          </div>
        </header>
        <div className="grow overflow-auto flex flex-col items-center">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 p-4">
        <Image
          src="/chatbotforSymbol.svg"
          alt="Logo"
          width={32}
          height={32}
          className="cursor-pointer"
          onClick={() => router.push("/")}
        />
          <>
            <Breadcrumb className="flex">
              <BreadcrumbList>
                {!loadingTeamsByUserIdAndTeamId && !loadingTeamsByUserId && teamSelected ? (
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Combobox
                        options={teams as Option[]}
                        optionSelected={teamSelected as Option}
                        subject="team"
                        routerHandler={handleTeamRouteChange}
                        createNewTeamRoute={handleCreateNewTeamRoute}
                        settingsRouteHandler={handleTeamSettingsRoute}
                        navItems={teamsSettingsNav}
                        fromColor={"to-[#f4f269]"}
                        toColor={"from-[#5cb270]"}
                      />
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                ): <SelectCharging/>}
                {assistantId && assistantSelected && !fetchAssistantSelected.loading && (
                  <>
                    <BreadcrumbSeparator>
                      <Slash className="h-4 w-4 text-slate-300" />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Combobox
                          options={assistantsByTeam}
                          optionSelected={assistantSelected.localAssistant}
                          subject="assistant"
                          routerHandler={handleAssistantRouteChange}
                          createNewTeamRoute={handleCreateNewTeamRoute}
                          settingsRouteHandler={handleAssistantsSettingsRoute}
                          navItems={assistantSettingsNav}
                          fromColor={"to-[#ff930f]"}
                          toColor={"from-[#fff95b]"}
                        />
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  </>
                )}
                {fetchAssistantSelected.loading && <SelectCharging/>}
              </BreadcrumbList>
            </Breadcrumb>
            <div className="relative ml-auto flex-1 md:grow-0"></div>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href={`/team/${teamId}`} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      <span
                        className={`${isDashboardActive ? "text-foreground" : "text-muted-foreground"}`}
                      >
                        {header.dashboard.dashboard}
                      </span>
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <a
                      className="text-muted-foreground"
                      href="https://detailed-glue-10a.notion.site/Chatbotfor-155916db2da68083a888d00a5d1c0d61"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {header.dashboard.resources}
                    </a>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <a
                      className="text-muted-foreground"
                      href="https://wa.me/376644253?"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {header.dashboard.help}
                    </a>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link
                    href={`/team/${teamId}/settings`}
                    legacyBehavior
                    passHref
                  >
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      {/* <span className="text-muted-foreground">{header.dashboard.settings}</span> */}
                      <Settings
                        className={`h-5 w-5 ${isSettingsActive ? "animate-spin" : "text-muted-foreground"}`}
                      />
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            {user?.user?.id && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full bg-gradient-to-r from-[#0061ff] to-[#60efff] "
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
          </>
      </header>
      <Separator />
      <div className="grow overflow-auto flex flex-col items-center">
        {children}
      </div>
    </div>
  );
}
