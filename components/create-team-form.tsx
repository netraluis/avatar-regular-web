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
import { useAppContext, useCreateTeam } from "./context/appContext";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

function CreateTeamForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const { user, setTeams, teams } = useAppContext();

  const { loadingCreateTeam, createTeamData, createTeam } =
    useCreateTeam();

  const createHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formRef.current) {
      const formData = new FormData(formRef.current);
      const teamName = formData.get("name") as string;
      createTeam({ teamName, userId: user.id });
    }
  };

  useEffect(() => {
    console.log({ createTeamData });
    if (createTeamData) {
      setTeams([...teams, createTeamData]);
      router.push(`/team/${createTeamData?.id}`);
    }
  }, [createTeamData]);

  return (
    <div className="flex items-center justify-center ">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create a team</CardTitle>
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
              disabled={loadingCreateTeam}
              className="w-full"
            >
              {loadingCreateTeam ? "Creando" : "Save"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default CreateTeamForm;
