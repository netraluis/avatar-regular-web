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
import { useDashboardLanguage } from "@/components/context/dashboardLanguageContext";
import { TextAreaForm } from "@/components/text-area-forms/textAreaForm";
import { CustomCard } from "@/components/custom-card";

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

  const {
    state: { assistantSelected },
  } = useAppContext();

  const [assistantValues, setAssistantValues] = React.useState<AssistantUpdateParams | null>(null);

  const [assistantValuesDefault, setAssistantValuesDefault] = React.useState<AssistantUpdateParams | null>(null);

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

    const assistantValues: AssistantUpdateParams = {
      model:
        (assistantSelected?.openAIassistant.model as ChatModel) ||
        ChatModel.GPT3,
      instructions: assistantSelected?.openAIassistant.instructions || "",
      temperature: assistantSelected?.openAIassistant.temperature || 0.5,
      top_p: assistantSelected?.openAIassistant.top_p || 0.5,
    }

    setAssistantValues(assistantValues);

    setAssistantValuesDefault(assistantValues)

    console.log({ assistantValues, assistantValuesDefault },
      assistantValues?.model === assistantValuesDefault?.model,
      assistantValues?.instructions === assistantValuesDefault?.instructions,
      assistantValues?.temperature === assistantValuesDefault?.temperature,
      assistantValues?.top_p === assistantValuesDefault?.top_p,
      assistantValues === assistantValuesDefault);
  }, [assistantSelected]);

  const handleSendMessage = () => {
    if (message.trim()) {
      submitMessage(message);
      setMessage("");
    }
  };

  const handleUpdate = async () => {
    if (assistantValues?.instructions === "")
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

  const temperatureOptions = [
    {
      value: 0.2,
      label: playground.adjustments.temperatureOptions[0]
    },
    {
      value: 0.6,
      label: playground.adjustments.temperatureOptions[1],
    },
    {
      value: 1,
      label: playground.adjustments.temperatureOptions[2],
    },
    {
      value: 1.4,
      label: playground.adjustments.temperatureOptions[3],
    },
    {
      value: 1.8,
      label: playground.adjustments.temperatureOptions[4],
    },
  ]

  const topPOptions = [
    {
      value: 0.1,
      label: playground.adjustments.topPOptions[0],
    },
    {
      value: 0.3,
      label: playground.adjustments.topPOptions[1],
    },
    {
      value: 0.5,
      label: playground.adjustments.topPOptions[2],
    },
    {
      value: 0.7,
      label: playground.adjustments.topPOptions[3],
    },
    {
      value: 0.9,
      label: playground.adjustments.topPOptions[4],
    },
  ]

  const hasChange = assistantValues?.model !== assistantValuesDefault?.model ||
  (assistantValues?.instructions !== assistantValuesDefault?.instructions && assistantValues?.instructions !== "") ||
  assistantValues?.temperature !== assistantValuesDefault?.temperature ||
  assistantValues?.top_p !== assistantValuesDefault?.top_p;

  return (
    <TitleLayout
      cardTitle={playground.title}
      cardDescription={playground.description}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 grow overflow-hidden w-full">
        {/* <Card className="p-6 w-full h-full border overflow-auto"> */}
        <CustomCard
          title={playground.adjustments.title}
          description={playground.adjustments.description}
          action={handleUpdate}
          loading={loading}
          valueChange={hasChange}
        // className="flex-grow"
        >
          <form className="space-y-6 h-full overflow-auto scrollbar-hidden mx-2">
            <div className='m-2 space-y-2'>
              <Label htmlFor="model">{playground.adjustments.model}</Label>
              {assistantValues?.model ? (
                <Select
                  defaultValue={assistantValues.model}
                  value={assistantValues.model}
                  onValueChange={(value) => {
                    setAssistantValues({
                      ...assistantValues,
                      model: value as ChatModel,
                    });
                  }}
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
            <div className='m-2 space-y-2'>
              <Label htmlFor="model">{playground.adjustments.temperature}</Label>
              <p className="text-sm text-gray-500 my-1">
                {playground.adjustments.temperatureDescription}
              </p>
              {assistantValues?.model ? (
                <Select
                  defaultValue={`${assistantValues.temperature}`}
                  value={`${assistantValues.temperature}`}
                  onValueChange={(value) => {
                    setAssistantValues({
                      ...assistantValues,
                      temperature: parseFloat(value),
                    })
                  }}
                >
                  <SelectTrigger id="model">
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    {temperatureOptions.map((model) => (
                      <SelectItem key={model.value} value={`${model.value}`}>
                        {model.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <InputCharging />
              )}
            </div>
            <div className='m-2 space-y-2'>
              <Label htmlFor="model">{playground.adjustments.topP}</Label>
              <p className="text-sm text-gray-500 mt-1">
                {playground.adjustments.topPDescription}
              </p>
              {assistantValues?.model ? (
                <Select
                  defaultValue={`${assistantValues.top_p}`}
                  value={`${assistantValues.top_p}`}
                  onValueChange={(value) => {
                    setAssistantValues({
                      ...assistantValues,
                      top_p: parseFloat(value),
                    })
                  }}
                >
                  <SelectTrigger id="model">
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    {topPOptions.map((model) => (
                      <SelectItem key={model.value} value={`${model.value}`}>
                        {model.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <InputCharging />
              )}
            </div>
            <div className='m-2 space-y-2'>
              <Label htmlFor="instructions">
                {playground.adjustments.instructions}
              </Label>
              {assistantValues && !assistantValues.instructions && <p className="text-xs text-red-500 mt-1">{playground.adjustments.instructionNotEmpty}</p>}
              <div className="mb-4 p-2">
                {assistantValues ? (
                  <Textarea
                    id="instructions"
                    placeholder="Type your instructions here"
                    className="h-[400px] "
                    value={assistantValues.instructions || ""}
                    onChange={(e) => {
                      setAssistantValues({
                        ...assistantValues,
                        instructions: e.target.value,
                      })
                    }}
                  />
                ) : (
                  <TextAreaCharging />
                )}
              </div>
              {localError && (
                <p className="text-xs text-red-500 mt-1">{localError}</p>
              )}
            </div>
          </form>
        </CustomCard>
        {/* </Card> */}
        <Card className="flex flex-col relative overflow-hidden w-full grow overflow-auto">
          <CardHeader>
            <CardTitle>{playground.adjustments.output}</CardTitle>
          </CardHeader>
          <div
            className="overflow-y-auto grow scrollbar-hidden h-full mt-4"
            ref={scrollRef}
          >
            <CardContent className="space-y-4 border-t pt-4 pb-9" ref={messagesRef}>
              {messages &&
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded-lg ${msg.role === "user"
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
          {!hasChange && <div className="w-full h-24">
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
          </div>}
        </Card>
      </div>
    </TitleLayout>
  );
}
