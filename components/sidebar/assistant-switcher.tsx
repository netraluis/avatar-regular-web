"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useRouter, useParams } from "next/navigation";
import { Assistant } from "@prisma/client";
import { GetAssistantType } from "@/lib/data/assistant";
import OpenAI from "openai/index.mjs";
import { useDashboardLanguage } from "../context/dashboardLanguageContext";
import { useLoadingRouter } from "../context/useAppContext/loading";

export function AssistantSwitcher({
  assistants,
  assistantSelected,
}: {
  assistants: Assistant[];
  assistantSelected: {
    localAssistant: GetAssistantType;
    openAIassistant: OpenAI.Beta.Assistants.Assistant;
  } | null;
}) {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const { loadingRouter } = useLoadingRouter();

  const { t } = useDashboardLanguage();
  const dashboard = t("app.LAYOUT");

  const handlerUpdateSelectedTeam = async (teamId: string) => {
    loadingRouter(true);
    router.push(`/team/${teamId}`);
  };

  const handleCreateNewTeamRoute = () => {
    loadingRouter(true);
    router.push("/team/new");
  };

  const { assistantId } = useParams();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {/* <SidebarMenuButton asChild> */}

            {/* </SidebarMenuButton> */}

            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {/* <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <activeTeam.logo className="size-4" />
              </div> */}
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {assistantId === assistantSelected?.localAssistant?.id
                    ? assistantSelected?.localAssistant?.name
                    : "Select an assistant"}
                </span>
                {/* <span className="truncate text-xs">{activeTeam.plan}</span> */}
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              {dashboard.assistants}
            </DropdownMenuLabel>

            {assistants.map((assistant) => (
              <DropdownMenuItem
                key={assistantSelected?.localAssistant?.id}
                onClick={() => handlerUpdateSelectedTeam(assistant.id)}
                className="gap-2 p-2"
              >
                {/* <div className="flex size-6 items-center justify-center rounded-sm border">
                  <team.logo className="size-4 shrink-0" />
                </div> */}
                <div className="truncate w-80">{assistant.name}</div>

                {assistantId === assistant.id && <Check className="h-6 w-6" />}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 p-2"
              onClick={handleCreateNewTeamRoute}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">
                {dashboard.create} {dashboard.assistant}
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
