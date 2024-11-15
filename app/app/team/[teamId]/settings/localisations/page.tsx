"use client";

import { Button } from "@/components/ui/button";
import { WandSparkles, Shuffle, MoreHorizontal } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LanguageType } from "@prisma/client";

export default function Component() {


  return (
    <>
      <div className="w-full px-4 py-2 flex items-center justify-between gap-2 border mb-2 rounded-lg ">
        <div className="flex grow items-center gap-2 flex-1">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Area" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">Team</SelectItem>
              <SelectItem value="low">Assistants cards</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Idioma" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(LanguageType).map((i, index) => (
                <SelectItem key={index} value={i}>
                  {i}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center ">
          <Button size="sm" className="">
            <WandSparkles className="w-4 h-4 mr-1" />
            Auto Translate
          </Button>
        </div>
      </div>
      <div className="flex grow rounded-lg bg-background overflow-hidden">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col border rounded-lg">
          <div className="flex-1 overflow-auto p-4 space-y-4">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[50%]">Default (EN)</TableHead>
                  <TableHead className="w-[50%]">Catalan (CA)</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Greetings!</TableCell>
                  <TableCell>Salutacions!</TableCell>
                  <TableCell className="text-right"></TableCell>
                </TableRow>
                <TableRow className="bg-muted/50">
                  <TableCell colSpan={3} className="font-medium">
                    Welcome screen
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    I whip up answers using AI, and hey, I might mess up
                    sometimes!
                  </TableCell>
                  <TableCell>
                    Genero respostes amb intel·ligència artificial i puc cometre
                    errors.
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200"
                    >
                      New
                    </Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Hello</TableCell>
                  <TableCell>Hola</TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200"
                    >
                      New
                    </Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    An Artificial Intelligence (AI) assistant has been created
                    to give you a demonstration of how I work.
                  </TableCell>
                  <TableCell>
                    Una assistent d&apos;Intel·ligència Artificial (AI) Ha estat
                    creada per fer-te una desmostració de com funciono.
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Shuffle className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>How can I help you?</TableCell>
                  <TableCell>Com et puc ajudar?</TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200"
                    >
                      New
                    </Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    I generate responses with artificial intelligence and I can
                    make mistakes.
                  </TableCell>
                  <TableCell>
                    Genero respostes amb intel·ligència artificial i puc cometre
                    errors.
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200"
                    >
                      New
                    </Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}
