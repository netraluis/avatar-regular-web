import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConfirmationScreenProps {
  title: string;
  description?: React.ReactNode;
  children?: React.ReactNode;
  loading: boolean;
  backAction: () => void;
  nextAction: () => void;
  backActionText: string;
  nextActionText: string;
  backActionActive: boolean;
  nextActionActive: boolean;
  error: boolean;
  errorText: string;
}

export default function OnboardingBase({
  title,
  description,
  children,
  backAction,
  nextAction,
  backActionText,
  nextActionText,
  backActionActive,
  nextActionActive,
  error,
  errorText,
  loading,
}: ConfirmationScreenProps) {
  return (
    <div className="flex grow items-center justify-center p-4 w-full w-redirect">
      <div className="grow flex flex-col items-start text-start space-y-6">
        <div className="space-y-2 w-full">
          <h1 className="text-2xl font-semibold tracking-tight w-full">
            {title}
          </h1>
          <p className="text-muted-foreground pb-4">{description}</p>
          {children}
        </div>
        <div className="flex justify-between w-full">
          {backActionActive && (
            <Button variant="outline" onClick={backAction} disabled={false}>
              {backActionText}
            </Button>
          )}
          {nextActionActive && (
            <Button onClick={nextAction} disabled={false}>
              {loading && (
                <LoaderCircle className="h-3.5 w-3.5 animate-spin mr-1" />
              )}{" "}
              {nextActionText}
            </Button>
          )}
        </div>
        {error && <p className="text-red-500 pb-4">{errorText}</p>}
      </div>
    </div>
  );
}
