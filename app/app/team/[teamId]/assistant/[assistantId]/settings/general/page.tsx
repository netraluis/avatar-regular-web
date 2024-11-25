"use client";

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
import { useEffect } from "react";
import slugify from "slugify";

import { useAssistantSettingsContext } from "@/components/context/assistantSettingsContext";
import { useDeleteAssistant } from "@/components/context/useAppContext/assistant";
import { useAppContext } from "@/components/context/appContext";
import { LoaderCircle } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function Component() {
  const { data, setData, assistantValues } = useAssistantSettingsContext();
  const {
    loadingDeleteAssistant,
    deleteAssistant,
  } = useDeleteAssistant();

  const {
    state: { user },
  } = useAppContext();

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (data.name) {
      const slug = slugify(typeof data?.name === "string" ? data?.name : "", {
        lower: true,
        strict: true,
      });
      setData({ ...data, url: slug });
    }
  }, [data.name]);

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-8 flex flex-col">
      <Card>
        <CardHeader className="border-b mb-2">
          <CardTitle>Assistant settings</CardTitle>
          <CardDescription>
            This is how others will see you on the site.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="team-name">Assistant name</Label>
            <Input
              id="team-name"
              value={
                (typeof data?.name === "string" && data?.name) ||
                assistantValues?.name ||
                ""
              }
              onChange={(e) => {
                setData({ ...data, name: e.target.value });
                // setTeamName(e.target.value);
              }}
            />
            <p className="text-sm text-muted-foreground">
              This is your public display name. It can be your real name or a
              pseudonym. You can only change this once every 30 days.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="team-url">Team URL</Label>
            <div className="flex items-center space-x-2">
              <Input
                disabled
                id="team-url"
                value={
                  (typeof data?.url === "string" && data?.url) ||
                  assistantValues?.url ||
                  ""
                }
              />
              <span className="text-muted-foreground">.chatbond.com</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Upcoming Team URL will cause a redirect to the new url.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle>Danger zone</CardTitle>
          <CardDescription>
            Once you delete your team account, there is no going back. Please be
            certain.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            All your uploaded data and trained chatbots will be deleted. This
            action is not reversible
          </p>
          <Button
            onClick={async () => {
              if (!assistantValues?.id || !user.user.id) return;
              await deleteAssistant({
                assistantId: assistantValues?.id,
                userId: user.user.id,
              });
              const absolutePath = pathname.split("/").slice(1, 3).join("/");
              router.push(`/${absolutePath}`);
            }}
            variant="destructive"
          >
            {loadingDeleteAssistant ? <LoaderCircle /> : assistantValues?.name}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
