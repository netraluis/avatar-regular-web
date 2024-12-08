import { Check, HelpCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Component() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Preus i plans</h1>
        <p className="text-muted-foreground">
          Tria el pla que millor s’adapti a tu!
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle>
              <h2 className="text-xl font-bold">Hobby</h2>
            </CardTitle>
            <div className="flex items-baseline justify-between">
              <span className="text-4xl font-bold">19 $</span>
              <span className="text-sm text-muted-foreground">Al mes</span>
            </div>
          </CardHeader>
          <CardContent className="h-full">
            <div className="h-full flex flex-col">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  Tot el que inclou el pla gratuït, a més…
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-4 h-4" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>All features from the free plan included</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <ul className="space-y-2.5 pt-4">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>Accés a models avançats</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>2.000 crèdits de missatges/mes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>2 xatbots</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>11.000.000 caràcters per xatbot</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>Enllaços il·limitats per entrenar</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>Accés a l’API</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>Integracions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>Analítiques bàsiques</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary">
          <CardHeader className="space-y-1">
            <CardTitle>
              <h2 className="text-xl font-bold">Estàndard</h2>
            </CardTitle>
            <div className="flex items-baseline justify-between">
              <span className="text-4xl font-bold">$99</span>
              <span className="text-sm text-muted-foreground">Al mes</span>
            </div>
          </CardHeader>
          <CardContent className="h-full">
            <div className="h-full flex flex-col">
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Tot el que inclou el pla Hobby, a més…
                </div>
                <ul className="space-y-2.5 pt-4">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>10.000 crèdits de missatges/mes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>5 xatbots</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>3 team members</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle>
              <h2 className="text-xl font-bold">Il·limitat</h2>
            </CardTitle>
            <div className="flex items-baseline justify-between">
              <span className="text-4xl font-bold">$399</span>
              <span className="text-sm text-muted-foreground">Al mes</span>
            </div>
          </CardHeader>
          <CardContent className="h-full">
            <div className="h-full flex flex-col">
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Tot el que inclou el pla Estàndard, a més…
                </div>
                <ul className="space-y-2.5 pt-4">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>
                      40.000 crèdits de missatges/mes (els missatges que superin aquest límit utilitzaran la teva clau d’API d’OpenAI)
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>10 xatbots</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>5 membres de l’equip</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>Elimina “Powered by Chatbotfor</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>Usa els teus propis dominis personalitzats</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>Analítiques avançades</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
