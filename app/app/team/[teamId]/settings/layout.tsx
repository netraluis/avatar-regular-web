"use client";

import * as React from "react";
import { usePathname, useParams } from "next/navigation";
import {
  TeamSettingsProvider,
  useTeamSettingsContext,
} from "@/components/context/teamSettingsContext";

import { Save } from "lucide-react";
import { useUpdateTeam } from "@/components/context/useAppContext/team";
import { useAppContext } from "@/components/context/appContext";

import { SideDashboardLayout } from "@/components/layouts/side-dashboard-layout";
import { TitleLayout } from "@/components/layouts/title-layout";
import { teamsSettingsNav } from "@/lib/helper/navbar";

const teamSettings = {
  cardTitle: "Ajustos de l'equip",
  cardDescription: "Configura l'equip com vulguis",
  actionButtonText: "Desa",
  actionErrorText: "Hi hagut un error al update",
};

function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const comparatePathName = pathname.split("/").slice(1)[3];
  const absolutePath = pathname.split("/").slice(1, 4).join("/");

  const { state } = useAppContext();
  const { teamId } = useParams();
  const { data } = useTeamSettingsContext();
  const { updateTeam, loading, error } = useUpdateTeam();

  const saveHandler = async () => {
    if (state.user?.user.id) {
      await updateTeam(teamId as string, data, state.user.user.id);
    }
  };
  return (
    <TitleLayout
      cardTitle={teamSettings.cardTitle}
      cardDescription={teamSettings.cardDescription}
      urlPreview={`${process.env.PROTOCOL ? process.env.PROTOCOL : "http://"}${state.teamSelected?.subDomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/${state.teamSelected?.defaultLanguage?.toLocaleLowerCase()}`}
      actionButtonText={teamSettings.actionButtonText}
      ActionButtonLogo={Save}
      actionButtonOnClick={saveHandler}
      actionButtonLoading={loading}
      actionErrorText={teamSettings.actionErrorText}
      actionError={error}
    >
      <>
        <SideDashboardLayout
          navItems={teamsSettingsNav}
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
    <TeamSettingsProvider>
      <Layout>{children}</Layout>
    </TeamSettingsProvider>
  );
}
