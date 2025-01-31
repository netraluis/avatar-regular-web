"use client";

import { ChevronRight, Settings } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useDashboardLanguage } from "../context/dashboardLanguageContext";
import { teamsSettingsNav } from "@/lib/helper/navbar";
import Link from "next/link";
import { useParams } from "next/navigation";

export function NavTeam() {
  const { t } = useDashboardLanguage();
  const teamSettings = t("app.TEAM.TEAM_ID.SETTINGS.LAYOUT");
  const menu = t("app.TEAM.TEAM_ID.SETTINGS.LAYOUT.menu");
  const dashboard = t("app.LAYOUT");

  const navItems = teamsSettingsNav(menu);

  const { teamId } = useParams();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{dashboard.team}</SidebarGroupLabel>
      <SidebarMenu>
        {/* {items.map((item) => ( */}
        <Collapsible
          // key={item.title}
          asChild
          // defaultOpen={item.isActive}
          className="group/collapsible"
        >
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip={teamSettings.cardTitle}>
                <Settings className="h-4 w-4" />
                <span>{teamSettings.cardTitle}</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {navItems.map((subItem) => (
                  <SidebarMenuSubItem key={subItem.name}>
                    <SidebarMenuSubButton asChild>
                      <Link href={`/team/${teamId}/settings/${subItem.id}`}>
                        {subItem.icon && <subItem.icon />}
                        <span>{subItem.name}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
        {/* ))} */}
      </SidebarMenu>
    </SidebarGroup>
  );
}
