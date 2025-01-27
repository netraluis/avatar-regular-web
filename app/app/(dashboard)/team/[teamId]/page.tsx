"use client";
import Link from "next/link";
import { Eye, MoreHorizontal, EyeOff } from "lucide-react";

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
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader } from "@/components/loader";
import {
  useDeleteAssistant,
  useFetchAssistantsByTeamId,
  useUpdateAssistant,
} from "@/components/context/useAppContext/assistant";
import { TitleLayout } from "@/components/layouts/title-layout";
import OnboardingBase from "@/components/onboarding/onboarding-base";
import { Bot } from "lucide-react";
import { useFetchTeamsByUserIdAndTeamId } from "@/components/context/useAppContext/team";
import { useDashboardLanguage } from "@/components/context/dashboardLanguageContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AssitantStatus } from "@prisma/client";
import { InputCharging } from "@/components/loaders/loadersSkeleton";

export default function Dashboard() {
  const { t } = useDashboardLanguage();
  const teamIdText = t("app.TEAM.TEAM_ID.PAGE");

  const router = useRouter();
  const { fetchTeamsByUserIdAndTeamId } = useFetchTeamsByUserIdAndTeamId();
  const {
    state: { teamSelected, assistantsByTeam, user },
  } = useAppContext();
  const { teamId } = useParams();
  const { loading, fetchAssistantsByTeamId } = useFetchAssistantsByTeamId();
  const { deleteAssistant } = useDeleteAssistant();
  const { updateAssistant, loadingUpdateAssistant } = useUpdateAssistant();

  const [loadingIndexUpdate, setLoadingIndexUpdate] = useState<number | null>(
    null,
  );

  useEffect(() => {
    if (!user?.user.id) {
      return router.push(`/login`);
    }
    fetchAssistantsByTeamId(teamId as string, user.user.id);
  }, [teamId]);

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

    if (!teamSelected) {
      fetchData();
    }
  }, [user?.user.id]);

  useEffect(() => {}, [loadingUpdateAssistant]);

  const handleChangeStatus = async (status: AssitantStatus, index: number) => {
    if (!user?.user.id) return;
    if (status === assistantsByTeam[index].status) return;

    setLoadingIndexUpdate(index);
    await updateAssistant({
      assistantId: assistantsByTeam[index].id,
      userId: user.user.id,
      teamId: teamId as string,
      openAIassistantUpdateParams: {},
      localAssistantUpdateParams: { status },
    });
    setLoadingIndexUpdate(null);
  };

  const visibilityImages = {
    PUBLIC: <Eye className="h-4 w-4 mr-2" />,
    PRIVATE: <EyeOff className="h-4 w-4 mr-2" />,
  };

  return (
    // <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
    <TitleLayout
      cardTitle={teamIdText.cardTitle}
      cardDescription={teamIdText.cardDescription}
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
                    assistantsByTeam.map((assistant, index) => (
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
                        <TableCell className="hidden md:table-cell truncate">
                          <Link
                            href={`${process.env.NEXT_PUBLIC_PROTOCOL ? process.env.NEXT_PUBLIC_PROTOCOL : "http://"}${teamSelected?.subDomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/${teamSelected?.defaultLanguage?.toLocaleLowerCase()}/${assistant.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {teamSelected?.subDomain}.
                            {process.env.NEXT_PUBLIC_ROOT_DOMAIN}/
                            {teamSelected?.defaultLanguage?.toLocaleLowerCase()}
                            /{assistant.url}
                          </Link>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {assistant?.status && loadingIndexUpdate !== index ? (
                            <Select
                              defaultValue={assistant.status}
                              value={assistant.status}
                              onValueChange={(value: AssitantStatus) => {
                                handleChangeStatus(value, index);
                              }}
                            >
                              <SelectTrigger id="model">
                                <SelectValue placeholder="Select a state" />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.values(AssitantStatus).map((status) => (
                                  <SelectItem key={status} value={status}>
                                    {visibilityImages[status]}
                                    {status}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <InputCharging />
                          )}
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
