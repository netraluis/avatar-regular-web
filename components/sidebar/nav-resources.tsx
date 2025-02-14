"use client";

import { BookOpen, CircleHelp, PanelLeft } from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useDashboardLanguage } from "../context/dashboardLanguageContext";

export function NavResources() {
  const { t } = useDashboardLanguage();
  const dashboard = t("app.LAYOUT");

  const sidebarState = useSidebar();

  return (
    <>
      {!sidebarState.open && (
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip={dashboard.openDashboard}>
              <PanelLeft
                className="h-4 w-4"
                onClick={() => {
                  sidebarState.setOpen(true);
                }}
              />
              <span>{dashboard.openDashboard}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      )}

      {/* <SidebarGroup className = 'p-0 m-0'> */}
      <SidebarMenu>
        {/* <Collapsible asChild className="group/collapsible"> */}
        <SidebarMenuItem>
          <SidebarMenuButton asChild tooltip={dashboard.resources}>
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
        </SidebarMenuItem>
        {/* </Collapsible> */}
      </SidebarMenu>
      {/* </SidebarGroup>
      <SidebarGroup className = 'p-0 m-0'> */}
      <SidebarMenu>
        {/* <Collapsible asChild className="group/collapsible"> */}
        <SidebarMenuItem>
          <SidebarMenuButton asChild tooltip={dashboard.help}>
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
        {/* </Collapsible> */}
      </SidebarMenu>
      {/* </SidebarGroup> */}
    </>
  );
}
