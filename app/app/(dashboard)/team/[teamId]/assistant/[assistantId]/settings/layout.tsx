"use client";

import * as React from "react";
import { usePathname, useParams, useRouter } from "next/navigation";

import { Settings, Paintbrush } from "lucide-react";
import { useAppContext } from "@/components/context/appContext";
import {
  AssistantSettingsProvider,
  useAssistantSettingsContext,
} from "@/components/context/assistantSettingsContext";
import {
  useGetAssistant,
  useUpdateAssistant,
} from "@/components/context/useAppContext/assistant";
import { TitleLayout } from "@/components/layouts/title-layout";
import { SideDashboardLayout } from "@/components/layouts/side-dashboard-layout";
import { useDashboardLanguage } from "@/components/context/dashboardLanguageContext";

interface AssistantSettingsLayout {
  general: string;
  interface: string;
}

const assistantSettingsLayoutMenu = (
  activityLayout: AssistantSettingsLayout,
) => [
  {
    name: `${activityLayout.general}`,
    href: "general",
    icon: Settings,
  },
  {
    name: `${activityLayout.interface}`,
    href: "interface",
    icon: Paintbrush,
  },
];

function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { t } = useDashboardLanguage();
  const assSettingsMenu = t(
    "app.TEAM.TEAM_ID.ASSISTANT.ASSISTANT_ID.SETTINGS.LAYOUT.menu",
  );
  const assSettings = t(
    "app.TEAM.TEAM_ID.ASSISTANT.ASSISTANT_ID.SETTINGS.LAYOUT",
  );

  const navItems = assistantSettingsLayoutMenu(assSettingsMenu);
  const pathname = usePathname();
  const router = useRouter();
  const comparatePathName = pathname.split("/").slice(1)[5];
  const absolutePath = pathname.split("/").slice(1, 6).join("/");

  const { state } = useAppContext();
  const { data, setAssistantValues } = useAssistantSettingsContext();
  const { updateAssistant } = useUpdateAssistant();
  const { assistantId, teamId } = useParams();

  const { getAssistantData, getAssistant } = useGetAssistant();

  React.useEffect(() => {
    if (state.user?.user.id) {
      getAssistant({
        assistantId: assistantId as string,
        userId: state.user.user.id,
        teamId: teamId as string,
      });
    } else {
      router.push("/login");
    }
  }, []);

  React.useEffect(() => {
    if (getAssistantData?.localAssistant) {
      setAssistantValues(getAssistantData.localAssistant);
    }
  }, [getAssistantData]);

  const saveHandler = async () => {
    if (state.user?.user.id) {
      await updateAssistant({
        assistantId: assistantId as string,
        localAssistantUpdateParams: data,
        userId: state.user.user.id,
        teamId: teamId as string,
      });
    }
  };
  return (
    <TitleLayout
      cardTitle={assSettings.cardTitle}
      cardDescription={assSettings.cardDescription}
      urlPreview={`${process.env.NEXT_PUBLIC_PROTOCOL ? process.env.NEXT_PUBLIC_PROTOCOL : "http://"}${state.teamSelected?.subDomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/${state.teamSelected?.defaultLanguage?.toLocaleLowerCase()}`}
    >
      <>
        <SideDashboardLayout
          navItems={navItems}
          comparatePathName={comparatePathName}
          absolutePath={absolutePath}
          actionButtonOnClick={saveHandler}
        />
        <div className="flex-1 scrollbar-hidden overflow-auto px-4 w-full">
          {children}
        </div>
      </>
    </TitleLayout>
  );
}

export default function ProviderWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AssistantSettingsProvider>
      <Layout>{children}</Layout>
    </AssistantSettingsProvider>
  );
}
