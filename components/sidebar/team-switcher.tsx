"use client";

import * as React from "react";
import {
  Check,
  ChevronsUpDown,
  LoaderCircle,
  MoreHorizontal,
  Plus,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAppContext } from "../context/appContext";
import { useRouter, useParams } from "next/navigation";
import { useFetchTeamsByUserId } from "../context/useAppContext/team";
import { Button } from "../ui/button";
import { useDashboardLanguage } from "../context/dashboardLanguageContext";
import Image from "next/image";

export function TeamSwitcher() {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const {
    state: { teams, teamSelected, user },
  } = useAppContext();
  const [chargingMoreTeamsLoading, setChargingMoreTeamsLoading] =
    React.useState(false);

  const { t } = useDashboardLanguage();
  const dashboard = t("app.LAYOUT");

  const { fetchTeamsByUserId } = useFetchTeamsByUserId();

  const handlerUpdateSelectedTeam = async (teamId: string) => {
    router.push(`/team/${teamId}`);
  };

  const handleCreateNewTeamRoute = () => {
    router.push("/team/new");
  };

  const hasMoreItems = teams.meta.totalPages > teams.meta.page;

  const seeMoreFuncion = async () => {
    if (!user?.user?.id) return;
    setChargingMoreTeamsLoading(true);
    await fetchTeamsByUserId({
      userId: user.user.id,
      page: teams.meta.page + 1,
      pageSize: 4,
    });
    setChargingMoreTeamsLoading(false);
  };

  const { teamId } = useParams();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <div className="w-full flex justify-end">
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div>
                  {teamSelected?.logoUrl ? (
                    <div className="flex aspect-square size-8 items-center justify-center border overflow-hidden rounded-md">
                      {/* <activeTeam.logo className="size-4" /> */}
                      <Image
                        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${teamSelected?.logoUrl}`}
                        alt={teamSelected?.name || ""}
                        width={32}
                        height={32}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  ) : (
                    <div
                      className={`aspect-square size-8 bg-gradient-to-r rounded-md ${"from-red-500"} ${"to-blue-500"} mr-2`}
                    ></div>
                  )}
                </div>
                {/* <div className="grid flex-1 text-left text-sm leading-tight"> */}
                <span className="truncate font-semibold">
                  {teamId === teamSelected?.id
                    ? teamSelected?.name
                    : "Select a team"}
                </span>
                {/* <span className="truncate text-xs">{activeTeam.plan}</span> */}
                {/* </div> */}
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            {/* <SidebarTrigger className = 'mt-2.5' onClick={()=>{setOpen(true)}}/> */}
          </div>

          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              {dashboard.teams}
            </DropdownMenuLabel>

            {teams.teams.map((team) => (
              <DropdownMenuItem
                key={team.name}
                onClick={() => handlerUpdateSelectedTeam(team.id)}
                className="gap-2 p-2"
              >
                {/* <div className="flex size-6 items-center justify-center rounded-sm border">
                  <team.logo className="size-4 shrink-0" />
                </div> */}
                <div className="truncate w-80">{team.name}</div>

                {teamId === team.id && <Check className="h-6 w-6" />}
              </DropdownMenuItem>
            ))}
            {hasMoreItems && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-1 text-muted-foreground hover:text-primary flex items-center justify-center gap-2"
                onClick={seeMoreFuncion}
              >
                {!chargingMoreTeamsLoading ? (
                  <MoreHorizontal className="h-4 w-4" />
                ) : (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                )}
                {/* <span className="text-sm">Cargar más equipos</span> */}
              </Button>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 p-2"
              onClick={handleCreateNewTeamRoute}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">
                {dashboard.create} {dashboard.team}
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
