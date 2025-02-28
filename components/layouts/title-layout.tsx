import { Eye, Plus } from "lucide-react";

import Link from "next/link";

import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useDashboardLanguage } from "../context/dashboardLanguageContext";
import { useParams } from "next/navigation";
import { useAppContext } from "../context/appContext";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";

export interface TitleLayoutProps {
  children: React.ReactNode;
  cardTitle: string;
  cardDescription: string;
  // urlPreview: string;
  // actionButtonText: string;
  // ActionButtonLogo: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  // actionButtonOnClick: () => void;
  // actionButtonLoading: boolean;
  // actionErrorText: string;
  // actionError: any;
}

export const TitleLayout = ({
  children,
  cardTitle,
  cardDescription,
  // urlPreview,
  // actionButtonText,
  // ActionButtonLogo,
  // actionButtonOnClick,
  // actionButtonLoading,
  // actionErrorText,
  // actionError,
}: TitleLayoutProps) => {
  const { t } = useDashboardLanguage();
  const { preview, createAssistant } = t("app.COMPONENTS.TITLE_LAYOUT");
  const {
    state: { teamSelected, assistantSelected },
  } = useAppContext();
  const { assistantId, teamId } = useParams();
  const createNewAssUrl = `/team/${teamId}/assistant/new`;
  const assistantUrl =
    assistantId && assistantSelected?.localAssistant?.url
      ? assistantSelected?.localAssistant?.url
      : "";
  const urlPreview = `${process.env.NEXT_PUBLIC_PROTOCOL ? process.env.NEXT_PUBLIC_PROTOCOL : "http://"}${teamSelected?.subDomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/${teamSelected?.defaultLanguage?.toLocaleLowerCase()}/${assistantUrl}`;

  const { state } = useSidebar();

  // console.log({hook})

  return (
    <div className="flex flex-col overflow-auto p-2 w-full h-full">
      <div className="flex items-center gap-4 py-1.5 px-1.5">
        <div className="flex">
          <SidebarTrigger
            className={`${state === "expanded" ? "mt-1.5 " : "hidden"}`}
          />
          <Card className="border-none bg-transparent shadow-none py-2 px-4">
            <CardTitle>{cardTitle}</CardTitle>
            <CardDescription className="hidden md:block">{cardDescription}</CardDescription>
          </Card>
        </div>
        <div className="ml-auto flex items-center py-2 px-4 gap-2 flex-wrap justify-end">
          {/* {actionError && (
            <Button variant="alert" disabled>
              {actionErrorText}
            </Button>
          )} */}

          <div className="flex justify-end gap-2 flex-wrap">
            <Button variant="secondary" size="sm">
              <Link
                href={urlPreview}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden ml-2 md:block">{preview}</span>
              </Link>
            </Button>
            {!assistantId && teamId && (
              <Button size="sm">
                <Link
                  href={createNewAssUrl}
                  // target="_blank"
                  // rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span className="hidden ml-2 sm:block">{createAssistant}</span>
                </Link>
              </Button>
            )}

          </div>

          {/* <Button
            size="sm"
            className="h-8 py-2 px-4 gap-2"
            onClick={actionButtonOnClick}
            disabled={actionButtonLoading}
          >
            {actionButtonLoading ? (
              <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <ActionButtonLogo className="h-3.5 w-3.5" />
            )}
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              {actionButtonText}
            </span>
          </Button> */}
        </div>
      </div>
      <Separator />
      <div className="grow flex flex-col h-full overflow-hidden mt-3 w-full px-4 items-center">
        <div className="flex sh-full justify-center gap-8 w-full overflow-hidden h-full max-w-screen-xl">
          {children}
        </div>
      </div>
    </div>
  );
};
