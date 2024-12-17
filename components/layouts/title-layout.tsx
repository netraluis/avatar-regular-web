import { Eye } from "lucide-react";

import Link from "next/link";

import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useDashboardLanguage } from "../context/dashboardLanguageContext";

export interface TitleLayoutProps {
  children: React.ReactNode;
  cardTitle: string;
  cardDescription: string;
  urlPreview: string;
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
  urlPreview,
  // actionButtonText,
  // ActionButtonLogo,
  // actionButtonOnClick,
  // actionButtonLoading,
  // actionErrorText,
  // actionError,
}: TitleLayoutProps) => {
  const { t } = useDashboardLanguage();
  const { preview } = t("app.TEAM.TEAM_ID.SETTINGS.LAYOUT");
  return (
    <div className="flex flex-col overflow-auto p-2 w-full h-full">
      <div className="flex items-center gap-4 py-1.5 px-1.5">
        <Card className="border-none bg-transparent shadow-none py-2 px-4">
          <CardTitle>{cardTitle}</CardTitle>
          <CardDescription>{cardDescription}</CardDescription>
        </Card>
        <div className="ml-auto flex items-center py-2 px-4 gap-2">
          {/* {actionError && (
            <Button variant="alert" disabled>
              {actionErrorText}
            </Button>
          )} */}
          <Button variant="secondary" size="sm">
            <Link
              href={urlPreview}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <Eye className="w-3.5 h-3.5 mr-2" />
              {preview}
            </Link>
          </Button>
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
      <div className="grow flex flex-col overflow-auto items-start mt-3 w-full px-4 items-center">
        <div className="flex sh-full justify-start overflow-auto gap-8 w-full overflow-hidden h-full max-w-screen-xl">
          {children}
        </div>
      </div>
    </div>
  );
};
