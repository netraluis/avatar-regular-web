"use client";
import { useAppContext } from "@/components/context/appContext";
import { useCreateAssistant } from "@/components//context/useAppContext/assistant";
import OnboardingBase from "@/components/onboarding/onboarding-base";
import { Input } from "@/components/ui/input";
import { useParams, useRouter } from "next/navigation";
import { AssistantCreateParams } from "openai/resources/beta/assistants.mjs";
import { useEffect, useState } from "react";
import slugify from "slugify";
import { v4 as uuidv4 } from "uuid";
import { ChatModel } from "@/types/types";
import { useDashboardLanguage } from "@/components/context/dashboardLanguageContext";

export default function Page() {
  const { t } = useDashboardLanguage();
  const newAssistant = t("app.TEAM.TEAM_ID.ASSISTANT.NEW.PAGE");

  const router = useRouter();
  const { teamId } = useParams();
  const {
    state: { user, teams },
  } = useAppContext();
  const {
    loadingCreateAssistant,
    createAssistantData,
    createAssistant,
    errorCreateAssistant,
  } = useCreateAssistant();
  const [assistantName, setAssistantName] = useState("");

  const backAction = () => {
    router.push(`/team/${teamId}`);
  };

  const nextAction = async () => {
    const uuid = uuidv4();
    if (!user?.user.id) {
      router.push("/login");
    }

    const assistantCreateParams: AssistantCreateParams = {
      name: assistantName,
      model: ChatModel.GPT3,
      temperature: 1,
      top_p: 0.5,
    };

    const slug = slugify(assistantName, { lower: true, strict: true });

    createAssistant({
      assistantCreateParams,
      teamId: teamId as string,
      url: `${slug}-${uuid}`,
      userId: user!.user.id,
    });
  };

  useEffect(() => {
    if (createAssistantData) {
      router.push(
        `/team/${teamId}/assistant/${createAssistantData.id}/instructions`,
      );
    }
  }, [createAssistantData]);

  return (
    <OnboardingBase
      title={newAssistant.title}
      description={newAssistant.description}
      backAction={backAction}
      nextAction={nextAction}
      backActionText={newAssistant.backActionText}
      nextActionText={newAssistant.nextActionText}
      loading={loadingCreateAssistant}
      backActionActive={teams.teams.length > 0}
      nextActionActive={!!assistantName}
      error={errorCreateAssistant}
      errorText={newAssistant.errorText}
    >
      <div className="space-y-2">
        <div className="py-1 space-y-1">
          <label
            htmlFor="name"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {newAssistant.name}
          </label>
          <Input
            id="name"
            name="name"
            placeholder="Acme Inc."
            value={assistantName}
            onChange={(e) => setAssistantName(e.target.value)} // Actualiza el estado al cambiar
          />
        </div>
      </div>
    </OnboardingBase>
  );
}
