"use client";

import { ChevronRight, Settings2 } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { useRouter, useParams } from "next/navigation";
import { useDashboardLanguage } from "../context/dashboardLanguageContext";

export function NavUserBody() {
  const { t } = useDashboardLanguage();

  const dashboard = t("app.LAYOUT");

  const { teamId } = useParams();

  const router = useRouter();

  const handleGetAssistants = async (teamId: string) => {
    router.push(`/team/${teamId}`);
  };

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel
        className="hover:bg-slate-100 cursor-pointer"
        onClick={() => {
          handleGetAssistants(teamId as string);
        }}
      >
        {dashboard.account}
      </SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip={"hola"}
            onClick={() => router.push(`/user/general`)}
          >
            <Settings2 className="h-4 w-4" />
            <span>{dashboard.settings}</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
