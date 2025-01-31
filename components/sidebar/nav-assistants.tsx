"use client";

import {
  ChevronRight,
  Folder,
  MoreHorizontal,
  Trash2,
  LucideProps,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAppContext } from "../context/appContext";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { useDashboardLanguage } from "../context/dashboardLanguageContext";
import { assistantSettingsMenu } from "@/lib/helper/navbar";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { useDeleteAssistant } from "../context/useAppContext/assistant";

interface TreeType {
  name: string;
  href: string;
  id: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
}

interface ItemTreeType extends TreeType {
  subItems?: TreeType[];
}

function Tree(item: ItemTreeType) {
  const router = useRouter();
  const { teamId, assistantId } = useParams();
  // const [name, ...items] = Array.isArray(item) ? item : [item]
  if (!item.subItems?.length) {
    return (
      <SidebarMenuButton
        // isActive={name === "button.tsx"}
        className="data-[active=true]:bg-transparent"
        onClick={() => {
          router.push(`/team/${teamId}/assistant/${assistantId}/${item.href}`);
        }}
      >
        <item.icon />
        {item.name}
      </SidebarMenuButton>
    );
  }
  return (
    <SidebarMenuItem>
      <Collapsible
        className="group/collapsible [&[data-state=open]>button>svg:last-child]:rotate-90 w-full"
        // defaultOpen={name === "components" || name === "ui"}
      >
        <CollapsibleTrigger asChild>
          <SidebarMenuButton className="flex justify-between">
            <div className="flex">
              <item.icon className="h-4 w-4 mr-2" />
              {item.name}
            </div>
            <ChevronRight className="transition-transform" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub className="px-0">
            {item.subItems.map((subItem, index) => (
              <Tree key={index} {...subItem} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
}

export function NavAssistants() {
  const { isMobile } = useSidebar();
  const { t } = useDashboardLanguage();

  const dashboard = t("app.LAYOUT");
  const assistantSettingsNav = t(
    "app.TEAM.TEAM_ID.ASSISTANT.ASSISTANT_ID.LAYOUT",
  );

  const navOptions = t("app.TEAM.TEAM_ID.PAGE");

  const assistantNav = assistantSettingsMenu(assistantSettingsNav);

  const {
    state: { assistantsByTeam, user },
  } = useAppContext();
  const { teamId, assistantId } = useParams();
  const { deleteAssistant } = useDeleteAssistant();

  const router = useRouter();

  const handleGetAssistants = async (teamId: string) => {
    router.push(`/team/${teamId}`);
  };

  const handleDeleteAssistant = (assistantId: string) => {
    if (!user?.user.id) return;
    deleteAssistant({
      assistantId,
      userId: user.user.id,
      teamId: teamId as string,
    });
  };

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel
        className="hover:bg-slate-100 cursor-pointer"
        onClick={() => {
          handleGetAssistants(teamId as string);
        }}
      >
        {dashboard.assistant}
      </SidebarGroupLabel>
      <SidebarMenu>
        {assistantsByTeam.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton isActive={item.id === assistantId} asChild>
              <Link href={`/team/${teamId}/assistant/${item.id}`}>
                {/* <item.icon /> */}
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
            {assistantId === item.id && (
              <SidebarMenuSub>
                {assistantNav.map((item: any, index: number) => (
                  <Tree key={index} {...item} />
                ))}
              </SidebarMenuSub>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction>
                  <MoreHorizontal />
                  {/* <span className="sr-only">More</span> */}
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem
                  onClick={() => {
                    router.push(`/team/${teamId}/assistant/${item.id}`);
                  }}
                >
                  {/* <Link href= {`/team/${teamId}/assistant/${item.id}`}> */}
                  <Folder className="text-muted-foreground mr-2" />
                  <span>{navOptions.edit}</span>
                  {/* </Link> */}
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    handleDeleteAssistant(item.id);
                  }}
                >
                  <Trash2 className="text-muted-foreground mr-2" />
                  <span>{navOptions.delete}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
