"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { LoaderCircle, Save } from "lucide-react";
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

const playground = {
  title: "Zona de proves",
  description:
    "La zona de proves et permet experimentar amb diferents configuracions sense afectar el chatbot en directe.",
  model: "Model",
  instructions: "Instruccions",
  temperature: "Temperatura",
  topP: "Top P",
  output: "Sortida",
  typeYourMessageHere: "Escriu el teu missatge aquí...",
  send: "Enviar",
  save: "Desar canvis",
};

export default function Playground() {
  const { state } = useAppContext();
  const { assistantId } = useParams();
  const router = useRouter();
  const [message, setMessage] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const [assistantValues, setAssistantValues] = React.useState({
    model: "gpt-4",
    instructions: "",
    temperature: 0.5,
    top_p: 0.5,
  });

  const { getAssistantData, getAssistant } = useGetAssistant();
  const { updateAssistant } = useUpdateAssistant();

  React.useEffect(() => {
    if (assistantId && state.user?.user?.id) {
      getAssistant({
        assistantId: assistantId as string,
        userId: state.user.user.id,
      });
    } else {
      router.push("/login");
    }
  }, []);

  React.useEffect(() => {
    if (!getAssistantData?.openAIassistant) return;

    setAssistantValues({
      model: getAssistantData.openAIassistant.model || "gpt-4",
      instructions: getAssistantData.openAIassistant.instructions || "",
      temperature: getAssistantData.openAIassistant.temperature || 0.5,
      top_p: getAssistantData.openAIassistant.top_p || 0.5,
    });
  }, [getAssistantData]);

  const handleSendMessage = () => {
    if (message.trim()) {
      submitMessage(message);
      setMessage("");
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      if (assistantValues && assistantId && state.user?.user?.id)
        await updateAssistant({
          assistantId: assistantId as string,
          userId: state.user.user.id,
          openAIassistantUpdateParams: assistantValues,
          localAssistantUpdateParams: {},
        });
    } catch (error) {
      console.error("An error occurred while updating the assistant", error);
    } finally {
      setLoading(false);
    }
  };

  const { submitMessage, messages } = useAssistant({
    assistantId: assistantId as string,
    userId: state.user?.user?.id,
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

  return (
    <div className="container mx-auto p-4 grow flex flex-col overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{playground.title}</h1>
        {getAssistantData ? (
          <Button onClick={handleUpdate}>
            {loading ? (
              <LoaderCircle className="h-3.5 w-3.5 mr-2 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5 mr-2" />
            )}{" "}
            {playground.save}
          </Button>
        ) : (
          <SelectCharging />
        )}
      </div>
      <p className="text-sm text-gray-500 mb-4">{playground.description}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 grow overflow-hidden">
        <Card className="p-6">
          <form className="space-y-6">
            <div>
              <Label htmlFor="model">{playground.model}</Label>
              {getAssistantData?.openAIassistant.model ? (
                <Select
                  defaultValue={assistantValues.model}
                  value={assistantValues.model}
                  onValueChange={(value) =>
                    setAssistantValues((prev) => ({ ...prev, model: value }))
                  }
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
              <Label htmlFor="instructions">{playground.instructions}</Label>
              {getAssistantData?.openAIassistant.instructions ? (
                <Textarea
                  id="instructions"
                  placeholder="Type your instructions here"
                  className="h-[100px]"
                  value={assistantValues.instructions}
                  onChange={(e) =>
                    setAssistantValues((prev) => ({
                      ...prev,
                      instructions: e.target.value,
                    }))
                  }
                />
              ) : (
                <TextAreaCharging />
              )}
              <p className="text-xs text-gray-500 mt-1">
                Customize your chatbot personality and style with specific
                instructions.
              </p>
            </div>
            <div>
              <Label htmlFor="temperature">
                {playground.temperature}:{" "}
                {getAssistantData?.openAIassistant.temperature
                  ? assistantValues.temperature.toFixed(2)
                  : ""}
              </Label>
              {getAssistantData?.openAIassistant.temperature ? (
                <Slider
                  className="mt-3"
                  id="temperature"
                  min={0}
                  max={2}
                  step={0.01}
                  value={[assistantValues.temperature]}
                  onValueChange={(value) =>
                    setAssistantValues((prev) => ({
                      ...prev,
                      temperature: value[0],
                    }))
                  }
                />
              ) : (
                <InputCharging />
              )}
            </div>
            <div>
              <Label htmlFor="top-p">
                {playground.topP}:{" "}
                {getAssistantData?.openAIassistant.top_p
                  ? assistantValues.top_p.toFixed(2)
                  : ""}
              </Label>
              {getAssistantData?.openAIassistant.top_p ? (
                <Slider
                  className="mt-3"
                  id="top-p"
                  min={0}
                  max={1}
                  step={0.01}
                  value={[assistantValues.top_p]}
                  onValueChange={(value) =>
                    setAssistantValues((prev) => ({ ...prev, top_p: value[0] }))
                  }
                />
              ) : (
                <InputCharging />
              )}
            </div>
          </form>
        </Card>
        <Card className="flex flex-col relative overflow-hidden ">
          <CardHeader>
            <CardTitle>{playground.output}</CardTitle>
          </CardHeader>
          <div
            className="overflow-y-auto grow scrollbar-hidden"
            ref={scrollRef}
          >
            <CardContent className=" space-y-4 " ref={messagesRef}>
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
          <div className="w-full">
            <div className="p-4 border-t flex items-center space-x-2">
              <Input
                placeholder={playground.typeYourMessageHere}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              {/* <Button size="icon" variant="ghost">
                <Mic className="h-4 w-4" />
              </Button> */}
              {getAssistantData ? (
                <Button onClick={handleSendMessage}>{playground.send}</Button>
              ) : (
                <SelectCharging />
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
