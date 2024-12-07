import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export interface TitleLayoutProps {
  children: React.ReactNode;
  cardTitle: string;
  cardDescription: string;
}

export const OnlyTitleLayout = ({
  children,
  cardTitle,
  cardDescription,
}: TitleLayoutProps) => {
  return (
    <div className="flex flex-col overflow-auto pt-2 w-full max-w-6xl">
      <div className="flex items-center gap-4 py-1.5 px-1.5">
        <Card className="border-none bg-transparent shadow-none p-0">
          <CardTitle>{cardTitle}</CardTitle>
          <CardDescription>{cardDescription}</CardDescription>
        </Card>
      </div>
      <Separator />
      <div className="grow flex flex-col overflow-auto items-start pt-8 w-full items-center">
        <div className="flex sh-full justify-start overflow-auto gap-8 max-w-screen-xl">
          {children}
        </div>
      </div>
    </div>
  );
};
