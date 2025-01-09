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
import {
  useFetchAssistantsByTeamId,
  useFetchAssistantSelected,
} from "../context/useAppContext/assistant";
import { useUserLogout } from "../context/useAppContext/user";
import { assistantSettingsMenu, teamsSettingsNav } from "@/lib/helper/navbar";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { SelectCharging } from "../loaders/loadersSkeleton";
import { useDashboardLanguage } from "../context/dashboardLanguageContext";

export default function Dashboard({ children }: { children: React.ReactNode }) {
  const { t } = useDashboardLanguage();
  const dashboard = t("app.LAYOUT");
  const assistantSettingsNav = t(
    "app.TEAM.TEAM_ID.ASSISTANT.ASSISTANT_ID.LAYOUT",
  );

  const menu = t("app.TEAM.TEAM_ID.SETTINGS.LAYOUT.menu");

  const router = useRouter();

  const {
    state: { teams, teamSelected, assistantsByTeam, assistantSelected, user },
  } = useAppContext();
  const { teamId, assistantId } = useParams();

  const [chargingMoreTeamsLoading, setChargingMoreTeamsLoading] =
    React.useState(false);

  const { fetchTeamsByUserId } = useFetchTeamsByUserId();
  const { fetchTeamsByUserIdAndTeamId, loadingTeamsByUserIdAndTeamId } =
    useFetchTeamsByUserIdAndTeamId();
  const { fetchAssistantsByTeamId } = useFetchAssistantsByTeamId();
  const fetchAssistantSelected = useFetchAssistantSelected();
  const { userLogout } = useUserLogout();
  const pathname = usePathname();

  const pathSegments = pathname.split("/").filter(Boolean);
  const lastTwoSegments = pathSegments.slice(-2).join("/");

  // Comparar los valores extraídos con `/team/${teamId}`
  const isDashboardActive = lastTwoSegments === `team/${teamId}`;
  const isSettingsActive = lastTwoSegments === `team/${teamId}/settings`;

  // ---- first charge ----
  useEffect(() => {
    const fetchData = async () => {
      if (assistantId && teamId && user?.user?.id) {
        await fetchTeamsByUserId({
          userId: user.user.id,
          page: 1,
          pageSize: 4,
        });
        await fetchTeamsByUserIdAndTeamId(teamId as string, user.user.id);
        await fetchAssistantSelected.fetchAssistantsByAssistantSelected(
          teamId as string,
          assistantId as string,
          user.user.id,
        );
      } else if (user?.user?.id && teamId) {
        await fetchTeamsByUserId({
          userId: user.user.id,
          page: 1,
          pageSize: 4,
        });
        await fetchTeamsByUserIdAndTeamId(teamId as string, user.user.id);
      } else if (user?.user?.id) {
        const res = await fetchTeamsByUserId({
          userId: user.user.id,
          page: 1,
          pageSize: 4,
        });
        if (res && res.teamSelected) {
          await fetchTeamsByUserIdAndTeamId(
            res.teamSelected.id as string,
            user.user.id,
          );
        }
      }
    };

    fetchData();
  }, [user?.user?.id]);

  // ---- navigation----
  useEffect(() => {
    const fetchData = async () => {
      if (user?.user?.id && teamId) {
        await fetchTeamsByUserIdAndTeamId(teamId as string, user.user.id);
      }
    };

    fetchData();
  }, [teamId]);

  useEffect(() => {
    const fetchData = async () => {
      if (assistantId && teamId && user?.user?.id) {
        await fetchAssistantSelected.fetchAssistantsByAssistantSelected(
          teamId as string,
          assistantId as string,
          user.user.id,
        );
      }
    };
    fetchData();
  }, [assistantId]);

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

  const handleCreateNewAssistantRoute = () => {
    router.push(`/team/${teamId}/assistant/new`);
  };

  const handleTeamSettingsRoute = (subMenu: string) => {
    const newPath = `/team/${teamSelected?.id}/settings/${subMenu}`;
    router.push(newPath);
  };

  const handleAssistantsSettingsRoute = (subMenu: string) => {
    const newPath = `/team/${teamId}/assistant/${assistantId}/${subMenu}`;
    router.push(newPath);
  };

  const seeMoreTeams = async () => {
    if (!user?.user?.id) return;
    setChargingMoreTeamsLoading(true);
    await fetchTeamsByUserId({
      userId: user.user.id,
      page: teams.meta.page + 1,
      pageSize: 4,
    });
    setChargingMoreTeamsLoading(false);
  };

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
          unoptimized
        />
        <>
          <Breadcrumb className="flex">
            <BreadcrumbList>
              {!loadingTeamsByUserIdAndTeamId &&
              // !loadingTeamsByUserId &&
              teamSelected ? (
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Combobox
                      options={teams.teams as Option[]}
                      optionSelected={teamSelected as Option}
                      subject={dashboard.team}
                      routerHandler={handleTeamRouteChange}
                      createNewTeamRoute={handleCreateNewTeamRoute}
                      settingsRouteHandler={handleTeamSettingsRoute}
                      navItems={teamsSettingsNav(menu)}
                      fromColor={"to-[#f4f269]"}
                      toColor={"from-[#5cb270]"}
                      subjectTitle={dashboard.teams}
                      seeMoreFuncion={seeMoreTeams}
                      hasMoreItems={teams.meta.totalPages > teams.meta.page}
                      isChargingMoreItems={chargingMoreTeamsLoading}
                    />
                  </BreadcrumbLink>
                </BreadcrumbItem>
              ) : (
                <SelectCharging />
              )}
              {assistantId &&
                assistantSelected &&
                !fetchAssistantSelected.loading && (
                  <>
                    <BreadcrumbSeparator>
                      <Slash className="h-4 w-4 text-slate-300" />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Combobox
                          options={assistantsByTeam}
                          optionSelected={
                            assistantSelected?.localAssistant as Option
                          }
                          subject={dashboard.assistant}
                          routerHandler={handleAssistantRouteChange}
                          createNewTeamRoute={handleCreateNewAssistantRoute}
                          settingsRouteHandler={handleAssistantsSettingsRoute}
                          navItems={assistantSettingsMenu(assistantSettingsNav)}
                          fromColor={"to-[#ff930f]"}
                          toColor={"from-[#fff95b]"}
                          subjectTitle={dashboard.dashboard}
                        />
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  </>
                )}
              {fetchAssistantSelected.loading && <SelectCharging />}
            </BreadcrumbList>
          </Breadcrumb>
          <div className="relative ml-auto flex-1 md:grow-0"></div>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href={`/team/${teamId}`} legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <span
                      className={`${isDashboardActive ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {dashboard.dashboard}
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
                    {dashboard.resources}
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
                    {dashboard.help}
                  </a>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link
                  href={`/team/${teamSelected?.id}/settings`}
                  legacyBehavior
                  passHref
                >
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
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
                <DropdownMenuLabel>{dashboard.myAccount}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/user/general")}>
                  {dashboard.settings}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  {" "}
                  <a
                    className="text-muted-foreground"
                    href="https://wa.me/376644253?"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Support
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={async () => {
                    await userLogout();
                    router.push("/login");
                  }}
                >
                  {dashboard.logout}
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
