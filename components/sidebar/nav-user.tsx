"use client";

import {
  ChevronsUpDown,
  LogOut,
  ChevronRight,
  LifeBuoy,
  Settings2,
} from "lucide-react";

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
import { useDashboardLanguage } from "../context/dashboardLanguageContext";
import { useAppContext } from "../context/appContext";
import { useUserLogout } from "../context/useAppContext/user";
import { useRouter } from "next/navigation";
import { useLoadingRouter } from "../context/useAppContext/loading";

export function NavUser() {
  const { isMobile } = useSidebar();

  const { t } = useDashboardLanguage();
  const dashboard = t("app.LAYOUT");
  const {
    state: { userLocal },
  } = useAppContext();

  const router = useRouter();
  const { loadingRouter } = useLoadingRouter();

  const { userLogout } = useUserLogout();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div
                className={`aspect-square size-8 bg-gradient-to-r rounded-md ${"from-red-500"} ${"to-blue-500"} mr-2`}
              ></div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {dashboard.myAccount}
                </span>
                <span className="truncate text-xs">{userLocal?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              {userLocal?.email}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 p-2"
              onClick={() => {
                loadingRouter(true);
                router.push("/user/general");
              }}
            >
              <Settings2 className="size-4" />
              {dashboard.settings}
              <ChevronRight className="ml-auto size-4" />
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2 p-2"
              onClick={() => {
                loadingRouter(true);
                router.push("https://wa.me/376644253?");
              }}
            >
              <LifeBuoy className="size-4" />
              {dashboard.help}
              <ChevronRight className="ml-auto size-4" />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 p-2"
              onClick={() => userLogout()}
            >
              {dashboard.logout}
              <LogOut className="size-4 ml-auto " />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
