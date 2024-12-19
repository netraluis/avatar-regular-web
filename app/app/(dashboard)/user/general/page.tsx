"use client";
// import { CustomCard } from "@/components/custom-card";
import { useAppContext } from "@/components/context/appContext";
import {
  Language,
  useDashboardLanguage,
} from "@/components/context/dashboardLanguageContext";
import { useUpdateUserLocal } from "@/components/context/useAppContext/userLocal";
import { CustomCard } from "@/components/custom-card";
import { InputCharging } from "@/components/loaders/loadersSkeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LanguageType } from "@prisma/client";
import { useEffect, useState } from "react";

export default function General() {
  const { t, changeLanguage } = useDashboardLanguage();
  const general = t("app.USER.GENERAL.PAGE");

  const {
    state: { userLocal, user },
  } = useAppContext();
  const { updateUserLocal } = useUpdateUserLocal();

  const [name, setName] = useState<{
    name: string;
    saveName: string;
    loading: boolean;
  } | null>(null);
  const [surname, setSurname] = useState<{
    surname: string;
    saveSurname: string;
    loading: boolean;
  } | null>(null);

  const [language, setLanguage] = useState<{
    language: Language;
    saveLanguage: Language;
    loading: boolean;
  } | null>(null);
  const [loadingSettings, setLoadingSettings] = useState(false);

  useEffect(() => {
    if (userLocal) {
      setName({
        name: userLocal.name || "",
        saveName: userLocal.name || "",
        loading: false,
      });

      setSurname({
        surname: userLocal.surname || "",
        saveSurname: userLocal.surname || "",
        loading: false,
      });

      setLanguage({
        loading: false,
        language: userLocal.language as Language,
        saveLanguage: userLocal.language as Language,
      });
    }
  }, [userLocal]);

  const saveHandlerSettings = async () => {
    setLoadingSettings(true);
    if (user?.user.id) {
      await updateUserLocal(user?.user.id, {
        name: name?.name,
        surname: surname?.surname,
        // language: language?.language as LanguageType,
      });
    }
    setLoadingSettings(false);
  };

  const saveHandlerLanguage = async () => {
    if (!language) return;
    setLanguage({ ...language, loading: true });
    if (user?.user.id) {
      await updateUserLocal(user?.user.id, {
        language: language?.language as LanguageType,
      });
    }
    setLanguage({ ...language, loading: false });
    changeLanguage(language.language);
  };

  return (
    <div>
      <CustomCard
        title={general.teamSettings.title}
        description={general.teamSettings.description}
        action={saveHandlerSettings}
        loading={loadingSettings}
        valueChange={
          name?.name !== name?.saveName ||
          surname?.surname !== surname?.saveSurname
        }
      >
        <div className="flex space-x-4">
          <div className="space-y-2 w-1/2">
            <Label htmlFor="team-url">{general.teamSettings.name.title}</Label>
            <div className="flex items-center space-x-2">
              {userLocal ? (
                <Input
                  id="team-url"
                  value={name?.name || ""}
                  onChange={(e) => {
                    if (name) {
                      setName({ ...name, name: e.target.value });
                    }
                  }}
                />
              ) : (
                <InputCharging />
              )}

              {/* <Button
                size="sm"
                onClick={saveName}
                variant="outline"
                disabled={name?.loading || name?.name === name?.saveName}
              >
                <Save className="h-4 w-4" />
              </Button> */}
            </div>
          </div>
          <div className="space-y-2 w-1/2">
            <Label htmlFor="team-url">
              {general.teamSettings.surname.title}
            </Label>
            <div className="flex items-center space-x-2">
              {userLocal ? (
                <Input
                  id="team-url"
                  value={surname?.surname || ""}
                  onChange={(e) => {
                    if (surname) {
                      setSurname({ ...surname, surname: e.target.value });
                    }
                  }}
                />
              ) : (
                <InputCharging />
              )}

              {/* <Button
                size="sm"
                onClick={saveSurname}
                variant="outline"
                disabled={
                  surname?.loading || surname?.surname === surname?.saveSurname
                }
              >
                <Save className="h-4 w-4" />
              </Button> */}
            </div>
          </div>
        </div>
      </CustomCard>

      <CustomCard
        title={general.language.title}
        description={general.language.description}
        action={saveHandlerLanguage}
        loading={language?.loading}
        valueChange={language?.language !== language?.saveLanguage}
      >
        <Label htmlFor="team-url">{general.language.select.title}</Label>
        <div className="flex items-center space-x-2">
          {language ? (
            <Select
              defaultValue={language?.language}
              value={language?.language}
              onValueChange={(value) => {
                // handleLanguageUpdate({ language: value as Language })
                if (language) {
                  setLanguage({ ...language, language: value as Language });
                }
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(Language).map((model) => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <InputCharging />
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {general?.language.select.description}
        </p>
      </CustomCard>
    </div>
  );
}
