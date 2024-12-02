import { Eye } from "lucide-react";

import { useRouter } from "next/navigation";
import Link from "next/link";

import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export interface TitleLayoutProps {
  children: React.ReactNode;
  cardTitle: string;
  cardDescription: string;
  urlPreview: string;
  actionButtonText: string;
  ActionButtonLogo: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  actionButtonOnClick: () => void;
}

export const TitleLayout = ({
  children,
  cardTitle,
  cardDescription,
  urlPreview,
  actionButtonText,
  ActionButtonLogo,
  actionButtonOnClick,
}: TitleLayoutProps) => {
  const router = useRouter();
  const handlePreview = () => {
    router.push(urlPreview);
  };

  return (
    <div className="flex flex-col overflow-auto mx-4 py-2 max-w-6xl">
      <div className="flex items-center gap-4 py-1.5 px-1.5">
        <Card className="border-none bg-transparent shadow-none p-0">
          <CardTitle>{cardTitle}</CardTitle>
          <CardDescription>{cardDescription}</CardDescription>
        </Card>
        <div className="ml-auto flex items-center py-2 px-4 gap-2">
          <Button variant="secondary" size="sm" onClick={handlePreview}>
            <Link
              href={urlPreview}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <Eye className="w-3.5 h-3.5" />
              Preview
            </Link>
          </Button>
          <Button
            size="sm"
            className="h-8 py-2 px-4 gap-2"
            onClick={actionButtonOnClick}
          >
            <ActionButtonLogo className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              {actionButtonText}
            </span>
          </Button>
        </div>
      </div>
      <Separator />
      <div className="grow flex flex-col overflow-auto items-start p-4 m-4">
        {children}
      </div>
    </div>
  );
};
