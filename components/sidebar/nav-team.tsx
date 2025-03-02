"use client";

import { ChevronRight, Settings2 } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useDashboardLanguage } from "../context/dashboardLanguageContext";
import { teamsSettingsNav } from "@/lib/helper/navbar";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useLoadingRouter } from "../context/useAppContext/loading";

export function NavTeam() {
  const { t } = useDashboardLanguage();
  const teamSettings = t("app.TEAM.TEAM_ID.SETTINGS.LAYOUT");
  const menu = t("app.TEAM.TEAM_ID.SETTINGS.LAYOUT.menu");

  const router = useRouter();
  const navItems = teamsSettingsNav(menu);
  const { loadingRouter } = useLoadingRouter();
  const pathname = usePathname();
  const { teamId } = useParams();
  const absolutePath = pathname.split("/").slice(0, -1).join("/");

  return (
    <SidebarGroup className="p-0 m-0">
      {/* <SidebarGroupLabel>{dashboard.team.charAt(0).toUpperCase() + 
           dashboard.team.slice(1).toLowerCase()}</SidebarGroupLabel> */}
      <SidebarMenu>
        {/* {items.map((item) => ( */}
        <Collapsible
          // key={item.title}
          asChild
          open={absolutePath === `/team/${teamId}/settings`}
          // defaultOpen={item.isActive}
          className="group/collapsible"
        >
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={absolutePath === `/team/${teamId}/settings`}
              tooltip={teamSettings.cardTitle}
              onClick={() => {
                if (absolutePath === `/team/${teamId}/settings`) return;
                loadingRouter(true);
                router.push(`/team/${teamId}/settings/general`);
              }}
            >
              <Settings2 className="h-4 w-4" />
              <span>{teamSettings.cardTitle}</span>
              <CollapsibleTrigger asChild>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </CollapsibleTrigger>
            </SidebarMenuButton>
            <CollapsibleContent>
              <SidebarMenuSub>
                {navItems.map((subItem) => (
                  <SidebarMenuSubItem key={subItem.name}>
                    <SidebarMenuSubButton
                      isActive={
                        pathname === `/team/${teamId}/settings/${subItem.id}`
                      }
                      asChild
                    >
                      <div
                        onClick={() => {
                          if (
                            pathname ===
                            `/team/${teamId}/settings/${subItem.id}`
                          )
                            return;
                          loadingRouter(true);
                          router.push(`/team/${teamId}/settings/${subItem.id}`);
                        }}
                        // href={`/team/${teamId}/settings/${subItem.id}`}
                      >
                        <span>{subItem.name}</span>
                      </div>
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
