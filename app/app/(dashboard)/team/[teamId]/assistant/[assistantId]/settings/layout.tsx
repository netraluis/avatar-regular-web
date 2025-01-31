"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";

import { useAppContext } from "@/components/context/appContext";
import {
  AssistantSettingsProvider,
  useAssistantSettingsContext,
} from "@/components/context/assistantSettingsContext";
import { useGetAssistant } from "@/components/context/useAppContext/assistant";
import { TitleLayout } from "@/components/layouts/title-layout";
import { useDashboardLanguage } from "@/components/context/dashboardLanguageContext";

function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { t } = useDashboardLanguage();
  const assSettings = t(
    "app.TEAM.TEAM_ID.ASSISTANT.ASSISTANT_ID.SETTINGS.LAYOUT",
  );

  const router = useRouter();

  const { state } = useAppContext();
  const { setAssistantValues } = useAssistantSettingsContext();
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

  return (
    <TitleLayout
      cardTitle={assSettings.cardTitle}
      cardDescription={assSettings.cardDescription}
    >
      <div className="flex-1 scrollbar-hidden overflow-auto px-4 w-full">
        {children}
      </div>
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
