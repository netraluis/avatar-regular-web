import { CustomCard } from "@/components/custom-card";
import { interfaceText } from "./locale";
import { Label } from "@/components/ui/label";
import { useAppContext } from "@/components/context/appContext";
import { useUpdateTeam } from "@/components/context/useAppContext/team";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { TextAreaCharging } from "@/components/loaders/loadersSkeleton";
import { SaveButton } from "@/components/save-button";

export const Footer = ({ texts }: { texts: typeof interfaceText.footer }) => {
  const updateTeam = useUpdateTeam();
  const {
    state: { teamSelected, user },
  } = useAppContext();

  const [foot, setFoot] = useState<string>();
  const [footDefault, setFootDefault] = useState<string>();

  useEffect(() => {
    const footer = teamSelected?.footer?.find(
      (foot) => foot.language === teamSelected?.defaultLanguage,
    )?.text;

    setFoot(footer);
    setFootDefault(footer);
  }, [teamSelected]);

  const saveHandler = async () => {
    if (!teamSelected) return;
    const footer = {
      upsert: {
        where: {
          language_teamId: {
            teamId: teamSelected.id,
            language: teamSelected?.defaultLanguage,
          },
        },
        update: {
          text: foot || "",
        },
        create: {
          text: foot || "",
          language: teamSelected.defaultLanguage,
        },
      },
    };
    if (teamSelected && user?.user.id) {
      await updateTeam.updateTeam(teamSelected.id, { footer }, user.user.id);
    }
  };

  return (
    <CustomCard title={texts.title} description={texts.description}>
      <div className="space-y-2">
        <Label htmlFor="footer-message">{interfaceText.footer.text}</Label>
        {teamSelected ? (
          <Textarea
            placeholder={interfaceText.footer.textPlaceholder}
            id="footer-message"
            className="min-h-[100px]"
            value={foot || ""}
            onChange={(e) => {
              setFoot(e.target.value);
            }}
          />
        ) : (
          <TextAreaCharging />
        )}
      </div>

      <SaveButton
        action={saveHandler}
        loading={updateTeam.loading}
        actionButtonText={texts.save}
        valueChange={foot === footDefault}
      />
    </CustomCard>
  );
};