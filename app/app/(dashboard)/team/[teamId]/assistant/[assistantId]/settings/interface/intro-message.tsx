import { CustomCard } from "@/components/custom-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Reorder, motion } from "framer-motion";
import { Trash2, GripVertical } from "lucide-react";
import { useAppContext } from "@/components/context/appContext";
import { useEffect, useState } from "react";
import { useDashboardLanguage } from "@/components/context/dashboardLanguageContext";
import { AssistantCardType, Prisma } from "@prisma/client";
import { LanguageType } from "@prisma/client";
import { useParams } from "next/navigation";
import { useUpdateAssistant } from "@/components/context/useAppContext/assistant";

export function IntroMessage() {
  const { t } = useDashboardLanguage();
  const texts = t("app.TEAM.TEAM_ID.SETTINGS.INTERFACE.PAGE");
  const { teamId, assistantId } = useParams();

  const {
    state: { teamSelected, user, assistantSelected },
  } = useAppContext();

  const updateAssistant = useUpdateAssistant();
  const [introText, setIntroText] = useState<string[]>([""]);
  const [introWelcomeText, setIntroDefaultText] = useState<string[]>([""]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (teamSelected && assistantSelected) {
      const card = assistantSelected?.localAssistant?.assistantCard?.find(
        (ass) => ass.language === teamSelected?.defaultLanguage,
      );
      // Use description array instead of introMessage
      const introMessage = card?.introMessage || [""];
      setIntroDefaultText(introMessage);
      setIntroText(introMessage);
    }
  }, [assistantSelected]);

  const updateWelcome = (index: number, value: string) => {
    const updateWelcome = [...introText];
    updateWelcome[index] = value;
    setIntroText(updateWelcome);
  };

  const deleteWelcome = (index: number) => {
    const newWel = introText.splice(index, 1);
    setIntroText(newWel);
  };

  const addWelcome = () => {
    setIntroText([...introText, ""]);
  };

  const saveHandler = async () => {
    setLoading(true);

    const localAssistantUpdateParams: Prisma.AssistantUpdateInput = {};

    const update: {
      introMessage?: string[];
    } = {};

    if (introText !== introWelcomeText) {
      update.introMessage = introText;
    }

    if (!assistantSelected?.localAssistant?.id) return;

    const assistantCard = {
      upsert: {
        where: {
          language_assistantId: {
            assistantId: assistantSelected?.localAssistant?.id,
            language: teamSelected?.defaultLanguage || LanguageType.ES,
          },
        },
        update: {
          ...update,
          type: AssistantCardType.REGULAR,
        },
        create: {
          ...update,
          type: AssistantCardType.REGULAR,
          language: teamSelected?.defaultLanguage || LanguageType.ES,
        },
      },
    };

    localAssistantUpdateParams.assistantCard = assistantCard;

    if (user?.user.id) {
      await updateAssistant.updateAssistant({
        teamId: teamId as string,
        assistantId: assistantId as string,
        userId: user.user.id,
        localAssistantUpdateParams,
      });
    }
    setLoading(false);
  };

  return (
    <CustomCard
      title={texts.title}
      description={texts.description}
      action={saveHandler}
      loading={loading}
      valueChange={
        JSON.stringify(introText) !== JSON.stringify(introWelcomeText)
      }
    >
      <div className="space-y-2">
        <Label htmlFor="welcome-message">
          {texts.welcomeMessage.linesTitle}
        </Label>
        <Reorder.Group
          axis="y"
          values={introText}
          onReorder={setIntroText}
          className="space-y-2"
        >
          {introText.map((item, index) => (
            <Reorder.Item key={index} value={item}>
              <motion.div
                className="grid grid-cols-[auto__auto_1fr_auto] gap-2 items-center"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <GripVertical className="h-4 text-muted-foreground cursor-grab active:cursor-grabbing" />
                <p>
                  {texts.welcomeMessage.line} {index + 1}
                </p>
                <Input
                  value={item}
                  onChange={(e) => {
                    updateWelcome(index, e.target.value);
                  }}
                  placeholder="Label name"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteWelcome(index)}
                >
                  <Trash2 className="w-4 h-4 text-muted-foreground" />
                </Button>
              </motion.div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
        <Button variant="outline" size="sm" onClick={addWelcome}>
          {texts.welcomeMessage.addLine}
        </Button>
        <p className="text-sm text-muted-foreground">
          {texts.welcomeMessage.lineDescription}
        </p>
      </div>
    </CustomCard>
  );
}
