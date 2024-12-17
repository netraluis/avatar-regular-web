"use client";
import { Copy } from "lucide-react";
import { useAppContext } from "@/components/context/appContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { InputCharging } from "@/components/loaders/loadersSkeleton";
import { CustomCard } from "@/components/custom-card";
import { useEffect, useState } from "react";
import { useDashboardLanguage } from "@/components/context/dashboardLanguageContext";

export default function Component() {
  const { t } = useDashboardLanguage();
  const share = t("app.TEAM.TEAM_ID.ASSISTANT.ASSISTANT_ID.CONNECT.SHARE.PAGE");

  const [url, setUrl] = useState("");
  const {
    state: { teamSelected, assistantSelected },
  } = useAppContext();

  useEffect(() => {
    setUrl(
      `https://${teamSelected?.subDomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/${teamSelected?.defaultLanguage?.toLocaleLowerCase()}/${assistantSelected?.localAssistant?.url}`,
    );
  }, [teamSelected, assistantSelected]);

  const handleRedirect = () => {
    window.open(url, "_blank");
  };

  return (
    <div>
      <CustomCard title={share.title} description={share.desription}>
        <div className="space-y-2">
          <Label htmlFor="team-url">{share.chat.title}</Label>
          <div className="flex items-center space-x-2">
            {teamSelected ? (
              <Input id="team-url" disabled read-only="true" value={url} />
            ) : (
              <InputCharging />
            )}

            <Button size="sm" onClick={handleRedirect} variant="outline">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            {share.chat.description}
          </p>
        </div>
      </CustomCard>
    </div>
  );
}
