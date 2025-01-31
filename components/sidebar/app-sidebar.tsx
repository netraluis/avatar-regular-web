"use client";

import * as React from "react";

import { NavAssistants } from "@/components/sidebar/nav-assistants";
import { NavTeam } from "@/components/sidebar/nav-team";
import { NavUser } from "@/components/sidebar/nav-user";
import { TeamSwitcher } from "@/components/sidebar/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAppContext } from "../context/appContext";
import { useParams } from "next/navigation";
import {
  useFetchTeamsByUserId,
  useFetchTeamsByUserIdAndTeamId,
} from "../context/useAppContext/team";
import {
  useFetchAssistantsByTeamId,
  useFetchAssistantSelected,
} from "../context/useAppContext/assistant";
import { useEffect } from "react";
import { NavResources } from "./nav-resources";

// const pathname = usePathname();
// const comparatePathName = pathname.split("/").slice(1)[5];
// const absolutePath = pathname.split("/").slice(1, 6).join("/");

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {
    state: { teamSelected, user },
  } = useAppContext();
  const { teamId, assistantId } = useParams();

  const { fetchTeamsByUserId } = useFetchTeamsByUserId();
  const { fetchTeamsByUserIdAndTeamId } = useFetchTeamsByUserIdAndTeamId();
  const { fetchAssistantsByTeamId } = useFetchAssistantsByTeamId();
  const fetchAssistantSelected = useFetchAssistantSelected();

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

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavResources />
        {teamId === teamSelected?.id && <NavTeam />}
        {teamId === teamSelected?.id && <NavAssistants />}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
