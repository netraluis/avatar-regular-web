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
import { useDashboardLanguage } from "@/components/context/dashboardLanguageContext";
import { useFetchTeamsByUserIdAndTeamId } from "@/components/context/useAppContext/team";
import { AnimatePresence, motion } from "framer-motion";

export default function Component() {
  const { t } = useDashboardLanguage();
  const assistantGeneral = t(
    "app.TEAM.TEAM_ID.ASSISTANT.ASSISTANT_ID.SETTINGS.GENERAL",
  );

  const { teamId, assistantId } = useParams();
  const { loadingDeleteAssistant, deleteAssistant } = useDeleteAssistant();
  const [name, setName] = useState({ name: "", loading: false, saveName: "" });
  const [url, setUrl] = useState({
    url: "",
    loading: false,
    urlExist: false,
    valid: false,
    urlSave: "",
  });

  const {
    state: { user, teamSelected, assistantSelected },
  } = useAppContext();

  const pathname = usePathname();
  const router = useRouter();
  const updateAssistant = useUpdateAssistant();

  const fetchTeamsByUserIdAndTeamId = useFetchTeamsByUserIdAndTeamId();

  useEffect(() => {
    if (assistantSelected?.localAssistant?.url) {
      setUrl({
        ...url,
        url: assistantSelected?.localAssistant?.url || "",
        urlSave: assistantSelected?.localAssistant?.url || "",
      });
    }
    if (assistantSelected?.localAssistant?.name) {
      setName({
        ...name,
        name: assistantSelected?.localAssistant?.name || "",
        saveName: assistantSelected?.localAssistant?.name || "",
      });
    }
  }, [assistantSelected]);

  useEffect(() => {
    if (updateAssistant?.updateAssistantData?.localAssistant) {
      setUrl({
        ...url,
        valid: true,
        loading: false,
        urlSave: updateAssistant.updateAssistantData.localAssistant.url,
      });
      setName({
        ...name,
        loading: false,
        saveName: updateAssistant.updateAssistantData.localAssistant.name,
      });
    }
  }, [updateAssistant.updateAssistantData]);


  useEffect(() => {
    if(updateAssistant.errorUpdateAssistant){
      setUrl({
        ...url,
        valid: false,
        loading: false,
        urlExist: false,
      });
    }
  }, [updateAssistant.errorUpdateAssistant]);

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

    // const exists = assistantSelected?.localAssistant?.url === urlToCheck;
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
        localAssistantUpdateParams: { url: urlToCheck },
      });

      await fetchTeamsByUserIdAndTeamId.fetchTeamsByUserIdAndTeamId(
        teamId as string,
        user.user.id,
      );
    }
  };

  const saveName = async () => {
    if (user?.user.id && assistantSelected?.localAssistant?.name) {
      setName({ ...name, loading: true });
      await updateAssistant.updateAssistant({
        teamId: teamId as string,
        assistantId: assistantId as string,
        userId: user.user.id,
        localAssistantUpdateParams: { name: name.name },
      });
    }
  };
  return (
    <div>
      <CustomCard
        title={assistantGeneral.title}
        description={assistantGeneral.desription}
        action={saveName}
        loading={name.loading}
        valueChange={name.name !== name.saveName}
      >
        <div className="space-y-2">
          <Label htmlFor="team-name">
            {assistantGeneral.assistantName.title}
          </Label>
          {assistantSelected ? (
            <div className="flex items-center space-x-2">
              <Input
                id="team-name"
                value={name.name}
                onChange={(e) => {
                  setName({ ...name, name: e.target.value || "" });
                }}
              />
            </div>
          ) : (
            <InputCharging />
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="team-url">
            {assistantGeneral.assistantUrl.title}
          </Label>

          {assistantSelected ? (
            <div className="flex items-center space-x-2">
              <Input
                id="team-url"
                value={url.url || ""}
                onChange={(e) => {
                  setUrl({ ...url, valid: false, url: e.target.value });
                }}
              />
              <AnimatePresence>
                {url.url !== url.urlSave && (
                  <motion.div
                    key="button"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Button
                      className="transition-transform duration-500 transform"
                      size="sm"
                      onClick={handleUrl}
                      disabled={url.loading}
                      variant="outline"
                    >
                      {url.loading && (
                        <LoaderCircle className="h-3.5 w-3.5 animate-spin mr-1" />
                      )}
                      {assistantGeneral.assistantUrl.prove}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
              {/* <Button
                size="sm"
                onClick={handleUrl}
                variant={url.valid ? "green" : "outline"}
                disabled={
                  url.loading ||
                  url.url === assistantSelected?.localAssistant?.url
                }
              >
                {url.valid
                  ? assistantGeneral.assistantUrl.approve
                  : assistantGeneral.assistantUrl.prove}
              </Button> */}
            </div>
          ) : (
            <InputCharging />
          )}

          {url.urlExist && (
            <p className="text-sm text-muted-foreground text-red-500">
              {assistantGeneral.assistantUrl.errorExist}
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
