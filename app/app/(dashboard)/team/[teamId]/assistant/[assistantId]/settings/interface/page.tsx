"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import EmojiPicker from "@/components/ui/emoji-picker";
import { useAppContext } from "@/components/context/appContext";
import {
  AssistantCardType,
  EntryPointsType,
  LanguageType,
  Prisma,
} from "@prisma/client";
import { Textarea } from "@/components/ui/textarea";
import { CustomCard } from "@/components/custom-card";
import {
  InputCharging,
  TextAreaCharging,
} from "@/components/loaders/loadersSkeleton";
import { useUpdateAssistant } from "@/components/context/useAppContext/assistant";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useDashboardLanguage } from "@/components/context/dashboardLanguageContext";
import { Trash2 } from "lucide-react";
import { ExtendedEntryPoint, MenuSettings } from "./menu-settings";

export default function Interface() {
  const { t } = useDashboardLanguage();
  const assistantInterface = t(
    "app.TEAM.TEAM_ID.ASSISTANT.ASSISTANT_ID.SETTINGS.INTERFACE",
  );

  const { teamId, assistantId } = useParams();
  const {
    state: { teamSelected, assistantSelected, user },
  } = useAppContext();

  const [cardId, setCardId] = useState<string | undefined>(undefined);
  const [selectedEmoji, setSelectedEmoji] = useState<{
    emoji: string | null;
    loading: boolean;
    saveEmoji: string;
  } | null>(null);
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

  const [loadingAssistant, setLoadingAssistant] = useState(false);

  const [menuItems, setMenuItems] = useState<ExtendedEntryPoint[]>([]);
  const [menuItemsSave, setMenuItemsSave] = useState<ExtendedEntryPoint[]>([]);
  const [loadingMenu, setLoadingMenu] = useState(false);

  // const { assistantValues } = useAssistantSettingsContext();
  const updateAssistant = useUpdateAssistant();

  useEffect(() => {
    if (assistantSelected && teamSelected) {
      setSelectedEmoji({
        emoji: assistantSelected?.localAssistant?.emoji || "",
        loading: false,
        saveEmoji: assistantSelected?.localAssistant?.emoji || "",
      });
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

      const entryPoint = assistantSelected?.localAssistant?.entryPoints.find(
        (point) => point.type === EntryPointsType.REGULAR,
      )?.entryPoint;
      setMenuItems(entryPoint || []);
      setMenuItemsSave(entryPoint || []);
    }
  }, [assistantSelected]);

  const updateHandler = async () => {
    setLoadingAssistant(true);
    const localAssistantUpdateParams: Prisma.AssistantUpdateInput = {};
    if (selectedEmoji?.emoji !== selectedEmoji?.saveEmoji) {
      localAssistantUpdateParams.emoji = selectedEmoji?.emoji;
    }

    if (
      (title?.title !== title?.saveTitle ||
        description?.description !== description?.saveDescription) &&
      assistantSelected?.localAssistant?.id
    ) {
      const update: {
        title?: string;
        description?: [string];
      } = {};

      if (title?.title !== title?.saveTitle && cardId) {
        update.title = title?.title || "";
      }

      if (description?.description !== description?.saveDescription) {
        update.description = [description?.description || ""];
      }

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
    }

    if (user?.user.id) {
      await updateAssistant.updateAssistant({
        teamId: teamId as string,
        assistantId: assistantId as string,
        userId: user.user.id,
        localAssistantUpdateParams,
      });
    }
    setLoadingAssistant(false);
  };

  const createMenuUpsert = (
    menuItems: ExtendedEntryPoint[],
    menuType: EntryPointsType,
    assistantId: string,
  ) => {
    return {
      where: {
        assistantId_type: {
          type: menuType,
          assistantId: assistantId,
        },
      },
      update: {
        entryPoint: {
          deleteMany: {
            id: {
              notIn: [],
            },
          },
          create: menuItems.map((item) => {
            return {
              id: item.id,
              numberOrder: menuItems.findIndex((el) => el.id === item.id) + 1,
              entryPointLanguages: {
                create: item.entryPointLanguages.map((entryPointLanguage) => {
                  return {
                    text: entryPointLanguage.text,
                    question: entryPointLanguage.question,
                    language: entryPointLanguage.language,
                  };
                }),
              },
            };
          }),
        },
      },
      create: {
        type: menuType,
        entryPoint: {
          create: menuItems.map((item) => {
            return {
              // text: item.text,
              // href: item.href,
              numberOrder: menuItems.findIndex((el) => el.id === item.id) + 1,
              entryPointLanguages: {
                create: item.entryPointLanguages.map((entryPointLanguage) => ({
                  // id: hrefLanguage.id,
                  text: entryPointLanguage.text,
                  question: entryPointLanguage.question,
                  language: entryPointLanguage.language,
                  // textHrefId: hrefLanguage.textHrefId,
                })),
              },
            };
          }),
        },
      },
    };
  };

  const menuSaveHandler = async () => {
    const localAssistantUpdateParams: Prisma.AssistantUpdateInput = {};
    setLoadingMenu(true);
    if (!assistantSelected) return;
    const entryPoints = [];
    if (menuItemsSave !== menuItems) {
      entryPoints.push(
        createMenuUpsert(
          menuItems,
          EntryPointsType.REGULAR,
          assistantSelected.localAssistant?.id || "",
        ),
      );
    }

    localAssistantUpdateParams.entryPoints = { upsert: entryPoints };

    if (assistantSelected.localAssistant?.id) {
      await updateAssistant.updateAssistant({
        teamId: teamId as string,
        assistantId: assistantId as string,
        userId: user?.user.id || "",
        localAssistantUpdateParams: localAssistantUpdateParams,
      });
    }
    // if (teamSelected && user?.user.id) {
    //   await updateTeam.updateTeam(teamSelected.id, updateObject, user.user.id);
    // }
    setLoadingMenu(false);
  };

  return (
    <div className="space-y-8">
      <CustomCard
        title={assistantInterface.title}
        description={assistantInterface.desription}
        action={updateHandler}
        loading={loadingAssistant}
        valueChange={
          selectedEmoji?.emoji !== selectedEmoji?.saveEmoji ||
          title?.title !== title?.saveTitle ||
          description?.description !== description?.saveDescription
        }
      >
        {selectedEmoji ? (
          <div className="flex">
            <EmojiPicker
              onEmojiSelect={(emoji) => {
                setSelectedEmoji({ ...selectedEmoji, emoji: emoji || "" });
              }}
              selectedEmoji={selectedEmoji.emoji || ""}
            />
            {selectedEmoji.emoji && (
              <Button
                onClick={() =>
                  setSelectedEmoji({ ...selectedEmoji, emoji: null })
                }
                variant="outline"
                className="ml-4"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}

            {/* <Button className='border' onClick={()=>setSelectedEmoji({ ...selectedEmoji, emoji: null })}>Delete</Button> */}
          </div>
        ) : (
          <InputCharging />
        )}
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
          {description ? (
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
          <p className="text-sm text-muted-foreground">
            {assistantInterface.emoji.descriptionDescription}
          </p>
        </div>
      </CustomCard>
      <CustomCard
        title={"assistantInterface.menu.title"}
        description={"assistantInterface.menu.description"}
        loading={loadingMenu}
        valueChange={menuItemsSave !== menuItems}
        action={menuSaveHandler}
      >
        <MenuSettings
          loading={loadingMenu}
          menuItems={menuItems}
          setMenuItems={setMenuItems}
        />
      </CustomCard>
    </div>
  );
}
