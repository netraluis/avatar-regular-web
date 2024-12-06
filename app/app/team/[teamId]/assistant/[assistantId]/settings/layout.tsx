"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

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

const navItems = [
  { name: "General", href: "general", icon: Settings },
  { name: "Interface", href: "interface", icon: Paintbrush },
];

function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const comparatePathName = pathname.split("/").slice(1)[5];
  const absolutePath = pathname.split("/").slice(1, 6).join("/");

  const { state } = useAppContext();
  const { data, setAssistantValues } = useAssistantSettingsContext();
  const { updateAssistant } = useUpdateAssistant();
  const { assistantId } = useParams();

  const { getAssistantData, getAssistant } = useGetAssistant();

  React.useEffect(() => {
    if (state.user?.user.id) {
      getAssistant({
        assistantId: assistantId as string,
        userId: state.user.user.id,
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
      });
    }
  };
  return (
    <div className="flex flex-col rounded-lg overflow-hidden h-full">
      <div className="flex justify-between">
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Settings</h1>
          </div>
          <p className="text-sm text-gray-500 mb-4">Maneja tus ajustes</p>
        </div>
        <div className="flex justify-between items-center mb-4">
          {/* <Input
            type="text"
            placeholder="Search files..."
            className="max-w-sm"
          /> */}
          <Button onClick={saveHandler}>+ Update profile</Button>
        </div>
      </div>
      <div className="flex bg-white overflow-hidden h-full">
        <div className="w-64 p-4 ">
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
        <div className="flex-1 overflow-y-auto h-full scrollbar-hidden">
          {children}
        </div>
      </div>
    </div>
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
