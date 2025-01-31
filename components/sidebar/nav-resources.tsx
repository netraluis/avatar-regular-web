"use client";

import { BookOpen, CircleHelp } from "lucide-react";

import { Collapsible } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useDashboardLanguage } from "../context/dashboardLanguageContext";

export function NavResources() {
  const { t } = useDashboardLanguage();
  const dashboard = t("app.LAYOUT");

  return (
    <SidebarGroup>
      {/* <SidebarGroupLabel>Team</SidebarGroupLabel> */}
      <SidebarMenu>
        <Collapsible asChild className="group/collapsible">
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a
                className="text-muted-foreground"
                href="https://detailed-glue-10a.notion.site/Chatbotfor-155916db2da68083a888d00a5d1c0d61"
                target="_blank"
                rel="noopener noreferrer"
              >
                <BookOpen className="h-4 w-4" />
                <span>{dashboard.resources}</span>
              </a>
            </SidebarMenuButton>
            <SidebarMenuButton asChild>
              <a
                className="text-muted-foreground"
                href="https://wa.me/376644253?"
                target="_blank"
                rel="noopener noreferrer"
              >
                <CircleHelp className="h-4 w-4" />
                <span>{dashboard.help}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  );
}
