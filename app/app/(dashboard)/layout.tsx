"use client";
import { useAppContext } from "@/components/context/appContext";
import {
  DashboardLanguageProvider,
  Language,
  useDashboardLanguage,
} from "@/components/context/dashboardLanguageContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { usePathname } from "next/navigation";
import ConfirmationScreen from "@/components/user-process/redirect";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const {
    state: { userLocal },
  } = useAppContext();

  const split = pathname.split("/")[pathname.split("/").length - 1];

  // const absolutePath = pathname.split("/").slice(pathname.split("/").length - 2, pathname.split("/").length - 0).join("/");

  const language: Language = (userLocal?.language as Language) || Language.EN;

  if (!userLocal) {
    return (
      <>
        <DashboardLanguageProvider userLanguage={language}>
          <div className="flex justify-center h-screen">
            <div className="flex">
              <ConfirmScreen />
            </div>
          </div>
        </DashboardLanguageProvider>
      </>
    );
  }

  if (split === "new" || split === "instructions" || split === "files") {
    return (
      <DashboardLanguageProvider userLanguage={language}>
        <div className="flex justify-center h-screen">
          <div className="flex">{children}</div>
        </div>
      </DashboardLanguageProvider>
    );
  }

  return (
    <DashboardLanguageProvider userLanguage={language}>
      <SidebarProvider>
        <AppSidebar />
        <main className="h-screen w-full relative">{children}</main>
      </SidebarProvider>
    </DashboardLanguageProvider>
  );
}

const ConfirmScreen = () => {
  const { t } = useDashboardLanguage();
  const screen = t("app.LAYOUT");
  return (
    <ConfirmationScreen
      title={screen.signupDisabled.title}
      description={screen.signupDisabled.description}
      logo={ShieldAlert}
      loading={false}
      linkText={
        <span className="mt-4 text-muted-foreground">
          {screen.signupDisabled.subDescription}{" "}
          <Link href={screen.signupDisabled.link} className="underline hover:">
            {screen.signupDisabled.linkText}
          </Link>
        </span>
      }
    />
  );
};
