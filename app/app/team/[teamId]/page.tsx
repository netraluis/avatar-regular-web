"use client";
import Link from "next/link";
import { MoreHorizontal, PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppContext } from "@/components/context/appContext";
import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader } from "@/components/loader";
import {
  useDeleteAssistant,
  useFetchAssistantsByTeamId,
} from "@/components/context/useAppContext/assistant";
import { TitleLayout } from "@/components/layouts/title-layout";
import OnboardingBase from "@/components/onboarding/onboarding-base";
import { Bot } from "lucide-react";
import { useFetchTeamsByUserIdAndTeamId } from "@/components/context/useAppContext/team";

const teamIdText = {
  cardTitle: "Tauler d’Assistents ",
  cardDescription: "Crea i gestiona els assistents del teu equip",
  createAssistant: "Crear Assistent",
  errorGettingAssistants: "Error obtenint els assistents",
  name: "Nom",
  link: "Enllaç",
  visibility: "Visibilitat",
  edit: "Editar",
  delete: "Eliminar",
  createYourAssistant: "Crea el teu primer assistent",
  createYourAssistantDescription:
    "Personalitza el teu assistent en pocs passos: defineix les instruccions, afegeix fonts d’informació i ajusta el seu to de veu.",
  textActionCreateYourAssistant: "Crear assistent",
};

export default function Dashboard() {
  const router = useRouter();
  const { fetchTeamsByUserIdAndTeamId } = useFetchTeamsByUserIdAndTeamId();
  const {
    state: { teamSelected, assistantsByTeam, user },
  } = useAppContext();
  const { teamId } = useParams();
  const { loading, fetchAssistantsByTeamId, error } =
    useFetchAssistantsByTeamId();
  const { deleteAssistant } = useDeleteAssistant();

  useEffect(() => {
    if (!user?.user.id) {
      return router.push(`/login`);
    }
    fetchAssistantsByTeamId(teamId as string, user.user.id);
  }, []);

  const handleCreateNewAssistantRoute = () => {
    router.push(`/team/${teamId}/assistant/new`);
  };

  const handleDeleteAssistant = (assistantId: string) => {
    if (!user?.user.id) return;
    deleteAssistant({
      assistantId,
      userId: user.user.id,
      teamId: teamId as string,
    });
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.user.id && teamId) {
          await fetchTeamsByUserIdAndTeamId(user.user.id, teamId as string);

        } else {
          router.push(`/login`);
        }
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };


    if(!teamSelected){
      fetchData();
    }
  }, [user?.user.id, teamSelected]);

  return (
    // <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
    <TitleLayout
      cardTitle={teamIdText.cardTitle}
      cardDescription={teamIdText.cardDescription}
      urlPreview={`${process.env.PROTOCOL ? process.env.PROTOCOL : "http://"}${teamSelected?.subDomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/${teamSelected?.defaultLanguage?.toLocaleLowerCase()}`}
      actionButtonText={teamIdText.createAssistant}
      ActionButtonLogo={PlusCircle}
      actionButtonOnClick={handleCreateNewAssistantRoute}
      actionButtonLoading={loading}
      actionErrorText={teamIdText.errorGettingAssistants}
      actionError={error}
    >
      {loading ? (
        <Loader />
      ) : assistantsByTeam.length > 0 ? (
        <div className="w-full">
          <Card className="w-full">
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{teamIdText.name}</TableHead>
                    {/* <TableHead>type</TableHead> */}
                    <TableHead className="hidden md:table-cell">
                      {teamIdText.link}
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      {teamIdText.visibility}
                    </TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assistantsByTeam &&
                    assistantsByTeam.map((assistant) => (
                      <TableRow key={assistant.id}>
                        <TableCell className="font-medium">
                          <Link
                            href={`/team/${teamId}/assistant/${assistant.id}`}
                            passHref
                          >
                            {assistant.name}
                          </Link>
                        </TableCell>
                        {/* <TableCell>
                          <Badge variant="outline">GPT-4</Badge>
                        </TableCell> */}
                        <TableCell className="hidden md:table-cell">
                          <Link
                            href={`${process.env.PROTOCOL ? process.env.PROTOCOL : "http://"}${teamSelected?.subDomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/${teamSelected?.defaultLanguage?.toLocaleLowerCase()}/${assistant.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {teamSelected?.subDomain}.
                            {process.env.NEXT_PUBLIC_ROOT_DOMAIN}/
                            {teamSelected?.defaultLanguage?.toLocaleLowerCase()}/
                            {assistant.url}
                          </Link>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {assistant.status.charAt(0).toUpperCase() +
                            assistant.status.slice(1).toLowerCase()}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                aria-haspopup="true"
                                size="icon"
                                variant="ghost"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <Link
                                href={`/team/${teamId}/assistant/${assistant.id}`}
                                passHref
                              >
                                <DropdownMenuItem>
                                  {teamIdText.edit}
                                </DropdownMenuItem>
                              </Link>

                              {/* <DropdownMenuItem
                                onClick={() => {
                                  console.log("Clone clicando");
                                }}
                              >
                                Clone
                              </DropdownMenuItem> */}
                              {/* <DropdownMenuItem>Favorite</DropdownMenuItem> */}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  handleDeleteAssistant(assistant.id);
                                }}
                              >
                                {teamIdText.delete}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="w-full flex items-center justify-center">
          <div className="flex flex-col justify-center">
            <OnboardingBase
              title={teamIdText.createYourAssistant}
              description={teamIdText.createYourAssistantDescription}
              loading={false}
              backAction={() => {}}
              nextAction={handleCreateNewAssistantRoute}
              backActionText=""
              nextActionText={teamIdText.textActionCreateYourAssistant}
              backActionActive={false}
              nextActionActive={true}
              error={false}
              errorText=""
              logo={Bot}
            />
          </div>
        </div>
      )}
    </TitleLayout>
    // </main>
  );
}
