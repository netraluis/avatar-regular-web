import { EntryPoint, EntryPointLanguages } from "@prisma/client";
import { motion, Reorder } from "framer-motion";
import { GripVertical, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useAppContext } from "@/components/context/appContext";
import { v4 as uuidv4 } from "uuid";
import { TextAreaCharging } from "@/components/loaders/loadersSkeleton";
import { useDashboardLanguage } from "@/components/context/dashboardLanguageContext";

export interface ExtendedEntryPoint extends EntryPoint {
  entryPointLanguages: EntryPointLanguages[];
}

export const MenuSettings = ({
  loading,
  menuItems,
  setMenuItems,
}: {
  loading: boolean;
  menuItems: ExtendedEntryPoint[];
  setMenuItems: (menuItems: ExtendedEntryPoint[]) => void;
}) => {
  const { t } = useDashboardLanguage();
  const texts = t("app.TEAM.TEAM_ID.SETTINGS.INTERFACE.PAGE.menu");
  const {
    state: { teamSelected, assistantSelected },
  } = useAppContext();

  const [menuHeaderId, setMenuHeaderId] = useState<string | null>(null);

  useEffect(() => {
    const menuId =
      assistantSelected?.localAssistant?.entryPoints[0]?.id || uuidv4();
    setMenuHeaderId(menuId);
  }, [assistantSelected]);

  // const title = "titulo";
  // const description = "descripcion";

  const addMenuItem = () => {
    if (!teamSelected?.defaultLanguage) return;
    const questionId = uuidv4();
    setMenuItems([
      ...menuItems,
      {
        id: questionId,
        numberOrder: 0,
        entryPointId: menuHeaderId,
        entryPointLanguages: [
          {
            id: uuidv4(),
            text: "",
            question: "",
            language: teamSelected?.defaultLanguage,
            entryPointId: questionId,
          },
        ],
      },
    ]);
  };

  const updatePrimaryMenuItem = (
    id: string,
    field: "text" | "question",
    value: string,
  ) => {
    setMenuItems(
      menuItems.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            entryPointLanguages: item.entryPointLanguages.map((entryPoint) =>
              entryPoint.entryPointId === id &&
              entryPoint.language === teamSelected?.defaultLanguage
                ? { ...entryPoint, [field]: value }
                : entryPoint,
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
          {/* <div>
            <h3 className="text-sm font-medium mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{description}</p>
          </div> */}
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
                    value={item.entryPointLanguages[0]?.text || ""}
                    onChange={(e) =>
                      updatePrimaryMenuItem(item.id, "text", e.target.value)
                    }
                  />
                  <Input
                    value={item.entryPointLanguages[0]?.question || ""}
                    onChange={(e) =>
                      updatePrimaryMenuItem(item.id, "question", e.target.value)
                    }
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
