import { CustomCard } from "@/components/custom-card";
import { interfaceText } from "./locale";
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

export const Banner = ({ texts }: { texts: typeof interfaceText.banner }) => {
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
    if (!teamSelected?.headerButton) return;
    const headerButtonData = teamSelected.headerButton?.find(
      (w) => w.language === teamSelected.defaultLanguage,
    );

    const bannerObject = {
      buttonText: headerButtonData?.buttonText || "",
      title: headerButtonData?.title || "",
      text: headerButtonData?.text || [""],
    };
    if (headerButtonData) {
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
      title={interfaceText.banner.title}
      description={interfaceText.banner.description}
    >
      <div className="space-y-2">
        <Label htmlFor="banner-button-text">
          {interfaceText.banner.buttonText}
        </Label>
        {teamSelected ? (
          <Input
            id="banner-button-text"
            placeholder={interfaceText.banner.buttonTextPlaceholder}
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
        <Label htmlFor="banner-title">{interfaceText.banner.titleText}</Label>
        {teamSelected ? (
          <Input
            id="banner-title"
            value={headerButton?.title || ""}
            placeholder={interfaceText.banner.titleTextPlaceholder}
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
        <Label htmlFor="banner-text">{interfaceText.banner.text}</Label>
        {teamSelected ? (
          <Textarea
            placeholder={interfaceText.banner.textDescriptionPlaceholder}
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
          {interfaceText.banner.textDescription}
        </p>
      </div>
      <SaveButton
        action={saveHandler}
        loading={updateTeam.loading}
        actionButtonText={texts.save}
        valueChange={headerButton === headerButtonDefault}
      />
    </CustomCard>
  );
};
