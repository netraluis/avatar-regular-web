"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import {
  TeamSettingsProvider,
  useTeamSettingsContext,
} from "@/components/context/teamSettingsContext";

import {
  Settings,
  Paintbrush,
  User,
  Gem,
  CreditCard,
  Languages,
  Save,
} from "lucide-react";
import { useUpdateTeam } from "@/components/context/useAppContext/team";
import { useAppContext } from "@/components/context/appContext";
import { HeaderLayout } from "@/components/layouts/title-layout";

const navItems = [
  { name: "General", href: "general", icon: Settings },
  { name: "Interface", href: "interface", icon: Paintbrush },
  { name: "Localisations", href: "localisations", icon: Languages },
  { name: "Members", href: "members", icon: User },
  { name: "Plans", href: "plans", icon: Gem },
  { name: "Billings", href: "billings", icon: CreditCard },
];

const teamSettings = {
  cardTitle: "Ajustos de l'equip",
  cardDescription: "Configura l'equip com vulguis",
  actionButtonText: "Desa",
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
  const { updateTeam } = useUpdateTeam();

  const saveHandler = async () => {
    if (state.user?.user.id) {
      await updateTeam(teamId as string, data, state.user.user.id);
    }
  };
  return (
    <HeaderLayout
      cardTitle={teamSettings.cardTitle}
      cardDescription={teamSettings.cardDescription}
      urlPreview={`${process.env.PROTOCOL ? process.env.PROTOCOL : "http://"}${state.teamSelected?.subDomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/${state.teamSelected?.defaultLanguage?.toLocaleLowerCase()}`}
      actionButtonText={teamSettings.actionButtonText}
      ActionButtonLogo={Save}
      actionButtonOnClick={saveHandler}
    >
      <div className="flex sh-full overflow-auto">
        <div className="w-64 p-4 scrollbar-hidden  overflow-auto flex flex-col">
          <nav>
            {navItems.map((item, index) => (
              <Link
                onClick={saveHandler}
                key={index}
                href={`/${absolutePath}/${item.href}`}
                className={`flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded ${comparatePathName === item.href ? "bg-gray-200" : ""}`}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex-1 scrollbar-hidden overflow-auto">{children}</div>
      </div>
    </HeaderLayout>
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
