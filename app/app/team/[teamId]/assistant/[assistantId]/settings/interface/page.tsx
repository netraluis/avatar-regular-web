"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import EmojiPicker from "@/components/ui/emoji-picker";
import { useAssistantSettingsContext } from "@/components/context/assistantSettingsContext";
import { useAppContext } from "@/components/context/appContext";
import { AssistantCardType, LanguageType } from "@prisma/client";
import { Textarea } from "@/components/ui/textarea";
import { CustomCard } from "@/components/custom-card";

const assistantInterface = {
  title: "Ensenyar la teva pàgina",
  desription: "Comparteix la teva pàgina amb els teus amics.",
  chat: {
    title: "Ajusta el teu domini personalitzat",
    description: "Això és com et veuran els altres al lloc.",
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
          <Label htmlFor="title-message">Título</Label>
          <Input
            id="title-message"
            placeholder="Escribe tu título"
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
          <p className="text-sm text-muted-foreground">
            Your message will be copied to the support team.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description-message">Descripción del asistente</Label>
          <Textarea
            id="description-message"
            placeholder="Escribe tu descripción"
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
          <p className="text-sm text-muted-foreground">
            Your message will be copied to the support team.
          </p>
        </div>
      </CustomCard>
    </div>
  );
}
