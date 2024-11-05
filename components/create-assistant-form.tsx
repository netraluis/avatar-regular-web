"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useAppContext } from "./context/appContext";
import { useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { AssistantCreateParams } from "openai/resources/beta/assistants.mjs";
import { ChatModel } from "@/types/types";
import { useCreateAssistant } from "./context/useAppContext/assistant";

function CreateAssistantForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const {
    state: { user },
  } = useAppContext();

  const { teamId } = useParams();

  const { loadingCreateAssistant, createAssistantData, createAssistant } =
    useCreateAssistant();

  const createHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formRef.current) {
      const formData = new FormData(formRef.current);
      const assisantName = formData.get("name") as string;
      const assistantCreateParams: AssistantCreateParams = {
        name: assisantName,
        model: ChatModel.GPT3,
      };
      createAssistant({
        assistantCreateParams,
        teamId: teamId as string,
        userId: user?.user?.id,
      });
    }
  };

  useEffect(() => {
    console.log("hola", { createAssistantData });
    if (createAssistantData) {
      router.push(`/team/${teamId}/assistant/${createAssistantData?.id}`);
    }
  }, [createAssistantData]);

  return (
    <div className="flex items-center justify-center ">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Create an assistant
          </CardTitle>
          <CardDescription>
            Deploy your new project in one-click.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={formRef} onSubmit={createHandler} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Name
              </label>
              <Input id="name" name="name" placeholder="Acme" />
            </div>
            <Button
              type="submit"
              disabled={loadingCreateAssistant}
              className="w-full"
            >
              {loadingCreateAssistant ? "Creando" : "Save"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default CreateAssistantForm;
