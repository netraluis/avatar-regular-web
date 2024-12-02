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
    <Card className="p-2 gap-4">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {separator && <Separator className="mb-4" />}
      <CardContent>{children}</CardContent>
    </Card>
  );
};
