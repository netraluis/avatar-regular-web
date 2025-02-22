import { useRouter } from "next/navigation";
import { Plus, Bot } from "lucide-react";
import { useParams } from "next/navigation";
import { useDashboardLanguage } from "../context/dashboardLanguageContext";

import { Collapsible } from "@/components/ui/collapsible";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export const AddAssistant = () => {
  const { t } = useDashboardLanguage();

  const dashboard = t("app.LAYOUT");

  const router = useRouter();
  const { teamId } = useParams();

  const sidebarState = useSidebar();

  return (
    <SidebarGroup className="p-0 m-0">
      {!sidebarState.open && (
        <SidebarMenu>
          <Collapsible asChild className="group/collapsible">
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip={`+ ${
                  dashboard.assistant.charAt(0).toUpperCase() +
                  dashboard.assistant.slice(1).toLowerCase()
                }`}
                onClick={() => {
                  router.push(`/team/${teamId}/assistant/new`);
                }}
              >
                <Plus className="h-4 w-4" />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarMenu>
      )}
      <SidebarMenu>
        <Collapsible asChild className="group/collapsible">
          <SidebarMenuItem>
            <SidebarMenuButton
              className='flex'
              tooltip={`${
                dashboard.assistants.charAt(0).toUpperCase() +
                dashboard.assistants.slice(1).toLowerCase()
              }`} 
            >
              <Bot 
                className="h-4 w-4" 
                onClick={() => {
                  router.push(`/team/${teamId}`);
                }}
              />
              <span
                className='grow'
                onClick={() => {
                  router.push(`/team/${teamId}`);
                }}
              >
                {dashboard.assistants.charAt(0).toUpperCase() +
                  dashboard.assistants.slice(1).toLowerCase()}
              </span>
              <Plus
                className="h-3.5 w-3.5 ml-auto cursor-pointer hover:bg-slate-200 cursor-pointer rounded"
                onClick={() => {
                  router.push(`/team/${teamId}/assistant/new`);
                }}
              />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  );
};
