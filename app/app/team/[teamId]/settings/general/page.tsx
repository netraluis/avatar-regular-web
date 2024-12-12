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

const setting = {
  title: "Configuració de l’equip",
  description:
    "Personalitza la manera com el teu equip es mostra als altres dins la plataforma",
  name: "Nom de l'equip",
  nameDescription:
    "Pots utilitzar el teu nom real, un pseudònim o un nom que representi la teva organització. Tingues en compte que només podràs canviar-lo cada 30 dies.",
  saveName: "Desa",
  url: "URL de l'equip",
  urlDescription:
    "La propera URL de l'equip causarà una redirecció a la nova URL.",
  logo: {
    title: "Logotip i favicon",
    description: "Puja imatges personalitzades per identificar el teu equip",
    uploadLogo: "Puja un logotip",
    choose: "Escollir",
    recommendedSize:
      "El logotip es mostra en llocs visibles dins la plataforma",
  },
  favicon: {
    title: "Imatges del favicon",
    description:
      "El favicon és la icona que apareix al navegador quan visites el teu domini personalitzat.",
    choose: "Escollir",
    uploadFavicon: "Pujar un favicon",
    recommendedSize:
      "El favicon és la icona que apareix al navegador quan visites el teu domini personalitzat.",
  },
  delete: {
    title: "Zona perillosa",
    description:
      "Un cop eliminis el compte del teu equip, no hi haurà marxa enrere. Si us plau, assegura’t. Totes les teves dades pujades i assistents GPT entrenats seran eliminats. Aquesta acció és irreversible.",
    delete: "Esborrar l'equip",
    loading: "Esborrant...",
  },
};

export default function Component() {
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
