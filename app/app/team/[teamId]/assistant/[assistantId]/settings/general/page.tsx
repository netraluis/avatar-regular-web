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
import {
  useDeleteAssistant,
  useUpdateAssistant,
} from "@/components/context/useAppContext/assistant";
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
    save: "Desa nom",
  },
  assistantUrl: {
    title: "Assistant URL",
    description: "Upcoming Team URL will cause a redirect to the new url.",
    errorExist: "Aquest subdomini ja existeix",
    save: "Comprovar i desar",
    prove: "comprovar i desar",
    approve: "Validat i desat",
  },
  delete: {
    title: "Elimina l’assistent",
    description:
      "Si elimines aquest assistent, no hi haurà manera de recuperar-lo. Totes les dades pujades i els chatbots entrenats es perdran. Aquesta acció és irreversible.",
    actionButton: "Elimina l’assistent",
  },
};

export default function Component() {
  const { teamId, assistantId } = useParams();
  const { loadingDeleteAssistant, deleteAssistant } = useDeleteAssistant();
  const [name, setName] = useState({ name: "", loading: false });
  const [url, setUrl] = useState({
    url: "",
    loading: false,
    urlExist: false,
    valid: false,
  });

  const {
    state: { user, teamSelected, assistantSelected },
  } = useAppContext();

  const pathname = usePathname();
  const router = useRouter();
  const updateAssistant = useUpdateAssistant();

  useEffect(() => {
    setUrl({ ...url, url: assistantSelected?.localAssistant?.url || "" });
    setName({ ...name, name: assistantSelected?.localAssistant?.name || "" });
  }, [assistantSelected?.localAssistant]);

  const handleUrl = async () => {
    setUrl({
      ...url,
      loading: true,
      urlExist: false,
      valid: false,
    });
    const urlToCheck = slugify(url.url, { lower: true, strict: true });
    const exists = teamSelected?.assistants.some(
      (assistant) => assistant.url === urlToCheck,
    );
    if (exists) {
      return setUrl({
        ...url,
        loading: false,
        urlExist: true,
      });
    }
    if (user?.user.id) {
      await updateAssistant.updateAssistant({
        teamId: teamId as string,
        assistantId: assistantId as string,
        userId: user.user.id,
        localAssistantUpdateParams: { url: url.url },
      });
    }
    setUrl({
      ...url,
      valid: true,
      loading: false,
    });
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
            <div className="flex items-center space-x-2">
              <Input
                id="team-name"
                value={name.name}
                onChange={(e) => {
                  setName({ ...name, name: e.target.value || "" });
                }}
              />
              <Button
                onClick={async () => {
                  if (
                    user?.user.id &&
                    assistantSelected?.localAssistant?.name
                  ) {
                    setName({ ...name, loading: true });
                    await updateAssistant.updateAssistant({
                      teamId: teamId as string,
                      assistantId: assistantId as string,
                      userId: user.user.id,
                      localAssistantUpdateParams: { name: name.name },
                    });
                    setName({ ...name, loading: false });
                  }
                }}
                variant="outline"
                disabled={
                  name.loading ||
                  name.name === assistantSelected?.localAssistant?.name
                }
              >
                {assistantGeneral.assistantName.save}
              </Button>
            </div>
          ) : (
            <InputCharging />
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="team-url">
            {assistantGeneral.assistantUrl.title}
          </Label>

          {teamSelected ? (
            <div className="flex items-center space-x-2">
              <Input
                id="team-url"
                value={url.url || ""}
                onChange={(e) => {
                  setUrl({ ...url, valid: false, url: e.target.value });
                }}
              />
              <Button
                size="sm"
                onClick={handleUrl}
                variant={url.valid ? "green" : "outline"}
                disabled={
                  url.loading ||
                  url.url === assistantSelected?.localAssistant?.url
                }
              >
                {/* <Copy className="h-4 w-4" /> */}
                {url.valid
                  ? assistantGeneral.assistantUrl.approve
                  : assistantGeneral.assistantUrl.prove}
              </Button>
            </div>
          ) : (
            <InputCharging />
          )}

          {url.urlExist && (
            <p className="text-sm text-muted-foreground text-red-500">
              {assistantGeneral.assistantUrl.description}
            </p>
          )}
        </div>
      </CustomCard>

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
              if (!assistantSelected?.localAssistant?.id || !user?.user.id)
                return;
              await deleteAssistant({
                assistantId: assistantSelected?.localAssistant?.id,
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
