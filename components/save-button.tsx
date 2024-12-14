import { Button } from "@/components/ui/button";
import { LoaderCircle, Save } from "lucide-react";

export const SaveButton = ({
  action,
  loading,
  actionButtonText,
  valueChange,
}: {
  action: (e: any) => void;
  loading: boolean;
  actionButtonText: string;
  valueChange: boolean;
}) => {
  return (
    <div className="flex justify-end items-end">
      <Button size="sm" onClick={action} disabled={loading || valueChange}>
        {loading ? (
          <LoaderCircle className="h-3.5 w-3.5 animate-spin mr-2" />
        ) : (
          <Save className="h-3.5 w-3.5 mr-2" />
        )}
        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
          {actionButtonText}
        </span>
      </Button>
    </div>
  );
};
