"use client";
// import { CustomCard } from "@/components/custom-card";
import { useAppContext } from "@/components/context/appContext";
import { Language, useDashboardLanguage } from "@/components/context/dashboardLanguageContext";
import { useFetchUserByUserId, useUpdateUserLocal } from "@/components/context/useAppContext/userLocal";
import { CustomCard } from "@/components/custom-card";
import { InputCharging } from "@/components/loaders/loadersSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save } from "lucide-react";
import { useEffect, useState } from "react";

export default function General() {
  const { t, changeLanguage } = useDashboardLanguage();
  const general = t(
    "app.USER.GENERAL.PAGE",
  );

  const { state: { userLocal, user } } = useAppContext();
  const { updateUserLocal } = useUpdateUserLocal();

  const [name, setName] = useState<{ name: string, saveName: string, loading: boolean } | null>(null);
  const [surname, setSurname] = useState<{ surname: string, saveSurname: string, loading: boolean } | null>(null);


  useEffect(() => {
    if (userLocal) {
      setName({
        name: userLocal.name || '',
        saveName: userLocal.name || '',
        loading: false,
      });

      setSurname({
        surname: userLocal.surname || '',
        saveSurname: userLocal.surname || '',
        loading: false,
      })
    }
  }, [userLocal]);

  const saveName = async () => {
    if (!name) return;
    setName({ ...name, loading: true })
    if (user?.user.id) {
      await updateUserLocal(user?.user.id, { name: name?.name });
    }
    setName({ ...name, loading: true })
  }

  const saveSurname = async () => {
    if (!surname) return;
    setSurname({ ...surname, loading: true })
    if (user?.user.id) {
      await updateUserLocal(user?.user.id, { surname: surname?.surname });
    }
    setSurname({ ...surname, loading: false })
  }

  const handleLanguageUpdate = async ({ language }: { language: Language }) => {
    if (user?.user.id) {
      await updateUserLocal(user?.user.id, { language });
      changeLanguage(language);
    }
  }
  return (
    <div>
      <CustomCard title={general.teamSettings.title} description={general.teamSettings.description}>
        <div className="flex space-x-4">
          <div className="space-y-2 w-1/2">
            <Label htmlFor="team-url">{general.teamSettings.name.title}</Label>
            <div className="flex items-center space-x-2">
              {userLocal ? (
                <Input id="team-url" value={name?.name || ''} onChange={(e) => {
                  if (name) {
                    setName({ ...name, name: e.target.value })
                  }
                }} />
              ) : (
                <InputCharging />
              )}

              <Button size="sm" onClick={saveName} variant="outline" disabled={name?.loading || name?.name === name?.saveName}>
                <Save className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-2 w-1/2">
            <Label htmlFor="team-url">{general.teamSettings.surname.title}</Label>
            <div className="flex items-center space-x-2">
              {userLocal ? (
                <Input id="team-url" value={surname?.surname || ''} onChange={(e) => {
                  if (surname) {
                    setSurname({ ...surname, surname: e.target.value })
                  }
                }} />
              ) : (
                <InputCharging />
              )}

              <Button size="sm" onClick={saveSurname} variant="outline" disabled={surname?.loading || surname?.surname === surname?.saveSurname}>
                <Save className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CustomCard>

      <CustomCard title={general.language.title} description={general.language.description}>
            <Label htmlFor="team-url">{general.language.select.title}</Label>
            <div className="flex items-center space-x-2">
              {userLocal ? (
                <Select
                  defaultValue={userLocal.language}
                  value={userLocal.language}
                  onValueChange={(value) => handleLanguageUpdate({ language: value as Language })}
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
