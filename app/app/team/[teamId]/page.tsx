"use client";
import Link from "next/link";
import { MoreHorizontal, PlusCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";

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
import { HeaderLayout } from "@/components/layouts/title-layout";

const teamIdText = {
  cardTitle: "Assistant",
  cardDescription: "Visio global dels teus assistents",
  createAssistant: "Create Assistant",
};

export default function Dashboard() {
  const router = useRouter();
  const {
    state: { teamSelected, assistantsByTeam, user },
  } = useAppContext();
  const { teamId } = useParams();
  const { loading, fetchAssistantsByTeamId } = useFetchAssistantsByTeamId();
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
    deleteAssistant({ assistantId, userId: user.user.id });
  };

  useEffect(() => {
    if (!teamSelected) {
      router.push("/team");
    }
  }, [teamSelected]);

  return (
    // <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
    <HeaderLayout
      cardTitle={teamIdText.cardTitle}
      cardDescription={teamIdText.cardDescription}
      urlPreview={`${process.env.PROTOCOL ? process.env.PROTOCOL : "http://"}${teamSelected?.subDomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/${teamSelected?.defaultLanguage?.toLocaleLowerCase()}`}
      actionButtonText={teamIdText.createAssistant}
      ActionButtonLogo={PlusCircle}
      actionButtonOnClick={handleCreateNewAssistantRoute}
    >
      {loading ? (
        <Loader />
      ) : (
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>type</TableHead>
                  <TableHead className="hidden md:table-cell">link</TableHead>
                  <TableHead className="hidden md:table-cell">status</TableHead>
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
                        {assistant.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">GPT-4</Badge>
                      </TableCell>
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
                        {assistant.status}
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
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                            </Link>

                            <DropdownMenuItem
                              onClick={() => {
                                console.log("Clone clicando");
                              }}
                            >
                              Clone
                            </DropdownMenuItem>
                            <DropdownMenuItem>Favorite</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                handleDeleteAssistant(assistant.id);
                              }}
                            >
                              Delete
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
      )}
    </HeaderLayout>
    // </main>
  );
}
