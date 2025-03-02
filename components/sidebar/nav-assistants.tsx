"use client";

import { ChevronRight, LucideProps, Plus, Eye } from "lucide-react";

import {
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import { useAppContext } from "../context/appContext";
import { useRouter, useParams, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { useDashboardLanguage } from "../context/dashboardLanguageContext";
import { assistantSettingsMenu } from "@/lib/helper/navbar";
import { ForwardRefExoticComponent, RefAttributes } from "react";

interface TreeType {
  name: string;
  href: string;
  id: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  assistantUrl: string;
}

interface ItemTreeType extends TreeType {
  subItems?: TreeType[];
}

function Tree(item: ItemTreeType) {
  const router = useRouter();
  const { teamId } = useParams();
  const pathname = usePathname();
  const absolutePath = pathname.split("/").slice(0, -1).join("/");

  if (!item.subItems?.length) {
    return (
      <SidebarMenuButton
        // isActive={name === "button.tsx"}
        className="data-[active=true]:bg-transparent mr-0 pr-0"
        onClick={() => {
          if (
            pathname ===
            `/team/${teamId}/assistant/${item.assistantUrl}/${item.href}`
          )
            return;
          router.push(
            `/team/${teamId}/assistant/${item.assistantUrl}/${item.href}`,
          );
        }}
        isActive={
          pathname ===
          `/team/${teamId}/assistant/${item.assistantUrl}/${item.href}`
        }
      >
        {/* <item.icon /> */}
        {item.name}
      </SidebarMenuButton>
    );
  }

  return (
    <SidebarMenuItem className="mr-0 pr-0">
      <Collapsible
        className="group/collapsible [&[data-state=open]>button>svg:last-child]:rotate-90 w-full"
        // defaultOpen={name === "components" || name === "ui"}
        open={
          absolutePath ===
          `/team/${teamId}/assistant/${item.assistantUrl}/${item.href}`
        }
      >
        <SidebarMenuButton
          className="flex justify-between"
          isActive={
            absolutePath ===
            `/team/${teamId}/assistant/${item.assistantUrl}/${item.href}`
          }
        >
          <div
            className="grow"
            onClick={() => {
              if (
                absolutePath ===
                `/team/${teamId}/assistant/${item.assistantUrl}/${item.href}`
              )
                return;
              router.push(
                `/team/${teamId}/assistant/${item.assistantUrl}/${item.href}`,
              );
            }}
          >
            {/* <item.icon className="h-4 w-4 mr-2" /> */}
            {item.name}
          </div>
          <CollapsibleTrigger asChild>
            <ChevronRight className="transition-transform" />
          </CollapsibleTrigger>
        </SidebarMenuButton>
        <CollapsibleContent>
          <SidebarMenuSub className="pr-0 mr-0">
            {item.subItems?.map((subItem, index) => (
              <Tree key={index} {...subItem} assistantUrl={item.assistantUrl} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
}

export function NavAssistants() {
  const router = useRouter();
  const {
    state: { teamSelected, assistantsByTeam },
  } = useAppContext();
  const { t } = useDashboardLanguage();

  const dashboard = t("app.LAYOUT");
  const assistantSettingsNav = t(
    "app.TEAM.TEAM_ID.ASSISTANT.ASSISTANT_ID.LAYOUT",
  );

  const assistantNav = assistantSettingsMenu(assistantSettingsNav);
  const { assistantId } = useParams();
  return (
    // <SidebarGroup className="group-data-[collapsible=icon]:hidden">
    <>
      <SidebarGroupLabel className="flex group-data-[collapsible=icon]:hidden flex hover:bg-slate-100 cursor-pointer mt-2">
        <div
          className="grow"
          onClick={() => {
            router.push(`/team/${teamSelected?.id}`);
          }}
        >
          {dashboard.assistants.charAt(0).toUpperCase() +
            dashboard.assistants.slice(1).toLowerCase()}
        </div>
        <Plus
          className="h-3.5 w-3.5 ml-auto cursor-pointer hover:bg-slate-200 cursor-pointer rounded"
          onClick={() => {
            router.push(`/team/${teamSelected?.id}/assistant/new`);
          }}
        />
      </SidebarGroupLabel>
      <SidebarMenu className="group-data-[collapsible=icon]:hidden">
        {assistantsByTeam.map((item) => (
          <Collapsible
            key={item.id}
            asChild
            open={item.id === assistantId}
            className="group/collapsible"
          >
            <SidebarMenuItem key={item.name} className="pr-0 mr-0">
              <SidebarMenuButton
                isActive={item.id === assistantId}
                className="flex items-center justify-between"
              >
                <span
                  className="grow truncate"
                  onClick={() => {
                    router.push(
                      `/team/${teamSelected?.id}/assistant/${item.id}/playground`,
                    );
                  }}
                >
                  {item.name}
                </span>

                {item.status === "PUBLIC" && (
                  <Link
                    href={`${process.env.NEXT_PUBLIC_PROTOCOL ? process.env.NEXT_PUBLIC_PROTOCOL : "http://"}${teamSelected?.subDomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/${teamSelected?.defaultLanguage?.toLocaleLowerCase()}/${item.url}`}
                    rel="noopener noreferrer"
                    className="flex items-center hover:bg-slate-200 cursor-pointer rounded"
                    target="_blank"
                  >
                    <Eye className="w-3.5 h-3.5 m-1" />
                  </Link>
                )}
                <CollapsibleTrigger asChild>
                  <ChevronRight className="transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarMenuButton>
              <CollapsibleContent>
                <SidebarMenuSub className="mr-0 pr-0">
                  {assistantNav.map((itemNav: any, index: number) => {
                    return (
                      <Tree key={index} {...itemNav} assistantUrl={item.id} />
                    );
                  })}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </>
  );
}
