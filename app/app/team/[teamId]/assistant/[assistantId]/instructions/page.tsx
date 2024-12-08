"use client";
import { useAppContext } from "@/components/context/appContext";
import {
  useGetAssistant,
  useUpdateAssistant,
} from "@/components//context/useAppContext/assistant";
import OnboardingBase from "@/components/onboarding/onboarding-base";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TextAreaCharging } from "@/components/loaders/loadersSkeleton";
import { Textarea } from "@/components/ui/textarea";

const newInstructions = {
  title: "Escriu les instruccions del teu assistent",
  description:
    "Defineix com vols que el teu assistent funcioni. Escriu les indicacions clares i específiques que guiaran les seves respostes per assegurar una experiència personalitzada i coherent.",
  backActionText: "Enrere",
  nextActionText: "Continuar",
  subName:
    "Recorda: unes bones instruccions són clau per a un assistent eficaç! ",
  errorText: "Error al crear les instruccions",
  placeholder: "Escriu les instruccions aquí",
};

interface AssistantValues {
  model: string;
  instructions: string;
  temperature: number;
  top_p: number;
}

export default function Page() {
  const { state } = useAppContext();
  const { assistantId, teamId } = useParams();
  const router = useRouter();
  const {
    state: { user, teams },
  } = useAppContext();
  const {
    loadingUpdateAssistant,
    updateAssistantData,
    updateAssistant,
    errorUpdateAssistant,
  } = useUpdateAssistant();
  const { getAssistantData, getAssistant } = useGetAssistant();
  const [assistantValues, setAssistantValues] = useState<
    AssistantValues | undefined
  >(undefined);

  useEffect(() => {
    if (assistantId && state.user?.user?.id) {
      getAssistant({
        assistantId: assistantId as string,
        userId: state.user.user.id,
        teamId: teamId as string,
      });
    } else {
      router.push("/login");
    }
  }, []);

  useEffect(() => {
    if (!getAssistantData?.openAIassistant) return;

    setAssistantValues({
      model: getAssistantData.openAIassistant.model || "gpt-4",
      instructions: getAssistantData.openAIassistant.instructions || "",
      temperature: getAssistantData.openAIassistant.temperature || 0.5,
      top_p: getAssistantData.openAIassistant.top_p || 0.5,
    });
  }, [getAssistantData]);

  const backAction = () => {
    router.push("/team");
  };

  const nextAction = async () => {
    if (user?.user.id) {
      updateAssistant({
        assistantId: assistantId as string,
        userId: state?.user?.user?.id || "",
        openAIassistantUpdateParams: assistantValues,
        localAssistantUpdateParams: {},
        teamId: teamId as string,
      });
    } else {
      router.push("/login");
    }
  };

  useEffect(() => {
    if (updateAssistantData) {
      router.push(`/team/${teamId}/assistants/${assistantId}/files`);
    }
  }, [updateAssistantData]);

  return (
    <OnboardingBase
      title={newInstructions.title}
      description={newInstructions.description}
      backAction={backAction}
      nextAction={nextAction}
      backActionText={newInstructions.backActionText}
      nextActionText={newInstructions.nextActionText}
      loading={loadingUpdateAssistant}
      backActionActive={teams.length > 0}
      nextActionActive={!!assistantValues?.instructions}
      error={errorUpdateAssistant}
      errorText={newInstructions.errorText}
    >
      <div className="space-y-2">
        <div className="py-1 space-y-1">
          {assistantValues ? (
            <Textarea
              id="name"
              name="name"
              placeholder={newInstructions.placeholder}
              value={assistantValues?.instructions}
              onChange={(e) => {
                setAssistantValues({
                  ...assistantValues,
                  instructions: e.target.value,
                });
              }} // Actualiza el estado al cambiar
              className="min-h-[160px]"
            />
          ) : (
            <TextAreaCharging />
          )}
          <p className="text-muted-foreground text-sm">
            {newInstructions.subName}
          </p>
        </div>
      </div>
    </OnboardingBase>
  );
}
