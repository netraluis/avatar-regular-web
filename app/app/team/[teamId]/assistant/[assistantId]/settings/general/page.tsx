"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useAssistantSettingsContext } from "@/components/context/assistantSettingsContext";
import { useDeleteAssistant } from "@/components/context/useAppContext/assistant";
import { useAppContext } from "@/components/context/appContext";
import { LoaderCircle } from "lucide-react";
import { useRouter, usePathname, useParams } from "next/navigation";
import { CustomCard } from "@/components/custom-card";
import { useEffect, useState } from "react";
import { InputCharging } from "@/components/loaders/loadersSkeleton";
import slugify from "slugify";

const assistantGeneral = {
  title: "Configuració de l’assistent",
  desription:
    "Personalitza com es mostra el teu assistent dins de la plataforma.",
  assistantName: {
    title: "Nom de l’assistent",
    description:
      "This is your public display name. It can be your real name or a pseudonym. You can only change this once every 30 days.",
  },
  assistantUrl: {
    title: "Assistant URL",
    description: "Upcoming Team URL will cause a redirect to the new url.",
    errorExist: "Aquest subdomini ja existeix",
  },
  delete: {
    title: "Elimina l’assistent",
    description:
      "Si elimines aquest assistent, no hi haurà manera de recuperar-lo. Totes les dades pujades i els chatbots entrenats es perdran. Aquesta acció és irreversible.",
    actionButton: "Elimina l’assistent",
  },
};

export default function Component() {
  const { teamId } = useParams();
  const { data, setData, assistantValues } = useAssistantSettingsContext();
  const { loadingDeleteAssistant, deleteAssistant } = useDeleteAssistant();
  const [urlExist, setUrlExist] = useState(false);
  const [localUrl, setLocalUrl] = useState("");
  const [urlLoading, setUrlLoading] = useState(false);
  const [urlValid, setUrlValid] = useState(false);

  const {
    state: { user, teamSelected },
  } = useAppContext();

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setLocalUrl(assistantValues?.url || "");
  }, [assistantValues]);

  const handleUrl = () => {
    setUrlLoading(true);
    setUrlExist(false);
    setUrlValid(false);
    const urlToCheck = slugify(localUrl, { lower: true, strict: true });
    const exists = teamSelected?.assistants.some(
      (assistant) => assistant.url === urlToCheck,
    );
    if (exists) {
      setUrlLoading(false);
      return setUrlExist(true);
    }
    setData({ ...data, url: urlToCheck });
    setUrlValid(true);
    setUrlLoading(false);
  };
  return (
    <div>
      <CustomCard
        title={assistantGeneral.title}
        description={assistantGeneral.desription}
      >
        <div className="space-y-2">
          <Label htmlFor="team-name">
            {assistantGeneral.assistantName.title}
          </Label>
          {teamSelected ? (
            <Input
              id="team-name"
              value={
                (typeof data?.name === "string" && data?.name) ||
                assistantValues?.name ||
                ""
              }
              onChange={(e) => {
                setData({ ...data, name: e.target.value });
              }}
            />
          ) : (
            <InputCharging />
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="team-url">
            {assistantGeneral.assistantUrl.title}
          </Label>
          <div className="flex items-center space-x-2">
            {teamSelected ? (
              <Input
                id="team-url"
                value={localUrl || ""}
                onChange={(e) => {
                  setLocalUrl(e.target.value);
                }}
              />
            ) : (
              <InputCharging />
            )}
            <Button
              size="sm"
              onClick={handleUrl}
              variant={urlValid ? "green" : "outline"}
            >
              {/* <Copy className="h-4 w-4" /> */}
              {urlValid ? "validado" : urlLoading ? "Comprobando" : "Comprovar"}
            </Button>
          </div>
          {urlExist && (
            <p className="text-sm text-muted-foreground text-red-500">
              {assistantGeneral.assistantUrl.description}
            </p>
          )}
        </div>
      </CustomCard>
      {/* </Card> */}

      <Card>
        <CardHeader>
          <CardTitle>{assistantGeneral.delete.title}</CardTitle>
          <CardDescription>
            {assistantGeneral.delete.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={async () => {
              if (!assistantValues?.id || !user?.user.id) return;
              await deleteAssistant({
                assistantId: assistantValues?.id,
                userId: user.user.id,
                teamId: teamId as string,
              });
              const absolutePath = pathname.split("/").slice(1, 3).join("/");
              router.push(`/${absolutePath}`);
            }}
            variant="destructive"
          >
            {loadingDeleteAssistant ? (
              <LoaderCircle />
            ) : (
              assistantGeneral.delete.actionButton
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
