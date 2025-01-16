"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useParams, useRouter } from "next/navigation";
import { useAppContext } from "@/components/context/appContext";
import { useScrollAnchor } from "@/lib/hooks/use-scroll-anchor";
import { ChatModel } from "@/types/types";
import {
  useAssistant,
  useGetAssistant,
  useUpdateAssistant,
} from "@/components/context/useAppContext/assistant";
import {
  InputCharging,
  SelectCharging,
  TextAreaCharging,
} from "@/components/loaders/loadersSkeleton";
import { TitleLayout } from "@/components/layouts/title-layout";
import { AssistantUpdateParams } from "openai/resources/beta/assistants.mjs";
import { SaveButton } from "@/components/save-button";
import { useDashboardLanguage } from "@/components/context/dashboardLanguageContext";
import { TextAreaForm } from "@/components/text-area-forms/textAreaForm";

export default function Playground() {
  const { t } = useDashboardLanguage();
  const playground = t(
    "app.TEAM.TEAM_ID.ASSISTANT.ASSISTANT_ID.PLAYGROUND.PAGE",
  );

  const textAreaForm = t("app.COMPONENTS.TEXT_AREA_FORM");

  const { state } = useAppContext();
  const { assistantId, teamId } = useParams();
  const router = useRouter();
  const [message, setMessage] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [localError, setLocalError] = React.useState<any>(undefined);
  const [instructions, setInstructions] = React.useState("");
  const [loadingInstructions, setLoadingInstructions] = React.useState(false);

  const {
    state: { assistantSelected },
  } = useAppContext();

  const [assistantValues, setAssistantValues] = React.useState<{
    model: ChatModel;
    instructions: string;
    temperature: number;
    top_p: number;
  } | null>(null);

  const { getAssistant } = useGetAssistant();
  const { updateAssistant } = useUpdateAssistant();

  React.useEffect(() => {
    if (assistantId && state.user?.user?.id) {
      if (!assistantSelected) {
        getAssistant({
          assistantId: assistantId as string,
          userId: state.user.user.id,
          teamId: teamId as string,
        });
      }
    } else {
      router.push("/login");
    }
  }, [assistantId, state.user?.user?.id, assistantSelected]);

  React.useEffect(() => {
    if (!assistantSelected?.openAIassistant) return;

    setAssistantValues({
      model:
        (assistantSelected?.openAIassistant.model as ChatModel) ||
        ChatModel.GPT3,
      instructions: assistantSelected?.openAIassistant.instructions || "",
      temperature: assistantSelected?.openAIassistant.temperature || 0.5,
      top_p: assistantSelected?.openAIassistant.top_p || 0.5,
    });
    setInstructions(assistantSelected?.openAIassistant.instructions || "");
  }, [assistantSelected]);

  const handleSendMessage = () => {
    if (message.trim()) {
      submitMessage(message);
      setMessage("");
    }
  };

  const handleUpdate = async (assistantValues: AssistantUpdateParams) => {
    if (assistantValues.instructions === "")
      return setLocalError("Instructions are required");
    setLoading(true);
    try {
      if (assistantValues && assistantId && state.user?.user?.id)
        await updateAssistant({
          assistantId: assistantId as string,
          userId: state.user.user.id,
          openAIassistantUpdateParams: assistantValues,
          localAssistantUpdateParams: {},
          teamId: teamId as string,
        });
    } catch (error) {
      console.error("An error occurred while updating the assistant", error);
    } finally {
      setLoading(false);
    }
  };

  const { submitMessage, messages, status } = useAssistant({
    assistantId: assistantId as string,
    userId: state.user?.user?.id,
    teamId: teamId as string,
  });

  const {
    messagesRef,
    scrollRef,
    visibilityRef,

    // isAtBottom, scrollToBottom
  } = useScrollAnchor();

  React.useEffect(() => {
    // Si `messagesRef` está disponible y tiene el último mensaje
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  // eslint-disable-next-line
  const handleKeyDown = (event: any) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevent the default action to avoid a new line
      onClickButton(event);
    }
  };

  // eslint-disable-next-line
  const onClickButton = (e: any) => {
    handleSendMessage();
  };

  return (
    <TitleLayout
      cardTitle={playground.title}
      cardDescription={playground.description}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 grow overflow-hidden w-full">
        <Card className="p-6 w-full h-full border overflow-auto">
          <form className="space-y-6">
            <div>
              <Label htmlFor="model">{playground.adjustments.model}</Label>
              {assistantValues?.model ? (
                <Select
                  defaultValue={assistantValues.model}
                  value={assistantValues.model}
                  onValueChange={(value) => handleUpdate({ model: value })}
                >
                  <SelectTrigger id="model">
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ChatModel).map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <InputCharging />
              )}
            </div>
            <div>
              <Label htmlFor="instructions">
                {playground.adjustments.instructions}
              </Label>
              <div className="mb-3">
                {assistantValues ? (
                  <Textarea
                    id="instructions"
                    placeholder="Type your instructions here"
                    className="h-[100px] "
                    value={instructions || ""}
                    onChange={(e) => {
                      setInstructions(e.target.value);
                    }}
                  />
                ) : (
                  <TextAreaCharging />
                )}
              </div>
              {localError && (
                <p className="text-xs text-red-500 mt-1">{localError}</p>
              )}
              <SaveButton
                action={async (e: any) => {
                  e.preventDefault();
                  setLoadingInstructions(true);
                  await handleUpdate({ instructions });
                  setLoadingInstructions(false);
                }}
                loading={loadingInstructions}
                actionButtonText={"desa"}
                valueChange={
                  !assistantValues?.instructions ||
                  assistantValues?.instructions === instructions
                }
              />
            </div>
            <div>
              <Label htmlFor="temperature">
                {playground.adjustments.temperature}:{" "}
                {assistantValues?.temperature
                  ? assistantValues.temperature.toFixed(2)
                  : ""}
              </Label>
              {assistantValues?.temperature ? (
                <Slider
                  className="mt-3"
                  id="temperature"
                  min={0}
                  max={2}
                  step={0.01}
                  value={[assistantValues.temperature]}
                  onValueChange={(value) =>
                    setAssistantValues({
                      ...assistantValues,
                      temperature: value[0],
                    })
                  }
                  onValueCommit={(value) => {
                    handleUpdate({ temperature: value[0] });
                  }}
                />
              ) : (
                <InputCharging />
              )}
              <p className="text-xs text-gray-500 mt-1">
                {playground.adjustments.temperatureDescription}
              </p>
            </div>
            <div>
              <></>
              <Label htmlFor="top-p">
                {playground.adjustments.topP}:{" "}
                {assistantValues?.top_p
                  ? assistantValues?.top_p.toFixed(2)
                  : ""}
              </Label>
              {assistantValues?.top_p ? (
                <Slider
                  className="mt-3"
                  id="top-p"
                  min={0.01}
                  max={1}
                  step={0.01}
                  value={[assistantValues.top_p]}
                  onValueChange={(value) => {
                    setAssistantValues({ ...assistantValues, top_p: value[0] });
                  }}
                  onValueCommit={(value) => {
                    handleUpdate({ top_p: value[0] });
                  }}
                />
              ) : (
                <InputCharging />
              )}
              <p className="text-xs text-gray-500 mt-1">
                {playground.adjustments.topPDescription}
              </p>
            </div>
          </form>
        </Card>
        <Card className="flex flex-col relative overflow-hidden w-full grow overflow-auto">
          <CardHeader>
            <CardTitle>{playground.adjustments.output}</CardTitle>
          </CardHeader>
          <div
            className="overflow-y-auto grow scrollbar-hidden h-full"
            ref={scrollRef}
          >
            <CardContent className=" space-y-4 border-t" ref={messagesRef}>
              {messages &&
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded-lg ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {msg.message}
                  </div>
                ))}
              <div className="w-full h-px" ref={visibilityRef} />
            </CardContent>
          </div>
          <div className="w-full h-24">
            <div className=" flex items-center space-x-2 static">
              {/* <Input
                placeholder={playground.typeYourMessageHere}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              /> */}
              {/* <Button size="icon" variant="ghost">
                <Mic className="h-4 w-4" />
              </Button> */}
              {assistantValues ? (
                // <Button onClick={handleSendMessage}>{playground.send}</Button>
                <TextAreaForm
                  handleInputChange={handleTextareaChange}
                  handleKeyDown={handleKeyDown}
                  input={message}
                  loading={loading}
                  submitMessage={handleSendMessage}
                  status={status}
                  showFooter={false}
                  text={textAreaForm}
                />
              ) : (
                <SelectCharging />
              )}
            </div>
          </div>
        </Card>
      </div>
    </TitleLayout>
  );
}
