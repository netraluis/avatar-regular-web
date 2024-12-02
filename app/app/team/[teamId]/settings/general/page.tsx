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
import { useRouter } from "next/navigation";
import { InputCharging } from "@/components/loaders/loadersSkeleton";
import { UploadImage } from "@/components/upload-image";
import { CustomCard } from "@/components/custom-card";

const setting = {
  title: "Ajusts del equip",
  description: "Això és com et veuran els altres al lloc.",
  name: "Nom de l'equip",
  nameDescription:
    "Aquest és el teu nom públic. Pot ser el teu nom real o un pseudònim.",
  url: "URL de l'equip",
  urlDescription:
    "La propera URL de l'equip causarà una redirecció a la nova URL.",
  logo: {
    title: "Imatges de l'equip",
    description: "Així és com et veuran els altres al lloc.",
    uploadLogo: "Pujar un logotip",
    choose: "Escollir",
    uploadFavicon: "Pujar un favicon",
    recommendedSize: "Mida recomanada 180 × 180",
  },
  favicon: {
    title: "Imatges del favicon",
    description: "Així és com es veurà el favicon al lloc.",
    uploadLogo: "Pujar un favicon",
    choose: "Escollir favicon",
    uploadFavicon: "Pujar un favicon",
    recommendedSize: "Mida recomanada 180 × 180",
  },
  delete: {
    title: "Zona de perill",
    description:
      "Un cop esborris el teu compte d'equip, no hi ha marxa enrere. Si us plau, sigues cert.",
    delete: "Esborrar l'equip",
    loading: "Esborrant...",
  },
};

export default function Component() {
  const {
    state: { user, teamSelected },
  } = useAppContext();

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
            />
          ) : (
            <InputCharging />
          )}
          <p className="text-sm text-muted-foreground">
            {setting.nameDescription}
          </p>
        </div>
        <div className="space-y-2">
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
        </div>
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
        />
        <UploadImage
          src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${data?.symbolUrl || teamSelected?.symbolUrl}?timestamp=${new Date().getTime()}`}
          description={setting.favicon.uploadLogo}
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
          {loading ? setting.delete.loading : teamSelected?.name}
        </Button>
      </CustomCard>
    </div>
  );
}
