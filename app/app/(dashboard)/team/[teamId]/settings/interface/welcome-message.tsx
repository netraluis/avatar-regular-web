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
import { useEffect, useState } from "react";
import {
  TextAreaCharging,
  SelectCharging,
} from "@/components/loaders/loadersSkeleton";
import { SaveButton } from "@/components/save-button";
import { interfaceText } from "./locale";

export function WelcomeMessage({
  texts,
}: {
  texts: typeof interfaceText.welcomeMessage;
}) {
  const updateTeam = useUpdateTeam();
  const {
    state: { teamSelected, user },
  } = useAppContext();
  const [welcomeText, setWelcomeText] = useState<string[]>([""]);
  const [welcomeDefaultText, setWelcomeDefaultText] = useState<string[]>([""]);
  const [welcomeType, setWelcomeType] = useState<WelcomeType>(
    teamSelected?.welcomeType || WelcomeType.PLAIN,
  );

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
    if (teamSelected && user?.user.id) {
      await updateTeam.updateTeam(
        teamSelected.id,
        { welcomeType },
        user.user.id,
      );
    }
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
      await updateTeam.updateTeam(teamSelected.id, { welcome }, user.user.id);
    }
  };

  return (
    <CustomCard title={texts.title} description={texts.description}>
      <div className="space-y-2">
        <Label htmlFor="welcome-type">{texts.linesTitle}</Label>
        {!updateTeam.loading ? (
          <Select
            onValueChange={onWelcomeTypeChange}
            value={teamSelected?.welcomeType}
          >
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
          description={interfaceText.avatar.uploadLogo}
          alt="avatar"
          recommendedSize={interfaceText.avatar.recommendedSize}
          fileUserImageType={FileUserImageType.AVATAR}
          accept=".png,.jpg,.jpeg"
          choose={interfaceText.avatar.choose}
        />

        {welcomeType === WelcomeType.PLAIN && (
          <div className="space-y-2">
            <Label htmlFor="welcome-message">
              {interfaceText.welcomeMessage.title}
            </Label>
            {teamSelected ? (
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
              {interfaceText.welcomeMessage.description}
            </p>
          </div>
        )}

        {welcomeType === WelcomeType.BUBBLE && (
          <div className="space-y-2">
            <Label htmlFor="welcome-message">
              {interfaceText.welcomeMessage.linesTitle}
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
                      {interfaceText.welcomeMessage.line} {index + 1}
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
              {interfaceText.welcomeMessage.addLine}
            </Button>
            <p className="text-sm text-muted-foreground">
              {interfaceText.welcomeMessage.lineDescription}
            </p>
          </div>
        )}

        <SaveButton
          action={saveHandler}
          loading={updateTeam.loading}
          actionButtonText={texts.save}
          valueChange={welcomeText === welcomeDefaultText}
        />
      </div>
    </CustomCard>
  );
}
