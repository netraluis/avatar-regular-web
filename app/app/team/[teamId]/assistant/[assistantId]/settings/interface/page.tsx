"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import EmojiPicker from "@/components/ui/emoji-picker";
import { useAssistantSettingsContext } from "@/components/context/assistantSettingsContext";
import { useAppContext } from "@/components/context/appContext";
import { AssistantCardType, LanguageType } from "@prisma/client";
import { Textarea } from "@/components/ui/textarea";
import { CustomCard } from "@/components/custom-card";
import {
  InputCharging,
  TextAreaCharging,
} from "@/components/loaders/loadersSkeleton";

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
    description: "Descripció de l’assistent",
    descriptionPlaceholder:
      "Escriu una descripció detallada (p. ex.: “Et puc ajudar amb preguntes sobre productes, comandes o problemes tècnics”).",
    descriptionDescription:
      "Explica breument què fa el teu assistent i com pot ajudar als usuaris",
  },
};

export default function Interface() {
  const {
    state: { teamSelected },
  } = useAppContext();

  const [selectedEmoji, setSelectedEmoji] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const { data, setData, assistantValues } = useAssistantSettingsContext();

  useEffect(() => {
    setSelectedEmoji(assistantValues?.emoji || "");
    const card = assistantValues?.assistantCard.find(
      (ass) => ass.language === teamSelected?.defaultLanguage,
    );
    setTitle(card?.title || "");
    setDescription(card?.description[0] || "");
  }, [assistantValues]);

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
              setData({ ...data, emoji: emoji });
            }}
            selectedEmoji={selectedEmoji}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="title-message">
            {assistantInterface.emoji.title}
          </Label>
          {teamSelected ? (
            <Input
              id="title-message"
              placeholder={assistantInterface.emoji.titlePlaceholder}
              className=""
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setData({
                  ...data,
                  assistantCard: {
                    upsert: {
                      where: {
                        language_assistantId: {
                          assistantId: assistantValues!.id,
                          language:
                            teamSelected?.defaultLanguage || LanguageType.ES,
                        },
                      },
                      update: {
                        title: e.target.value,
                        type: AssistantCardType.REGULAR,
                      },
                      create: {
                        title: e.target.value,
                        type: AssistantCardType.REGULAR,
                        language:
                          teamSelected?.defaultLanguage || LanguageType.ES,
                      },
                    },
                  },
                });
              }}
            />
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
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setData({
                  ...data,
                  assistantCard: {
                    upsert: {
                      where: {
                        language_assistantId: {
                          assistantId: assistantValues!.id,
                          language:
                            teamSelected?.defaultLanguage || LanguageType.ES,
                        },
                      },
                      update: {
                        description: [e.target.value],
                        type: AssistantCardType.REGULAR,
                      },
                      create: {
                        description: [e.target.value],
                        type: AssistantCardType.REGULAR,
                        language:
                          teamSelected?.defaultLanguage || LanguageType.ES,
                      },
                    },
                  },
                });
              }}
            />
          ) : (
            <TextAreaCharging />
          )}
          <p className="text-sm text-muted-foreground">
            {assistantInterface.emoji.descriptionDescription}
          </p>
        </div>
      </CustomCard>
    </div>
  );
}
