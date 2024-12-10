import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { HeaderDisclaimer } from "./context/globalContext";

const Disclaimer = ({ data }: { data: HeaderDisclaimer | null }) => {
  if (!data) {
    return <></>;
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger className="text-slate-400 hover:text-slate-500">
        {data?.buttonText || ""}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{data?.title || ""}</AlertDialogTitle>
          <AlertDialogDescription className="max-h-80 overflow-auto p-2">
            <div
              dangerouslySetInnerHTML={{ __html: data?.description || "" }}
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>Ok</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Disclaimer;
