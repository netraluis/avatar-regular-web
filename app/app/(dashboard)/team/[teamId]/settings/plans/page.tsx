'use client'
import { Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Environments, initializePaddle, Paddle } from '@paddle/paddle-js';
import { useEffect, useState } from "react";


// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";

const plans = {
  title: "Preus i plans",
  description: "Tria el pla que millor s’adapti a tu!",
  cards: [
    {
      title: "Hobby",
      price: 19,
      monthly: "al mes",
      includedPlus: "Tot el que inclou el pla gratuït, a més…",
      allIncluded: "All features from the free plan included",
      features: [
        "Accés a models avançats",
        "2.000 crèdits de missatges/mes",
        "2 xatbots",
        "11.000.000 caràcters per xatbot",
        "Enllaços il·limitats per entrenar",
        "Accés a l’API",
        "Integracions",
        "Analítiques bàsiques",
      ],
    },
    {
      title: "Estàndard",
      price: 99,
      monthly: "al mes",
      includedPlus: "Tot el que inclou el pla Hobby, a més…",
      allIncluded: "All features from the free plan included",
      features: [
        "10.000 crèdits de missatges/mes",
        "5 xatbots",
        "3 team members",
      ],
    },
    {
      title: "Il·limitat",
      price: 399,
      monthly: "al mes",
      includedPlus: "Tot el que inclou el pla gratuït, a més…",
      allIncluded: "All features from the free plan included",
      features: [
        "40.000 crèdits de missatges/mes (els missatges que superin aquest límit utilitzaran la teva clau d’API d’OpenAI)",
        "10 xatbots",
        "5 membres de l’equip",
        "Elimina “Powered by Chatbotfor",
        "Usa els teus propis dominis personalitzats",
        "Analítiques avançades",
      ],
    },
  ],
}

export default function Component() {
  const [paddle, setPaddle] = useState<Paddle>();

  useEffect(() => {
    if (!paddle?.Initialized && process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN && process.env.NEXT_PUBLIC_PADDLE_ENV) {
      initializePaddle({ environment: process.env.NEXT_PUBLIC_PADDLE_ENV as Environments, token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN }).then(
        (paddleInstance: Paddle | undefined) => {
          if (paddleInstance) {
            setPaddle(paddleInstance);
          }
        },
      )
    }
  }, []);

  useEffect(() => {
    console.log(paddle);
  }, [paddle]);

  const openCheckout = () => {
    paddle?.Checkout.open({
      items: [{ priceId: 'pro_01jff3rxysjzgm9fy8fjcr1rch', quantity: 1 }],
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Preus i plans</h1>
        <p className="text-muted-foreground">
          Tria el pla que millor s’adapti a tu!
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {plans.cards.map((plan, index) => (
          <Card key={index} onClick={openCheckout} className="cursor-pointer">
            <CardHeader className="space-y-1">
              <CardTitle>
                {plan.title}
              </CardTitle>
              <div className="flex items-baseline justify-between">
                <span className="text-4xl font-bold">{plan.price} €</span>
                <span className="text-sm text-muted-foreground">{plan.monthly}</span>
              </div>
            </CardHeader>
            <CardContent className="h-full">
              <div className="h-full flex flex-col">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {plan.includedPlus}
                    {/* <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-4 h-4" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{plan.allIncluded}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider> */}
                  </div>
                  <ul className="space-y-2.5 pt-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
