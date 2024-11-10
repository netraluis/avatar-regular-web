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
        <h1 className="text-3xl font-bold mb-2">Pricing and plans</h1>
        <p className="text-muted-foreground">
          Pick the plan that works best for you!
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle>
              <h2 className="text-xl font-bold">Hobby</h2>
            </CardTitle>
            <div className="flex items-baseline justify-between">
              <span className="text-4xl font-bold">$19</span>
              <span className="text-sm text-muted-foreground">Per Month</span>
            </div>
          </CardHeader>
          <CardContent className="h-full">
            <div className="h-full flex flex-col">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  Everything in Free, plus...
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
                    <span>Access to advanced models</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>2,000 message credits/month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>2 chatbots</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>11,000,000 characters/chatbot</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>Unlimited links to train on</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>API access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>Integrations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>Basic Analytics</span>
                  </li>
                </ul>
              </div>
              <div className="mt-auto pt-6">
                <Button className="w-full" variant="outline">
                  Upgrade
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary">
          <CardHeader className="space-y-1">
            <CardTitle>
              <h2 className="text-xl font-bold">Standard</h2>
            </CardTitle>
            <div className="flex items-baseline justify-between">
              <span className="text-4xl font-bold">$99</span>
              <span className="text-sm text-muted-foreground">Per Month</span>
            </div>
          </CardHeader>
          <CardContent className="h-full">
            <div className="h-full flex flex-col">
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Everything in Hobby, plus...
                </div>
                <ul className="space-y-2.5 pt-4">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>10,000 message credits/month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>5 chatbots</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>3 team members</span>
                  </li>
                </ul>
              </div>
              <div className="mt-auto pt-6">
                <Button className="w-full">Upgrade</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle>
              <h2 className="text-xl font-bold">Unlimited</h2>
            </CardTitle>
            <div className="flex items-baseline justify-between">
              <span className="text-4xl font-bold">$399</span>
              <span className="text-sm text-muted-foreground">Per Month</span>
            </div>
          </CardHeader>
          <CardContent className="h-full">
            <div className="h-full flex flex-col">
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Everything in Standard, plus...
                </div>
                <ul className="space-y-2.5 pt-4">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>
                      40,000 message credits/month included (Messages over the
                      limit will use your OpenAI API Key)
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>10 chatbots</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>5 team members</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>Remove &apos;Powered by Chatbase&apos;</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>Use your own custom domains</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>Advanced Analytics</span>
                  </li>
                </ul>
              </div>
              <div className="mt-auto pt-6">
                <Button className="w-full" variant="outline">
                  Upgrade
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
