import {
  HrefLanguages,
  MenuHeaderType,
  TextHref,
} from "@prisma/client";
import { motion, Reorder } from "framer-motion";
import { GripVertical, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useAppContext } from "@/components/context/appContext";
import { v4 as uuidv4 } from "uuid";
import { TextAreaCharging } from "@/components/loaders/loadersSkeleton";
import { useDashboardLanguage } from "@/components/context/dashboardLanguageContext";

export interface ExtendedTextHref extends TextHref {
  hrefLanguages: HrefLanguages[];
}

export const MenuSettings = ({
  menuType,
  loading,
  menuItems,
  setMenuItems,
}: {
  menuType: MenuHeaderType;
  loading: boolean;
  menuItems: ExtendedTextHref[];
  setMenuItems: (menuItems: ExtendedTextHref[]) => void;
}) => {
  const { t } = useDashboardLanguage();
  const texts = t("app.TEAM.TEAM_ID.SETTINGS.INTERFACE.PAGE.menu");
  const {
    state: { teamSelected },
  } = useAppContext();

  const [menuHeaderId, setMenuHeaderId] = useState<string | null>(null);

  useEffect(() => {
    const menuId =
      teamSelected?.menuHeader?.find((menu) => menu.type === menuType)?.id ||
      uuidv4();
    setMenuHeaderId(menuId);
  }, [teamSelected]);

  const title =
    menuType === MenuHeaderType.HEADER
      ? texts.menuHeaderTitle
      : texts.menuBodyTitle;
  const description =
    menuType === MenuHeaderType.HEADER
      ? texts.menuHeaderTitleDescription
      : texts.menuBodyDescription;

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

  return (
    <>
      {teamSelected && !loading ? (
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
          </div>
        </div>
      ) : (
        <TextAreaCharging />
      )}
    </>
  );
};
