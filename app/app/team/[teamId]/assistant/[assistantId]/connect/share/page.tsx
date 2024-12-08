"use client";
import { Copy } from "lucide-react";
import { useAppContext } from "@/components/context/appContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { InputCharging } from "@/components/loaders/loadersSkeleton";
import { CustomCard } from "@/components/custom-card";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const share = {
  title: "Comparteix l’enllaç",
  desription:
    "Comparteix l’enllaç de la teva pàgina d’equip perquè altres usuaris puguin accedir al teu assistent.",
  chat: {
    title: "URL de l’equip",
    description: "Aquest enllaç permet accedir directament al teu assistent.",
  },
};

export default function Component() {
  const [url, setUrl] = useState("");
  const { assistantId } = useParams();
  const {
    state: { teamSelected },
  } = useAppContext();

  useEffect(() => {
    const assistantUrl = teamSelected?.assistants.find(
      (ass) => ass.id === assistantId,
    )?.url;
    setUrl(
      `https://${teamSelected?.subDomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/${teamSelected?.defaultLanguage?.toLocaleLowerCase()}/${assistantUrl}`,
    );
  }, [teamSelected]);

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
