"use client";

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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ChevronDown, Copy, Trash2 } from "lucide-react";
import { useState } from "react";

export default function Component() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("http://example.com/link/to/document");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Convida membres</CardTitle>
          <CardDescription>
            Comparteix l’enllaç perquè qualsevol persona amb accés pugui unir-se a l’equip.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-2">
            <Input
              readOnly
              value="http://example.com/link/to/document"
              className="font-mono text-sm"
            />
            <Button
              variant="secondary"
              className="shrink-0"
              onClick={handleCopy}
            >
              <Copy className="w-4 h-4 mr-2" />
              {copied ? "Copiat!" : "Copia l’enllaç"}
            </Button>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Persones amb accés</h3>
            <div className="flex gap-2">
              <Input placeholder="anton@email.com" type="email" />
              <Button className="shrink-0">Afegir un membre</Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium">OM</span>
                  </div>
                  <div>
                    <div className="font-medium">Olivia Martin</div>
                    <div className="text-sm text-muted-foreground">
                      m@example.com
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        Pot editar
                        <ChevronDown className="w-4 h-4 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Pot editar</DropdownMenuItem>
                      <DropdownMenuItem>Només lectura</DropdownMenuItem>
                      <DropdownMenuItem>Pot modificar</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium">SR</span>
                  </div>
                  <div>
                    <div className="font-medium">Sophia Reynolds</div>
                    <div className="text-sm text-muted-foreground">
                      sophia.reynolds@example.com
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        Pot modificar
                        <ChevronDown className="w-4 h-4 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Pot editar</DropdownMenuItem>
                      <DropdownMenuItem>Només lectura</DropdownMenuItem>
                      <DropdownMenuItem>Pot modificar</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium">NL</span>
                  </div>
                  <div>
                    <div className="font-medium">Netra Luis</div>
                    <div className="text-sm text-muted-foreground">
                      netra@example.com
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        Pot modificar
                        <ChevronDown className="w-4 h-4 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Pot editar</DropdownMenuItem>
                      <DropdownMenuItem>Només lectura</DropdownMenuItem>
                      <DropdownMenuItem>Pot modificar</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
