"use client";
import { Check, Copy } from "lucide-react";
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
  const [frame, setFrame] = useState("");
  const {
    state: { teamSelected, assistantSelected },
  } = useAppContext();

  const [urlCopied, setUrlCopied] = useState(false);
  const [scriptCopied, setScriptCopied] = useState(false);
  const [frameCopied, setFrameCopied] = useState(false);

  useEffect(() => {
    setUrl(
      `${process.env.NEXT_PUBLIC_PROTOCOL ? process.env.NEXT_PUBLIC_PROTOCOL : "https://"}${teamSelected?.subDomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/${teamSelected?.defaultLanguage?.toLocaleLowerCase()}/${assistantSelected?.localAssistant?.url}`,
    );
    // setScript(
    //   `<script src=${process.env.NEXT_PUBLIC_PROTOCOL ? process.env.NEXT_PUBLIC_PROTOCOL : "https://"}chatbotfor-widget.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/chatbot-widget?teamId=${teamId}&assistantId=${assistantId}&language=${teamSelected?.defaultLanguage?.toLocaleLowerCase()}></script>`,
    // );

    setScript(
      `<script src="${process.env.NEXT_PUBLIC_PROTOCOL ? process.env.NEXT_PUBLIC_PROTOCOL : "https://"}chatbotfor-widget.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/widget.js" data-src="${process.env.NEXT_PUBLIC_PROTOCOL ? process.env.NEXT_PUBLIC_PROTOCOL : "https://"}chatbotfor-widget.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/chatbot-widget" data-team-id="${teamId}" data-assistant-id="${assistantId}" data-language="${teamSelected?.defaultLanguage?.toLocaleLowerCase()}"></script>`,
    );
    setFrame(
      `<iframe src="${process.env.NEXT_PUBLIC_PROTOCOL ? process.env.NEXT_PUBLIC_PROTOCOL : "https://"}${teamSelected?.subDomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/${teamSelected?.defaultLanguage?.toLocaleLowerCase()}/${assistantSelected?.localAssistant?.url}"  width="900px" height="500px" allowFullScreenallowFullScreen></iframe>`,
    );
  }, [teamSelected, assistantSelected]);

  // <iframe
  //                  src="https://prueba-team-2b7d6cf0-d95d-43bd-bc30-c95003b81d6a.netraluis.com/ca/ass?hideHeader=true"
  //       className="iframe"
  //       width="900px"
  //       height="500px"
  //       allowFullScreenallowFullScreen></iframe>

  const handleCopy = (setCopied: (copie: boolean) => void, copied: string) => {
    navigator.clipboard
      .writeText(copied)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Ocultar mensaje después de 2 segundos
      })
      .catch((err) => {
        console.error("Error al copiar al portapapeles:", err);
      });
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

              <Button
                size="sm"
                onClick={() => handleCopy(setUrlCopied, url)}
                variant="outline"
              >
                {!urlCopied ? (
                  <Copy className="h-4 w-4" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
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

              <Button
                size="sm"
                onClick={() => handleCopy(setScriptCopied, script)}
                variant="outline"
              >
                {!scriptCopied ? (
                  <Copy className="h-4 w-4" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              {share.script.chat.description}
            </p>
          </div>
        </CustomCard>
      </div>
      <div>
        <CustomCard
          title={share.frame.chat.title}
          description={share.frame.desription}
        >
          <div className="space-y-2">
            <Label htmlFor="team-url">{share.frame.title}</Label>
            <div className="flex items-start space-x-2">
              {teamSelected ? (
                // <Input id="team-url" disabled read-only="true" value={url} />
                <Textarea
                  id="name"
                  name="name"
                  disabled
                  read-only="true"
                  value={frame}
                  className="min-h-[100px]"
                />
              ) : (
                <TextAreaCharging />
              )}

              <Button
                size="sm"
                onClick={() => handleCopy(setFrameCopied, frame)}
                variant="outline"
              >
                {!frameCopied ? (
                  <Copy className="h-4 w-4" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              {share.frame.chat.description}
            </p>
          </div>
        </CustomCard>
      </div>
    </div>
  );
}
