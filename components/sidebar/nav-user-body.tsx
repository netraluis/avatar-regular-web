"use client";

import { ChevronRight, Settings2 } from "lucide-react";

import {
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { Collapsible } from "@/components/ui/collapsible";

import { useRouter, useParams } from "next/navigation";
import { useDashboardLanguage } from "../context/dashboardLanguageContext";
import { useLoadingRouter } from "../context/useAppContext/loading";

export function NavUserBody() {
  const { t } = useDashboardLanguage();

  const dashboard = t("app.LAYOUT");

  const { teamId } = useParams();

  const router = useRouter();
  const { loadingRouter } = useLoadingRouter();

  const handleGetAssistants = async (teamId: string) => {
    loadingRouter(true);
    router.push(`/team/${teamId}`);
  };

  return (
    <>
      <SidebarGroupLabel
        className="hover:bg-slate-100 cursor-pointer"
        onClick={() => {
          handleGetAssistants(teamId as string);
        }}
      >
        {dashboard.account}
      </SidebarGroupLabel>
      <SidebarMenu>
        <Collapsible asChild className="group/collapsible">
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={"hola"}
              onClick={() => {
                loadingRouter(true);
                router.push(`/user/general`);
              }}
            >
              <Settings2 className="h-4 w-4" />
              <span>{dashboard.settings}</span>
              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </>
  );
}
