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
import { Copy } from "lucide-react";
import slugify from "slugify";

const assistantGeneral = {
  title: "Ensenyar la teva pàgina",
  desription: "Comparteix la teva pàgina amb els teus amics.",
  assistantName: {
    title: "Assistant name",
    description:
      "This is your public display name. It can be your real name or a pseudonym. You can only change this once every 30 days.",
  },
  assistantUrl: {
    title: "Assistant URL",
    description: "Upcoming Team URL will cause a redirect to the new url.",
    errorExist: "Aquest subdomini ja existeix",
  },
};

export default function Component() {
  const { data, setData, assistantValues } = useAssistantSettingsContext();
  const { loadingDeleteAssistant, deleteAssistant } = useDeleteAssistant();
  const [url, setUrl] = useState("");
  const [urlExist, setUrlExist] = useState(false);
  const [localUrl, setLocalUrl] = useState("");
  const [urlLoading, setUrlLoading] = useState(false);
  const [urlValid, setUrlValid] = useState(false);

  const {
    state: { user, teamSelected },
  } = useAppContext();

  const pathname = usePathname();
  const router = useRouter();
  const { assistantId } = useParams();

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

  useEffect(() => {
    setLocalUrl(assistantValues?.url);
  }, [assistantValues]);

  const handleUrl = () => {
    setUrlLoading(true);
    setUrlExist(false);
    setUrlValid(false);
    const urlToCheck = slugify(localUrl, { lower: true, strict: true });
    const exists = teamSelected.assistants.some(
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
    <div className="max-w-2xl mx-auto p-4 space-y-8 flex flex-col">
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
          <p className="text-sm text-muted-foreground">
            {assistantGeneral.assistantName.description}
          </p>
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
          <p className="text-sm text-muted-foreground">
            {assistantGeneral.assistantUrl.description}
          </p>
          {urlExist && (
            <p className="text-sm text-muted-foreground text-red-500">
              {assistantGeneral.assistantUrl.description}
            </p>
          )}
        </div>
      </CustomCard>
      {/* </Card> */}

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle>Danger zone</CardTitle>
          <CardDescription>
            Once you delete your team account, there is no going back. Please be
            certain.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            All your uploaded data and trained chatbots will be deleted. This
            action is not reversible
          </p>
          <Button
            onClick={async () => {
              if (!assistantValues?.id || !user?.user.id) return;
              await deleteAssistant({
                assistantId: assistantValues?.id,
                userId: user.user.id,
              });
              const absolutePath = pathname.split("/").slice(1, 3).join("/");
              router.push(`/${absolutePath}`);
            }}
            variant="destructive"
          >
            {loadingDeleteAssistant ? <LoaderCircle /> : assistantValues?.name}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
