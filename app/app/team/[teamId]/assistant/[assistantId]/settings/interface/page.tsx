"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import EmojiPicker from "@/components/ui/emoji-picker";
import { useAppContext } from "@/components/context/appContext";
import { AssistantCardType, LanguageType } from "@prisma/client";
import { Textarea } from "@/components/ui/textarea";
import { CustomCard } from "@/components/custom-card";
import {
  InputCharging,
  TextAreaCharging,
} from "@/components/loaders/loadersSkeleton";
import { useUpdateAssistant } from "@/components/context/useAppContext/assistant";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SaveButton } from "@/components/save-button";

const assistantInterface = {
  title: "Personalitza la targeta del teu assistent",
  desription:
    "Crea una targeta atractiva per al teu assistent afegint un emoji, un títol i una descripció. Aquesta informació ajudarà els usuaris a entendre millor el propòsit i la personalitat del teu assistent.",
  emoji: {
    title: "Emoji de l’assistent",
    titlePlaceholder:
      "Escriu un títol per al teu assistent (p. ex.: Assistència al client).",
    titleDesciptiontion:
      "Aquest títol serà visible per als usuaris i ha de descriure breument el propòsit del teu assistent.",
    saveTitle: "Desa títol",
    description: "Descripció de l’assistent",
    descriptionPlaceholder:
      "Escriu una descripció detallada (p. ex.: “Et puc ajudar amb preguntes sobre productes, comandes o problemes tècnics”).",
    descriptionDescription:
      "Explica breument què fa el teu assistent i com pot ajudar als usuaris",
    saveButton: "Desa descripció",
  },
};

export default function Interface() {
  const { teamId, assistantId } = useParams();
  const {
    state: { teamSelected, assistantSelected, user },
  } = useAppContext();

  const [cardId, setCardId] = useState<string | undefined>(undefined);
  const [selectedEmoji, setSelectedEmoji] = useState<string>("");
  const [title, setTitle] = useState<{
    title: string;
    loading: boolean;
    saveTitle: string;
  } | null>(null);
  const [description, setDescription] = useState<{
    description: string;
    loading: boolean;
    saveDescription: string;
  } | null>(null);

  // const { assistantValues } = useAssistantSettingsContext();
  const updateAssistant = useUpdateAssistant();

  useEffect(() => {
    console.log({ assistantSelected });
    setSelectedEmoji(assistantSelected?.localAssistant?.emoji || "");
    const card = assistantSelected?.localAssistant?.assistantCard?.find(
      (ass) => ass.language === teamSelected?.defaultLanguage,
    );
    setTitle({
      loading: false,
      title: card?.title || "",
      saveTitle: card?.title || "",
    });
    setDescription({
      loading: false,
      description: card?.description[0] || "",
      saveDescription: card?.description[0] || "",
    });
    setCardId(card?.id);
  }, [assistantSelected?.localAssistant]);

  const titleHandler = async () => {
    if (!title || !cardId) return;
    const assistantCard = {
      upsert: {
        where: {
          id: cardId,
        },
        update: {
          title: title.title,
          type: AssistantCardType.REGULAR,
        },
        create: {
          title: title.title,
          type: AssistantCardType.REGULAR,
          language: teamSelected?.defaultLanguage || LanguageType.ES,
        },
      },
    };

    if (user?.user.id && assistantSelected?.localAssistant?.name) {
      setTitle({ ...title, loading: true });
      await updateAssistant.updateAssistant({
        teamId: teamId as string,
        assistantId: assistantId as string,
        userId: user.user.id,
        localAssistantUpdateParams: { assistantCard },
      });
      setTitle({ ...title, loading: false });
    }
  };

  const descriptionHandler = async () => {
    if (!description) return;
    if (user?.user.id && assistantSelected?.localAssistant?.name) {
      const assistantCard = {
        upsert: {
          where: {
            language_assistantId: {
              assistantId: assistantSelected?.localAssistant?.id,
              language: teamSelected?.defaultLanguage || LanguageType.ES,
            },
          },
          update: {
            description: [description.description],
            type: AssistantCardType.REGULAR,
          },
          create: {
            description: [description.description],
            type: AssistantCardType.REGULAR,
            language: teamSelected?.defaultLanguage || LanguageType.ES,
          },
        },
      };

      setDescription({ ...description, loading: true });
      await updateAssistant.updateAssistant({
        teamId: teamId as string,
        assistantId: assistantId as string,
        userId: user.user.id,
        localAssistantUpdateParams: { assistantCard },
      });
      setDescription({ ...description, loading: false });
    }
  };

  return (
    <div className="space-y-8 ">
      <CustomCard
        title={assistantInterface.title}
        description={assistantInterface.desription}
      >
        <div className="space-y-2">
          <EmojiPicker
            onEmojiSelect={(emoji) => {
              setSelectedEmoji(emoji);
              // setData({ ...data, emoji: emoji });
              if (user?.user.id) {
                updateAssistant.updateAssistant({
                  teamId: teamId as string,
                  assistantId: assistantId as string,
                  userId: user.user.id,
                  localAssistantUpdateParams: { emoji },
                });
              }
            }}
            selectedEmoji={selectedEmoji}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="title-message">
            {assistantInterface.emoji.title}
          </Label>
          {title ? (
            <div className="flex items-center space-x-2">
              <Input
                id="title-message"
                placeholder={assistantInterface.emoji.titlePlaceholder}
                value={title?.title || ""}
                onChange={(e) => {
                  if (!title) return;
                  setTitle({ ...title, title: e.target.value });
                }}
              />
              <Button
                onClick={titleHandler}
                variant="outline"
                disabled={title?.loading || title?.title === title?.saveTitle}
              >
                {assistantInterface.emoji.saveTitle}
              </Button>
            </div>
          ) : (
            <InputCharging />
          )}
          <p className="text-sm text-muted-foreground">
            {assistantInterface.emoji.titleDesciptiontion}
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description-message">
            {assistantInterface.emoji.description}
          </Label>
          {teamSelected ? (
            <Textarea
              id="description-message"
              placeholder={assistantInterface.emoji.descriptionPlaceholder}
              className="min-h-[100px]"
              value={description?.description || ""}
              onChange={(e) => {
                if (!description) return;
                setDescription({ ...description, description: e.target.value });
              }}
            />
          ) : (
            <TextAreaCharging />
          )}
          <SaveButton
            action={descriptionHandler}
            loading={description?.loading || false}
            actionButtonText={assistantInterface.emoji.saveButton}
            valueChange={
              description?.description === description?.saveDescription
            }
          />
          <p className="text-sm text-muted-foreground">
            {assistantInterface.emoji.descriptionDescription}
          </p>
        </div>
      </CustomCard>
    </div>
  );
}
