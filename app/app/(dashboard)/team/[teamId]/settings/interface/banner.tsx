import { CustomCard } from "@/components/custom-card";
import { Label } from "@/components/ui/label";
import { useAppContext } from "@/components/context/appContext";
import { Input } from "@/components/ui/input";
import {
  InputCharging,
  TextAreaCharging,
} from "@/components/loaders/loadersSkeleton";
import { useUpdateTeam } from "@/components/context/useAppContext/team";
import { useEffect, useState } from "react";
import { HeaderButton, HeaderButtonType } from "@prisma/client";
import { Textarea } from "@/components/ui/textarea";
import { SaveButton } from "@/components/save-button";
import { useDashboardLanguage } from "@/components/context/dashboardLanguageContext";

export const Banner = () => {
  const { t } = useDashboardLanguage();
  const interfaceText = t("app.TEAM.TEAM_ID.SETTINGS.INTERFACE.PAGE.banner");

  const {
    state: { teamSelected, user },
  } = useAppContext();
  const updateTeam = useUpdateTeam();

  const [headerButton, setHeaderButton] = useState<Pick<
    HeaderButton,
    "buttonText" | "title" | "text"
  > | null>(null);
  const [headerButtonDefault, setHeaderButtonDefault] = useState<Pick<
    HeaderButton,
    "buttonText" | "title" | "text"
  > | null>(null);

  useEffect(() => {
    if (!teamSelected) return;
    const headerButtonData = teamSelected.headerButton?.find(
      (w) => w.language === teamSelected.defaultLanguage,
    );

    const bannerObject = {
      buttonText: headerButtonData?.buttonText || "",
      title: headerButtonData?.title || "",
      text: headerButtonData?.text || [""],
    };

    if (bannerObject) {
      setHeaderButton(bannerObject);
      setHeaderButtonDefault(bannerObject);
    }
  }, [teamSelected]);

  const saveHandler = async () => {
    if (!teamSelected?.id || !headerButton) return;
    const { buttonText, title, text } = headerButton;

    const headerButtonUpdate = {
      upsert: {
        where: {
          language_teamId: {
            language: teamSelected?.defaultLanguage,
            teamId: teamSelected.id,
          },
        },
        update: {
          buttonText,
          title,
          text,
        },
        create: {
          buttonText,
          title,
          type: HeaderButtonType.PLAIN,
          text,
          language: teamSelected?.defaultLanguage,
        },
      },
    };

    if (!teamSelected?.id || !user?.user.id) return;
    await updateTeam.updateTeam(
      teamSelected.id,
      { headerButton: headerButtonUpdate },
      user.user.id,
    );
  };

  return (
    <CustomCard
      title={interfaceText.title}
      description={interfaceText.description}
      action={saveHandler}
      loading={updateTeam.loading}
      valueChange={headerButton !== headerButtonDefault}
    >
      <div className="space-y-2">
        <Label htmlFor="banner-button-text">{interfaceText.buttonText}</Label>
        {teamSelected ? (
          <Input
            id="banner-button-text"
            placeholder={interfaceText.buttonTextPlaceholder}
            // className="min-h-[100px]"
            value={headerButton?.buttonText || ""}
            onChange={(e) => {
              if (!headerButton) return;
              setHeaderButton({
                ...headerButton,
                buttonText: e.target.value,
              });
            }}
          />
        ) : (
          <InputCharging />
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="banner-title">{interfaceText.titleText}</Label>
        {teamSelected ? (
          <Input
            id="banner-title"
            value={headerButton?.title || ""}
            placeholder={interfaceText.titleTextPlaceholder}
            onChange={(e) => {
              if (!headerButton) return;
              setHeaderButton({
                ...headerButton,
                title: e.target.value,
              });
            }}
          />
        ) : (
          <InputCharging />
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="banner-text">{interfaceText.text}</Label>
        {teamSelected ? (
          <Textarea
            placeholder={interfaceText.textDescriptionPlaceholder}
            id="banner-text"
            className="min-h-[100px]"
            value={headerButton?.text[0] || ""}
            onChange={(e) => {
              if (!headerButton) return;
              setHeaderButton({
                ...headerButton,
                text: [e.target.value],
              });
            }}
          />
        ) : (
          <TextAreaCharging />
        )}
        <p className="text-sm text-muted-foreground">
          {interfaceText.textDescription}
        </p>
      </div>
    </CustomCard>
  );
};
