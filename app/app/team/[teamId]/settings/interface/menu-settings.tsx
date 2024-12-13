import { HrefLanguages, MenuHeaderType, TextHref } from "@prisma/client";
import { interfaceText } from "./locale";
import { motion, Reorder } from "framer-motion";
import { GripVertical, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useAppContext } from "@/components/context/appContext";
import { v4 as uuidv4 } from "uuid";
import { useUpdateTeam } from "@/components/context/useAppContext/team";
import { LoaderCircle, Save } from "lucide-react";
import { TextAreaCharging } from "@/components/loaders/loadersSkeleton";

interface ExtendedTextHref extends TextHref {
  hrefLanguages: HrefLanguages[];
}

export function MenuSettings({
  menuType,
  texts,
}: {
  menuType: MenuHeaderType;
  texts: typeof interfaceText.menu;
}) {
  const {
    state: { teamSelected, user },
  } = useAppContext();

  const [menuItems, setMenuItems] = useState<ExtendedTextHref[]>([]);
  const [menuItemsSave, setMenuItemsSave] = useState<ExtendedTextHref[]>([]);
  const [menuHeaderId, setMenuHeaderId] = useState<string | null>(null);

  const updateTeam = useUpdateTeam();

  useEffect(() => {
    const menuItems =
      teamSelected?.menuHeader?.find((menu) => menu.type === menuType)
        ?.textHref || [];
    setMenuItems(menuItems);
    setMenuItemsSave(menuItems);
    const menuId =
      teamSelected?.menuHeader?.find((menu) => menu.type === menuType)?.id ||
      uuidv4();
    setMenuHeaderId(menuId);
  }, [teamSelected]);

  const title =
    menuType === MenuHeaderType.HEADER
      ? interfaceText.menu.menuHeaderTitle
      : interfaceText.menu.menuBodyTitle;
  const description =
    menuType === MenuHeaderType.HEADER
      ? interfaceText.menu.menuHeaderTitleDescription
      : interfaceText.menu.menuBodyDescription;

  const addMenuItem = () => {
    if (!teamSelected?.defaultLanguage) return;
    const textHrefId = uuidv4();
    setMenuItems([
      ...menuItems,
      {
        id: textHrefId,
        numberOrder: 0,
        menuHeaderId: menuHeaderId,
        hrefLanguages: [
          {
            id: uuidv4(),
            text: "",
            href: "",
            language: teamSelected?.defaultLanguage,
            textHrefId: textHrefId,
          },
        ],
      },
    ]);
  };

  const updatePrimaryMenuItem = (
    id: string,
    field: "text" | "href",
    value: string,
  ) => {
    setMenuItems(
      menuItems.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            hrefLanguages: item.hrefLanguages.map((href) =>
              href.textHrefId === id &&
              href.language === teamSelected?.defaultLanguage
                ? { ...href, [field]: value }
                : href,
            ),
          };
        } else {
          return item;
        }
      }),
    );
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems(menuItems.filter((item) => item.id !== id));
  };

  const saveHandler = async () => {
    if (!teamSelected) return;
    const menuHeader = {
      upsert: {
        where: {
          type_teamId: {
            type: menuType, // O el tipo que corresponda
            teamId: teamSelected?.id,
          },
        },
        update: {
          textHref: {
            deleteMany: {
              id: {
                notIn: [],
              },
            },
            create: menuItems.map((item) => {
              console.log({ item });
              return {
                id: item.id,
                numberOrder: menuItems.findIndex((el) => el.id === item.id) + 1,
                hrefLanguages: {
                  create: item.hrefLanguages.map((hrefLanguage) => {
                    console.log({ hrefLanguage });
                    // if(hrefLanguage.language !== teamSelected?.defaultLanguage){
                    //   return {}
                    // }
                    return {
                      text: hrefLanguage.text,
                      href: hrefLanguage.href,
                      language: hrefLanguage.language,
                      // textHrefId: item.id,
                    };
                  }),
                },
              };
            }),
          },
        },
        create: {
          type: menuType,
          textHref: {
            create: menuItems.map((item) => {
              return {
                // text: item.text,
                // href: item.href,
                numberOrder: menuItems.findIndex((el) => el.id === item.id) + 1,
                hrefLanguages: {
                  create: item.hrefLanguages.map((hrefLanguage) => ({
                    // id: hrefLanguage.id,
                    text: hrefLanguage.text,
                    href: hrefLanguage.href,
                    language: hrefLanguage.language,
                    // textHrefId: hrefLanguage.textHrefId,
                  })),
                },
              };
            }),
          },
        },
      },
    };
    if (teamSelected && user?.user.id) {
      await updateTeam.updateTeam(
        teamSelected.id,
        { menuHeader },
        user.user.id,
      );
    }
  };

  return (
    <>
      {teamSelected ? (
        <div className="space-y-2 mb-2">
          <div>
            <h3 className="text-sm font-medium mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{description}</p>
          </div>
          <Reorder.Group
            axis="y"
            values={menuItems}
            onReorder={setMenuItems}
            className="space-y-2 mb-2"
          >
            {menuItems.map((item) => (
              <Reorder.Item key={item.id} value={item}>
                <motion.div className="grid grid-cols-[auto_1fr_2fr_auto] gap-2 items-center">
                  <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                  <Input
                    value={item.hrefLanguages[0]?.text || ""}
                    onChange={(e) =>
                      updatePrimaryMenuItem(item.id, "text", e.target.value)
                    }
                    placeholder="Nombre del enlace"
                  />
                  <Input
                    value={item.hrefLanguages[0]?.href || ""}
                    onChange={(e) =>
                      updatePrimaryMenuItem(item.id, "href", e.target.value)
                    }
                    placeholder="https://example.com"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMenuItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </motion.div>
              </Reorder.Item>
            ))}
          </Reorder.Group>

          <div className="flex justify-between items-end">
            <Button variant="outline" size="sm" onClick={addMenuItem}>
              {texts.addItem}
            </Button>
            <Button
              size="sm"
              onClick={saveHandler}
              disabled={updateTeam.loading || menuItemsSave === menuItems}
            >
              {updateTeam.loading ? (
                <LoaderCircle className="h-3.5 w-3.5 animate-spin mr-2" />
              ) : (
                <Save className="h-3.5 w-3.5 mr-2" />
              )}
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                {interfaceText.menu.save}
              </span>
            </Button>
          </div>
        </div>
      ) : (
        <TextAreaCharging />
      )}
    </>
  );
}
