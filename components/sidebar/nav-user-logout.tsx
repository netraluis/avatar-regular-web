"use client";

import { LogOut } from "lucide-react";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { useDashboardLanguage } from "../context/dashboardLanguageContext";
import { useLoadingRouter } from "../context/useAppContext/loading";

export function NavUserLogout() {
  const { t } = useDashboardLanguage();

  const dashboard = t("app.LAYOUT");

  const router = useRouter();
  const { loadingRouter } = useLoadingRouter();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarSeparator />
          <SidebarMenuButton
            className="mt-2"
            onClick={() => {
              loadingRouter(true);
              router.push(`/user/general`);
            }}
          >
            <LogOut className="h-4 w-4" />
            <span>{dashboard.logOut}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
