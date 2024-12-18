import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { LoaderCircle, Save } from "lucide-react";

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
  return (
    <Card className="p-2 gap-4 mb-4 w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {separator && <Separator className="mb-4" />}
      <CardContent className="space-y-4">{children}</CardContent>
      {action && (
        <>
          {/* <Separator className="mb-t" /> */}
          <CardFooter className="flex justify-end items-end">
            <Button size="sm" onClick={action} disabled={loading || !valueChange}>
              {loading ? (
                <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5" />
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
