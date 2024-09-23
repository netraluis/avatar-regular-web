import DashboardHeader from "@/components/layouts/dashboard-layout";
import { assistantsTeamSelected, teams } from "@/components/mockData";
import Link from "next/link";
import {
  MoreHorizontal,
  PlusCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Tabs, TabsContent } from "@/components/ui/tabs";

export async function generateStaticParams() {
  return teams.map((team) => ({
    teamId: team.id,
  }));
}

export default function Dashboard({ params }: { params: { teamId: string } }) {
  const teamSelected = teams.find((team) => team.id === params.teamId);

  return (
    <DashboardHeader teamSelected={teamSelected} teams={teams}>
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <Tabs defaultValue="all">
          <div className="flex items-center">
            <Card className="border-none bg-transparent shadow-none">
              <CardHeader>
                <CardTitle>Assistant</CardTitle>
                <CardDescription>Manage your team&lsquo;s assistant</CardDescription>
              </CardHeader>
            </Card>
            <div className="ml-auto flex items-center gap-2">
              <Button size="sm" className="h-8 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Create Assistant
                </span>
              </Button>
            </div>
          </div>
          <TabsContent value="all">
            <Card x-chunk="dashboard-06-chunk-0">
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>type</TableHead>
                      <TableHead className="hidden md:table-cell">
                        link
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        status
                      </TableHead>
                      <TableHead>
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assistantsTeamSelected.map((assistant) => (
                      <TableRow key={assistant.id}>
                        <TableCell className="font-medium">
                          {assistant.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">GPT-4</Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Link href="/app/team/1/page/1">
                            /app/team/1/page/1
                          </Link>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          public
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
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem>Clone</DropdownMenuItem>
                              <DropdownMenuItem>Favorite</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </DashboardHeader>
  );
}
