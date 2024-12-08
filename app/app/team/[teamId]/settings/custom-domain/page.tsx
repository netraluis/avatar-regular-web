"use client";
import { LoaderCircle, Badge, BadgeX, BadgeCheck } from "lucide-react";
import { useAppContext } from "@/components/context/appContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useTeamSettingsContext } from "@/components/context/teamSettingsContext";
import { useExistSubdomain } from "@/components/context/useAppContext/team";
import { InputCharging } from "@/components/loaders/loadersSkeleton";
import { CustomCard } from "@/components/custom-card";
import { useEffect, useState } from "react";
import slugify from "slugify";

const customDomain = {
  subdomain: {
    title: "Domini personalitzat",
    description: "Personalitza com els altres veuen el teu equip al lloc web configurant l’URL del teu equip o connectant un domini personalitzat.",
    validation: "Validar",
    urlTitle: "URL de l'equip",
    urlDescription:
      "Quant possis una url i li donis a validar, farem un control per veure que no s`hagin fet servir caracters no permesos, els canviarem per tu si és aquest el cas, i també mirarem si esta ocupat, en el cas que ho estigui hauras de canviar el teu texte.",
    teamSubdomainDuplicate: "Aquest subdomini ja està en ús",
  },
  domain: {
    title: "Ajusta el teu domini personalitzat",
    description: "Això és com et veuran els altres al lloc.",
  },
};

export default function Component() {
  const {
    state: { teamSelected },
  } = useAppContext();

  const { data, setData } = useTeamSettingsContext();
  const useExist = useExistSubdomain();

  const [subDomainUrl, setSubDomainUrl] = useState("");

  useEffect(() => {
    if (teamSelected?.subDomain) {
      setSubDomainUrl(teamSelected.subDomain);
    }
  }, [teamSelected]);

  const handleValidation = async () => {
    console.log(subDomainUrl);
    const slug = slugify(subDomainUrl, {
      lower: true,
      strict: true,
    });

    setSubDomainUrl(slug);

    const exist = await useExist.existSubdomain(slug);

    if (exist !== null && !exist) {
      setData({ ...data, subDomain: slug });
    }
  };

  return (
    <div>
      <CustomCard
        title={customDomain.subdomain.title}
        description={customDomain.subdomain.description}
      >
        <div className="space-y-2">
          <Label htmlFor="team-url">{customDomain.subdomain.urlTitle}</Label>
          <div className="flex items-center space-x-2">
            {subDomainUrl ? (
              <Input
                id="team-url"
                value={subDomainUrl}
                onChange={(e) => {
                  setSubDomainUrl(e.target.value);
                }}
              />
            ) : (
              <InputCharging />
            )}
            <span className="text-muted-foreground">.chatbotfor.com</span>
            <Button
              size="sm"
              onClick={handleValidation}
              variant={
                !useExist.loading && useExist.data !== null
                  ? !useExist.data
                    ? "green"
                    : "alert"
                  : "default"
              }
            >
              {useExist.loading && (
                <LoaderCircle className="h-3.5 w-3.5 animate-spin mr-1" />
              )}
              {!useExist.loading && useExist.data !== null && useExist.data && (
                <BadgeX className="h-3.5 w-3.5 mr-1" />
              )}
              {!useExist.loading &&
                useExist.data !== null &&
                !useExist.data && <BadgeCheck className="h-3.5 w-3.5 mr-1" />}
              {!useExist.loading && useExist.data === null && (
                <Badge className="h-3.5 w-3.5 mr-1" />
              )}
              {customDomain.subdomain.validation}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            {!useExist.loading && useExist.data !== null && useExist.data
              ? customDomain.subdomain.teamSubdomainDuplicate
              : customDomain.subdomain.urlDescription}
          </p>
        </div>
      </CustomCard>
    </div>
  );
}
