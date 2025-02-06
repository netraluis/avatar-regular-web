"use client";

import * as React from "react";
import { ChevronLeft } from "lucide-react";

import { DropdownMenu } from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { useDashboardLanguage } from "../context/dashboardLanguageContext";

export function UserHeader() {
  const router = useRouter();

  const { t } = useDashboardLanguage();
  const dashboard = t("app.LAYOUT");

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <ChevronLeft className="ml-auto" />
            <div
              className="grid flex-1 text-left text-sm leading-tight"
              onClick={() => {
                router.push(`/team`);
              }}
            >
              {/* <span className="truncate text-xs">{activeTeam.plan}</span> */}
              {dashboard.return}
            </div>
          </SidebarMenuButton>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
