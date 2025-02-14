"use client";

import * as React from "react";
import { ChevronLeft } from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { useDashboardLanguage } from "../context/dashboardLanguageContext";
import { Collapsible } from "@/components/ui/collapsible";

export function UserHeader() {
  const router = useRouter();

  const { t } = useDashboardLanguage();
  const dashboard = t("app.LAYOUT");

  return (
    <SidebarMenu>
      <Collapsible
        // key={item.title}
        asChild
        // defaultOpen={item.isActive}
        className="group/collapsible"
      >
        <SidebarMenuItem>
          <SidebarMenuButton
            // asChild
            tooltip={dashboard.return}
            // className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <ChevronLeft
              className="h-4 w-4"
              onClick={() => {
                router.push(`/team`);
              }}
            />
            <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
              {/* <span className="truncate text-xs">{activeTeam.plan}</span> */}
              {dashboard.return}
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </Collapsible>
    </SidebarMenu>
  );
}
