import { useAppContext } from "@/components/context/appContext";
// import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TextAreaCharging } from "@/components/loaders/loadersSkeleton";
import { useDashboardLanguage } from "@/components/context/dashboardLanguageContext";

export const MenuHeaderFooter = ({
  loading,
  headerFoot,
  setHeaderFoot,
}: {
  loading: boolean;
  headerFoot: string;
  setHeaderFoot: (headerFoot: string) => void;
}) => {
  const { t } = useDashboardLanguage();
  const texts = t("app.TEAM.TEAM_ID.SETTINGS.INTERFACE.PAGE.menu");
  const {
    state: { teamSelected },
  } = useAppContext();

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="footer-header">{texts.menuFooterTitle}</Label>
          {/* <div className="ml-4 inline-flex items-center justify-center rounded-full bg-sky-500 px-3 py-1 text-sm font-medium text-white">
            Premium
          </div> */}
        </div>
        {/* <Button variant="blue">{texts.menuFooterChangePlan}</Button> */}
      </div>

      {teamSelected && !loading ? (
        <Textarea
          id="footer-header"
          placeholder="Type your message here"
          className="min-h-[100px]"
          value={headerFoot || ""}
          onChange={(e) => {
            if (!teamSelected?.id) return;
            setHeaderFoot(e.target.value);
          }}
        />
      ) : (
        <TextAreaCharging />
      )}
    </div>
  );
};
