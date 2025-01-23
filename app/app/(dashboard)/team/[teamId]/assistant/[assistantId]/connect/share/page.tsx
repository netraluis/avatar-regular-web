"use client";
import { Copy } from "lucide-react";
import { useAppContext } from "@/components/context/appContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  InputCharging,
  TextAreaCharging,
} from "@/components/loaders/loadersSkeleton";
import { CustomCard } from "@/components/custom-card";
import { useEffect, useState } from "react";
import { useDashboardLanguage } from "@/components/context/dashboardLanguageContext";
import { useParams } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";

export default function Component() {
  const { teamId, assistantId } = useParams();
  const { t } = useDashboardLanguage();
  const share = t("app.TEAM.TEAM_ID.ASSISTANT.ASSISTANT_ID.CONNECT.SHARE.PAGE");

  const [url, setUrl] = useState("");
  const [script, setScript] = useState("");
  const {
    state: { teamSelected, assistantSelected },
  } = useAppContext();

  useEffect(() => {
    setUrl(
      `https://${teamSelected?.subDomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/${teamSelected?.defaultLanguage?.toLocaleLowerCase()}/${assistantSelected?.localAssistant?.url}`,
    );
    setScript(
      `<script src=${process.env.NEXT_PUBLIC_PROTOCOL ? process.env.NEXT_PUBLIC_PROTOCOL : "https://"}chatbotfor-widget.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/chatbot-widget?teamId=${teamId}&assistantId=${assistantId}&language=${teamSelected?.defaultLanguage?.toLocaleLowerCase()}></script>`,
    );
  }, [teamSelected, assistantSelected]);

  const handleRedirect = () => {
    window.open(url, "_blank");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(script);
  };

  return (
    <div className="space-y-2">
      <div>
        <CustomCard title={share.url.title} description={share.url.desription}>
          <div className="space-y-2">
            <Label htmlFor="team-url">{share.url.chat.title}</Label>
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
              {share.url.chat.description}
            </p>
          </div>
        </CustomCard>
      </div>
      <div>
        <CustomCard
          title={share.script.title}
          description={share.script.desription}
        >
          <div className="space-y-2">
            <Label htmlFor="team-url">{share.script.chat.title}</Label>
            <div className="flex items-start space-x-2">
              {teamSelected ? (
                // <Input id="team-url" disabled read-only="true" value={url} />
                <Textarea
                  id="name"
                  name="name"
                  disabled
                  read-only="true"
                  value={script}
                  className="min-h-[100px]"
                />
              ) : (
                <TextAreaCharging />
              )}

              <Button size="sm" onClick={handleCopy} variant="outline">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              {share.script.chat.description}
            </p>
          </div>
        </CustomCard>
      </div>
    </div>
  );
}
