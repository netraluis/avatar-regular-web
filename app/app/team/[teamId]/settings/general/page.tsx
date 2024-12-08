"use client";
import { useAppContext } from "@/components/context/appContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import slugify from "slugify";

import { FileUserImageType } from "@/types/types";
import { useTeamSettingsContext } from "@/components/context/teamSettingsContext";
import { useDeleteTeam } from "@/components/context/useAppContext/team";
import { useParams, useRouter } from "next/navigation";
import { InputCharging } from "@/components/loaders/loadersSkeleton";
import { UploadImage } from "@/components/upload-image";
import { CustomCard } from "@/components/custom-card";

const setting = {
  title: "Configuració de l’equip",
  description:
    "Personalitza la manera com el teu equip es mostra als altres dins la plataforma",
  name: "Nom de l'equip",
  nameDescription:
    "Pots utilitzar el teu nom real, un pseudònim o un nom que representi la teva organització. Tingues en compte que només podràs canviar-lo cada 30 dies.",
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

  const { assistantId } = useParams();

  const { data, setData } = useTeamSettingsContext();

  const router = useRouter();

  const { loading, deleteTeam } = useDeleteTeam();

  useEffect(() => {
    if (data.name) {
      const slug = slugify(typeof data?.name === "string" ? data?.name : "", {
        lower: true,
        strict: true,
      });
      setData({ ...data, subDomain: slug });
    }
  }, [data.name]);

  return (
    <div>
      <CustomCard title={setting.title} description={setting.description}>
        <div className="space-y-2">
          <Label htmlFor="team-name">{setting.name}</Label>
          {teamSelected?.name ? (
            <Input
              id="team-name"
              value={
                (typeof data?.name === "string" && data?.name) ||
                teamSelected?.name ||
                ""
              }
              onChange={(e) => {
                setData({ ...data, name: e.target.value });
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
        {/* <div className="space-y-2">
          <Label htmlFor="team-url">{setting.url}</Label>
          <div className="flex items-center space-x-2">
            {teamSelected?.subDomain ? (
              <Input
                disabled
                id="team-url"
                value={
                  (typeof data?.subDomain === "string" && data?.subDomain) ||
                  teamSelected?.subDomain ||
                  ""
                }
              />
            ) : (
              <InputCharging />
            )}
            <span className="text-muted-foreground">.chatbotfor.com</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {setting.urlDescription}
          </p>
        </div> */}
      </CustomCard>

      <CustomCard
        title={setting.logo.title}
        description={setting.logo.description}
      >
        <UploadImage
          src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${data?.logoUrl || teamSelected?.logoUrl}?timestamp=${new Date().getTime()}`}
          description={setting.logo.uploadLogo}
          alt="logo"
          recommendedSize={setting.logo.recommendedSize}
          fileUserImageType={FileUserImageType.LOGO}
          accept=".png,.jpg,.jpeg"
          choose={setting.logo.choose}
          assistantId={assistantId as string}
        />
        <UploadImage
          src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${data?.symbolUrl || teamSelected?.symbolUrl}?timestamp=${new Date().getTime()}`}
          description={setting.favicon.uploadFavicon}
          alt="favicon"
          recommendedSize={setting.favicon.recommendedSize}
          fileUserImageType={FileUserImageType.SYMBOL}
          accept=".svg"
          choose={setting.favicon.choose}
          assistantId={assistantId as string}
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
