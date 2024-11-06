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
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateTeam } from "./context/useAppContext/team";
import slugify from "slugify";
import { LanguageType } from "@prisma/client";

function CreateTeamForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [teamName, setTeamName] = useState("");
  const [subdomain, setSubdomain] = useState("");

  const {
    state: { user },
  } = useAppContext();

  const { loadingCreateTeam, createTeamData, createTeam } = useCreateTeam();

  const createHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formRef.current) {
      // const formData = new FormData(formRef.current);
      // const teamName = formData.get("name") as string;
      createTeam({
        data: {
          name: teamName,
          subDomain: subdomain,
          defaultLanguage: LanguageType.ES,
        },
        userId: user.user.id,
      });
    }
  };

  useEffect(() => {
    if (createTeamData) {
      router.push(`/team/${createTeamData?.id}`);
    }
  }, [createTeamData]);

  // Función para actualizar el subdominio cada vez que se cambia el nombre
  const handleTeamNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setTeamName(name);

    // Convertimos el nombre en un slug para el subdominio
    const slug = slugify(name, { lower: true, strict: true });
    setSubdomain(slug);
  };

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
              <Input
                id="name"
                name="name"
                placeholder="Acme"
                value={teamName}
                onChange={handleTeamNameChange} // Actualiza el estado al cambiar
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="subdomain"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Subdomain
              </label>
              <Input
                id="subdomain"
                name="subdomain"
                placeholder="acme"
                value={subdomain}
                disabled // Desactivado porque es solo para visualización
              />
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
