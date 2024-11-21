"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye } from "lucide-react";
import { useEffect, useState } from "react";
import EmojiPicker from "@/components/ui/emoji-picker";
import { useAssistantSettingsContext } from "@/components/context/assistantSettingsContext";
import { useAppContext } from "@/components/context/appContext";
import { AssistantCardType } from "@prisma/client";
import { Textarea } from "@/components/ui/textarea";

export default function Interface() {
  const {
    state: { teamSelected },
  } = useAppContext();

  const [selectedEmoji, setSelectedEmoji] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    console.log({ selectedEmoji });
  }, [selectedEmoji]);

  const { data, setData, assistantValues } = useAssistantSettingsContext();

  useEffect(() => {
    console.log({ assistantValues });
    setSelectedEmoji(assistantValues?.emoji || "");
    const card = assistantValues?.assistantCard.find(
      (ass) => ass.language === teamSelected.defaultLanguage,
    );
    setTitle(card?.title || "");
    setDescription(card?.description[0] || "");
  }, [assistantValues]);

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-8 ">
      <Card>
        <CardHeader>
          <CardTitle>Assistant Card</CardTitle>
          <CardDescription>
            This is how others will see you on the site.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
                          language: teamSelected.defaultLanguage,
                        },
                      },
                      update: {
                        title: e.target.value,
                        type: AssistantCardType.REGULAR,
                      },
                      create: {
                        title: e.target.value,
                        type: AssistantCardType.REGULAR,
                        language: teamSelected.defaultLanguage,
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
            <Label htmlFor="description-message">
              Descripción del asistente
            </Label>
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
                          language: teamSelected.defaultLanguage,
                        },
                      },
                      update: {
                        description: [e.target.value],
                        type: AssistantCardType.REGULAR,
                      },
                      create: {
                        description: [e.target.value],
                        type: AssistantCardType.REGULAR,
                        language: teamSelected.defaultLanguage,
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
          {/* ))} */}
          <Button variant="secondary" size="sm" className="gap-2">
            <Eye className="w-4 h-4" />
            Preview
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
