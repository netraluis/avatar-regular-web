"use client";
import { useAppContext } from "@/components/context/appContext";
import { useTeamSettingsContext } from "@/components/context/teamSettingsContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LanguageType, Welcome, WelcomeType } from "@prisma/client";
import { Eye, GripVertical, Trash2 } from "lucide-react";

export default function Interface() {
  const {
    state: { teamSelected },
  } = useAppContext();

  const { data, setData } = useTeamSettingsContext();

  console.log({ teamSelected: teamSelected?.welcome });

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Welcome message</CardTitle>
          <CardDescription>
            This is how others will see you on the site.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {teamSelected?.welcome?.map((wel: Welcome, index: number) => (
            <div className="space-y-2" key={index}>
              <Label htmlFor="welcome-message">Your message</Label>
              <Textarea
                id="welcome-message"
                placeholder="Type your message here"
                className="min-h-[100px]"
                value={
                  (!Array.isArray(data?.welcome?.update) &&
                    Array.isArray(data?.welcome?.update?.data?.text) &&
                    data?.welcome?.update?.data?.text[0]) ||
                  (!Array.isArray(data.welcome?.create) &&
                    Array.isArray(data.welcome?.create?.text) &&
                    data.welcome?.create?.text[0]) ||
                  wel?.text[0] ||
                  ""
                }
                onChange={(e) => {
                  setData({
                    ...data,
                    welcome: wel
                      ? {
                          update: {
                            where: {
                              language_teamId: {
                                teamId: teamSelected.id,
                                language: LanguageType.ES,
                              },
                            },
                            data: {
                              text: [e.target.value],
                            },
                          },
                        }
                      : {
                          create: {
                            text: [e.target.value],
                            // domainId: "", // Ajusta según los valores que necesites para crear
                            type: WelcomeType.PLAIN,
                            description: "",
                            language: LanguageType.ES,
                          },
                        },
                  });
                }}
              />
              <p className="text-sm text-muted-foreground">
                Your message will be copied to the support team.
              </p>
            </div>
          ))}
          <Button variant="secondary" size="sm" className="gap-2">
            <Eye className="w-4 h-4" />
            Preview
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Menu</CardTitle>
          <CardDescription>
            This is how others will see you on the site.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Primary menu</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add links to your website or blog.
              </p>
            </div>
            <div className="space-y-2">
              <div className="grid grid-cols-[auto_1fr_2fr_auto] gap-2 items-center">
                <GripVertical className="w-4 h-4 text-muted-foreground" />
                <Input defaultValue="Blog" />
                <Input defaultValue="https://acme.com/blog" />
                <Button variant="ghost" size="icon">
                  <Trash2 className="w-4 h-4 text-muted-foreground" />
                </Button>
              </div>
              <div className="grid grid-cols-[auto_1fr_2fr_auto] gap-2 items-center">
                <GripVertical className="w-4 h-4 text-muted-foreground" />
                <Input placeholder="Label name" />
                <Input placeholder="https://acme.com" />
                <Button variant="ghost" size="icon">
                  <Trash2 className="w-4 h-4 text-muted-foreground" />
                </Button>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Add item
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Secondary menu</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add links to your website or blog.
              </p>
            </div>
            <div className="space-y-2">
              <div className="grid grid-cols-[auto_1fr_2fr_auto] gap-2 items-center">
                <GripVertical className="w-4 h-4 text-muted-foreground" />
                <Input defaultValue="Terms & Conditions" />
                <Input defaultValue="https://acme.com/terms" />
                <Button variant="ghost" size="icon">
                  <Trash2 className="w-4 h-4 text-muted-foreground" />
                </Button>
              </div>
              <div className="grid grid-cols-[auto_1fr_2fr_auto] gap-2 items-center">
                <GripVertical className="w-4 h-4 text-muted-foreground" />
                <Input placeholder="Label name" />
                <Input placeholder="https://acme.com" />
                <Button variant="ghost" size="icon">
                  <Trash2 className="w-4 h-4 text-muted-foreground" />
                </Button>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Add item
            </Button>
          </div>
          <Button variant="secondary" size="sm" className="gap-2">
            <Eye className="w-4 h-4" />
            Preview
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Footer message</CardTitle>
          <CardDescription>
            This is how others will see you on the site.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="footer-message">Your message</Label>
            <Textarea
              id="footer-message"
              placeholder="Type your message here"
              className="min-h-[100px]"
            />
            <p className="text-sm text-muted-foreground">
              Your message will be copied to the support team.
            </p>
          </div>
          <Button variant="secondary" size="sm" className="gap-2">
            <Eye className="w-4 h-4" />
            Preview
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
