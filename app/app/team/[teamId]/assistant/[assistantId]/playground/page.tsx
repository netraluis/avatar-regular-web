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
import { Mic } from "lucide-react";
import { useParams } from "next/navigation";
import {
  useAppContext,
  useAssistant,
  useGetAssistant,
  useUpdateAssistant,
} from "@/components/context/appContext";
import { useScrollAnchor } from "@/lib/hooks/use-scroll-anchor";
import { ChatModel } from "@/types/types";

export default function Playground() {
  const { state } = useAppContext();
  const { assistantId } = useParams();
  const [message, setMessage] = React.useState("");
  const [threadId, setThreadId] = React.useState<string | undefined>();

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
    }
  }, []);

  React.useEffect(() => {
    if (!getAssistantData) return;
    console.log({ getAssistantData });

    setAssistantValues({
      model: getAssistantData.model || "gpt-4",
      instructions: getAssistantData.instructions || "",
      temperature: getAssistantData.temperature || 0.5,
      top_p: getAssistantData.top_p || 0.5,
    });
  }, [getAssistantData]);

  const handleSendMessage = () => {
    if (message.trim()) {
      submitMessage(message);
      setMessage("");
    }
  };

  const handleUpdate = async () => {
    try {
      if (assistantValues && assistantId && state.user?.user?.id)
        updateAssistant({
          assistantId: assistantId as string,
          userId: state.user.user.id,
          assistantUpdateParams: assistantValues,
        });
    } catch (error) {
      console.error("An error occurred while updating the assistant", error);
    }
  };

  const { submitMessage, internatlThreadId, messages } = useAssistant({
    threadId: threadId,
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
    setThreadId(internatlThreadId);
  }, [internatlThreadId]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Playground</h1>
        <Button onClick={handleUpdate}>Save changes</Button>
      </div>
      <p className="text-sm text-gray-500 mb-4">
        The playground allows you to experiment with different configurations
        without affecting the live chatbot.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
        <Card className="p-6">
          <form className="space-y-6">
            <div>
              <Label htmlFor="model">Model</Label>
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
            </div>
            <div>
              <Label htmlFor="instructions">Instructions</Label>
              <Textarea
                id="instructions"
                placeholder="Type your instructions here"
                className="h-32"
                value={assistantValues.instructions}
                onChange={(e) =>
                  setAssistantValues((prev) => ({
                    ...prev,
                    instructions: e.target.value,
                  }))
                }
              />
              <p className="text-xs text-gray-500 mt-1">
                Customize your chatbot personality and style with specific
                instructions.
              </p>
            </div>
            <div>
              <Label htmlFor="temperature">
                Temperature: {assistantValues.temperature.toFixed(2)}
              </Label>
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
            </div>
            <div>
              <Label htmlFor="top-p">
                Top P: {assistantValues.top_p.toFixed(2)}
              </Label>
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
            </div>
          </form>
        </Card>
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Output</CardTitle>
          </CardHeader>
          <div className="md:h-96 overflow-y-auto " ref={scrollRef}>
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
          <div className="p-4 border-t flex items-center space-x-2">
            <Input
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <Button size="icon" variant="ghost">
              <Mic className="h-4 w-4" />
            </Button>
            <Button onClick={handleSendMessage}>Send</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
