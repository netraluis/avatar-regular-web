import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { LoaderCircle, Save } from "lucide-react";
import { useDashboardLanguage } from "./context/dashboardLanguageContext";

export interface CustomCardProps {
  children: React.ReactNode;
  title: string;
  description: string;
  separator?: boolean;
  action?: (e: any) => void;
  loading?: boolean;
  // actionButtonText: string;
  valueChange?: boolean;
}

export const CustomCard = ({
  children,
  title,
  description,
  separator = true,
  action,
  loading,
  // actionButtonText,
  valueChange,
}: CustomCardProps) => {
  const { t } = useDashboardLanguage();
  const texts = t("app.COMPONENTS.CUSTOM_CARD");

  return (
    <Card className="mb-4 w-full h-full flex flex-col overflow-hidden">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {separator && <Separator className="mb-4" />}
      <CardContent className="overflow-auto h-full scrollbar-hidden">{children}</CardContent>
      {action && (
        <>
          <Separator className="mb-4 mt-2" />
          <CardFooter className=" flex justify-end items-center">
            <Button
              size="sm"
              onClick={action}
              disabled={loading || !valueChange}
            >
              {loading ? (
                <>
                  {" "}
                  <LoaderCircle className="h-3.5 w-3.5 animate-spin mr-2" />{" "}
                  <span>{texts.saving}</span>
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5 mr-2" />
                  <span>{texts.save}</span>
                </>
              )}
              {/* <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                {actionButtonText}
              </span> */}
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
};
