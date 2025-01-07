import { CustomCard } from "@/components/custom-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { WelcomeType } from "@prisma/client";
import { Reorder, motion } from "framer-motion";
import { Trash2, GripVertical } from "lucide-react";
import { UploadImage } from "@/components/upload-image";
import { FileUserImageType } from "@/types/types";
import { useUpdateTeam } from "@/components/context/useAppContext/team";
import { useAppContext } from "@/components/context/appContext";
import { useEffect, useRef, useState } from "react";
import {
  TextAreaCharging,
  SelectCharging,
} from "@/components/loaders/loadersSkeleton";
import { useDashboardLanguage } from "@/components/context/dashboardLanguageContext";

export function WelcomeMessage() {
  const { t } = useDashboardLanguage();
  const texts = t("app.TEAM.TEAM_ID.SETTINGS.INTERFACE.PAGE");

  const updateTeam = useUpdateTeam();
  const {
    state: { teamSelected, user },
  } = useAppContext();
  const [welcomeText, setWelcomeText] = useState<string[]>([""]);
  const [welcomeDefaultText, setWelcomeDefaultText] = useState<string[]>([""]);
  const [welcomeType, setWelcomeType] = useState<WelcomeType>(
    teamSelected?.welcomeType || WelcomeType.PLAIN,
  );

  const welcomeSaveType =
    (teamSelected?.welcomeType as WelcomeType) || WelcomeType.PLAIN;

  const [imageLogoHasChanged, setImageLogoHasChanged] = useState(false);

  const uploadImageLogoRef = useRef<{ saveImage: () => void }>(null);
  const imgLogoChange = () => {
    setImageLogoHasChanged(true);
  };

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (teamSelected) {
      const welcome = teamSelected?.welcome?.find(
        (w) => w.language === teamSelected.defaultLanguage,
      )?.text || [""];
      setWelcomeDefaultText(welcome);
      setWelcomeText(welcome);
      setWelcomeType(teamSelected.welcomeType);
    }
  }, [teamSelected]);

  const onWelcomeTypeChange = async (welcomeType: WelcomeType) => {
    setWelcomeType(welcomeType);
  };

  const updateWelcome = (index: number, value: string) => {
    const updateWelcome = [...welcomeText];
    updateWelcome[index] = value;
    setWelcomeText(updateWelcome);
  };

  const deleteWelcome = (index: number) => {
    const newWel = welcomeText.splice(index, 1);
    setWelcomeText(newWel);
  };

  const addWelcome = () => {
    setWelcomeText([...welcomeText, ""]);
  };

  const saveHandler = async () => {
    setLoading(true);
    if (!teamSelected) return;
    const welcome = {
      upsert: {
        where: {
          language_teamId: {
            teamId: teamSelected.id,
            language: teamSelected?.defaultLanguage,
          },
        },
        update: {
          text: welcomeText,
        },
        create: {
          text: welcomeText,
          language: teamSelected?.defaultLanguage,
          description: "",
        },
      },
    };
    if (teamSelected && user?.user.id) {
      const updateObject: any = {};
      if (welcomeType !== welcomeSaveType) {
        updateObject.welcomeType = welcomeType;
      }
      if (welcomeText !== welcomeDefaultText) {
        updateObject.welcome = welcome;
      }
      if (uploadImageLogoRef.current && imageLogoHasChanged) {
        await Promise.all([
          uploadImageLogoRef.current.saveImage(),
          updateTeam.updateTeam(teamSelected.id, updateObject, user.user.id),
        ]);
      } else {
        await updateTeam.updateTeam(
          teamSelected.id,
          updateObject,
          user.user.id,
        );
      }
    }
    setImageLogoHasChanged(false);
    setLoading(false);
  };

  return (
    <CustomCard
      title={texts.title}
      description={texts.description}
      action={saveHandler}
      loading={loading}
      valueChange={
        welcomeText !== welcomeDefaultText ||
        imageLogoHasChanged ||
        welcomeType !== welcomeSaveType
      }
    >
      <div className="space-y-2">
        <Label htmlFor="welcome-type">{texts.welcomeType}</Label>
        {welcomeType ? (
          <Select onValueChange={onWelcomeTypeChange} value={welcomeType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecciona un tipo" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(WelcomeType).map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <SelectCharging />
        )}

        <UploadImage
          ref={uploadImageLogoRef}
          description={texts.avatar.uploadLogo}
          alt="avatar"
          recommendedSize={texts.avatar.recommendedSize}
          fileUserImageType={FileUserImageType.AVATAR}
          accept=".png,.jpg,.jpeg"
          choose={texts.avatar.choose}
          onPreviewChange={imgLogoChange}
        />

        {welcomeType === WelcomeType.PLAIN && (
          <div className="space-y-2">
            <Label htmlFor="welcome-message">
              {texts.welcomeMessage.title}
            </Label>
            {welcomeText ? (
              <Textarea
                id="welcome-message"
                placeholder="Type your message here"
                className="min-h-[100px] w-full"
                value={welcomeText[0]}
                onChange={(e) => {
                  setWelcomeText([e.target.value]);
                }}
              />
            ) : (
              <TextAreaCharging />
            )}
            <p className="text-sm text-muted-foreground">
              {texts.welcomeMessage.description}
            </p>
          </div>
        )}

        {welcomeType === WelcomeType.BUBBLE && (
          <div className="space-y-2">
            <Label htmlFor="welcome-message">
              {texts.welcomeMessage.linesTitle}
            </Label>
            <Reorder.Group
              axis="y"
              values={welcomeText}
              onReorder={setWelcomeText}
              className="space-y-2"
            >
              {welcomeText.map((item, index) => (
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
        )}
      </div>
    </CustomCard>
  );
}
