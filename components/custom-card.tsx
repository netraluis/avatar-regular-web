import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "./ui/separator";

export interface CustomCardProps {
  children: React.ReactNode;
  title: string;
  description: string;
  separator?: boolean;
}

export const CustomCard = ({
  children,
  title,
  description,
  separator = true,
}: CustomCardProps) => {
  return (
    <Card className="p-2 gap-4 mb-4 w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {separator && <Separator className="mb-4" />}
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
};
