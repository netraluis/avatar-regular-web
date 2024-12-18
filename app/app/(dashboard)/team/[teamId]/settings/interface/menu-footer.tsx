import { useAppContext } from "@/components/context/appContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TextAreaCharging } from "@/components/loaders/loadersSkeleton";
import { SaveButton } from "@/components/save-button";
import { useUpdateTeam } from "@/components/context/useAppContext/team";
import { useEffect, useState } from "react";
import { MenuFooter } from "@prisma/client";
import { useDashboardLanguage } from "@/components/context/dashboardLanguageContext";

export const MenuHeaderFooter = () => {
  const { t } = useDashboardLanguage();
  const texts = t("app.TEAM.TEAM_ID.SETTINGS.INTERFACE.PAGE.menu");
  
  const {
    state: { teamSelected, user },
  } = useAppContext();
  const updateTeam = useUpdateTeam();

  const [headerFoot, setHeaderFoot] = useState<string>("");
  const [headerFootDefault, setHeaderFootDefault] = useState<string>("");

  useEffect(() => {
    const headerFooter = teamSelected?.menuFooter?.find(
      (menuFooter: MenuFooter) =>
        menuFooter.language === teamSelected?.defaultLanguage,
    )?.text;

    setHeaderFootDefault(headerFooter || "");
    setHeaderFoot(headerFooter || "");
  }, [teamSelected]);

  const saveHandler = async () => {
    if (!teamSelected) return;
    const menuFooter = {
      upsert: {
        where: {
          language_teamId: {
            teamId: teamSelected.id,
            language: teamSelected?.defaultLanguage,
          },
        },
        update: {
          text: headerFoot,
        },
        create: {
          text: headerFoot,
          language: teamSelected?.defaultLanguage,
        },
      },
    };
    if (teamSelected && user?.user.id) {
      await updateTeam.updateTeam(
        teamSelected.id,
        { menuFooter },
        user.user.id,
      );
    }
  };

  return (
    <>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="footer-header">
              {texts.menuFooterTitle}
            </Label>
            <div className="ml-4 inline-flex items-center justify-center rounded-full bg-sky-500 px-3 py-1 text-sm font-medium text-white">
              Premium
            </div>
          </div>
          <Button variant="blue">
            {texts.menuFooterChangePlan}
          </Button>
        </div>

        {teamSelected ? (
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

        <SaveButton
          action={saveHandler}
          loading={updateTeam.loading}
          actionButtonText={texts.save}
          valueChange={headerFoot === headerFootDefault}
        />
      </div>
    </>
  );
};
