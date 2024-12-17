"use client";
import { LoaderCircle, Badge, BadgeX, BadgeCheck } from "lucide-react";
import { useAppContext } from "@/components/context/appContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useExistSubdomain,
  useUpdateTeam,
} from "@/components/context/useAppContext/team";
import { InputCharging } from "@/components/loaders/loadersSkeleton";
import { CustomCard } from "@/components/custom-card";
import { useEffect, useState } from "react";
import slugify from "slugify";
import { useDashboardLanguage } from "@/components/context/dashboardLanguageContext";

export default function Component() {
  const { t } = useDashboardLanguage();
  const customDomain = t("app.TEAM.TEAM_ID.SETTINGS.CUSTOM_DOMAIN.PAGE");

  const {
    state: { teamSelected, user },
  } = useAppContext();

  const updateTeam = useUpdateTeam();

  const useExist = useExistSubdomain();

  const [subDomainUrl, setSubDomainUrl] = useState("");
  const [subDomainUrlSave, setSubDomainUrlSave] = useState("");

  useEffect(() => {
    if (teamSelected?.subDomain) {
      setSubDomainUrl(teamSelected.subDomain);
      setSubDomainUrlSave(teamSelected.subDomain);
    }
  }, [teamSelected]);

  const handleValidation = async () => {
    if (teamSelected && user?.user.id) {
      const slug = slugify(subDomainUrl, {
        lower: true,
        strict: true,
      });

      setSubDomainUrl(slug);

      const exist = await useExist.existSubdomain(slug);

      if (exist !== null && !exist) {
        await updateTeam.updateTeam(
          teamSelected.id,
          { subDomain: slug },
          user.user.id,
        );
      }
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
              disabled={subDomainUrlSave === subDomainUrl || updateTeam.loading}
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
