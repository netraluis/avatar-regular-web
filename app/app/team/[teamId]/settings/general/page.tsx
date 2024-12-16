"use client";
import { useAppContext } from "@/components/context/appContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { FileUserImageType } from "@/types/types";
import { useDeleteTeam } from "@/components/context/useAppContext/team";
import { useRouter } from "next/navigation";
import { InputCharging } from "@/components/loaders/loadersSkeleton";
import { UploadImage } from "@/components/upload-image";
import { CustomCard } from "@/components/custom-card";
import { SaveButton } from "@/components/save-button";
import { useUpdateTeam } from "@/components/context/useAppContext/team";
import { useDashboardLanguage } from "@/components/context/dashboardLanguageContext";

export default function Component() {
    const { t } = useDashboardLanguage();
    const setting = t("app.TEAM.TEAM_ID.SETTINGS.GENERAL.PAGE");

  const {
    state: { user, teamSelected },
  } = useAppContext();
  const updateTeam = useUpdateTeam();

  const [name, setName] = useState<string | undefined>(undefined);

  const router = useRouter();

  const { loading, deleteTeam } = useDeleteTeam();

  const saveHandler = async () => {
    if (user?.user.id && teamSelected?.id) {
      await updateTeam.updateTeam(teamSelected.id, { name }, user.user.id);
    }
  };

  useEffect(() => {
    if (teamSelected) {
      setName(teamSelected.name);
    }
  }, [teamSelected]);

  return (
    <div>
      <CustomCard title={setting.title} description={setting.description}>
        <div className="space-y-2">
          <Label htmlFor="team-name">{setting.name}</Label>
          {teamSelected?.name ? (
            <Input
              id="team-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              placeholder="Acme Inc."
            />
          ) : (
            <InputCharging />
          )}
          <p className="text-sm text-muted-foreground">
            {setting.nameDescription}
          </p>
        </div>
        <SaveButton
          action={saveHandler}
          loading={updateTeam.loading || !name}
          actionButtonText={setting.saveName}
          valueChange={teamSelected?.name === name}
        />
      </CustomCard>

      <CustomCard
        title={setting.logo.title}
        description={setting.logo.description}
      >
        <UploadImage
          description={setting.logo.uploadLogo}
          alt="logo"
          recommendedSize={setting.logo.recommendedSize}
          fileUserImageType={FileUserImageType.LOGO}
          accept=".png,.jpg,.jpeg"
          choose={setting.logo.choose}
        />
        <UploadImage
          description={setting.favicon.uploadFavicon}
          alt="favicon"
          recommendedSize={setting.favicon.recommendedSize}
          fileUserImageType={FileUserImageType.SYMBOL}
          accept=".svg"
          choose={setting.favicon.choose}
        />
      </CustomCard>

      <CustomCard
        title={setting.delete.title}
        description={setting.delete.description}
        separator={false}
      >
        <Button
          onClick={async () => {
            if (!teamSelected?.id || !user?.user.id) return;
            await deleteTeam(teamSelected.id as string, user.user.id);
            router.push(`/team`);
          }}
          variant="destructive"
        >
          {loading
            ? setting.delete.loading
            : `${setting.delete.delete} ${teamSelected?.name}`}
        </Button>
      </CustomCard>
    </div>
  );
}
