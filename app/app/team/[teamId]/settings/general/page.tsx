"use client";
import { useAppContext } from "@/components/context/appContext";
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
import { useState, useEffect, useRef } from "react";
import slugify from "slugify";
import { Ellipsis } from "lucide-react";
import { useSupabaseFile } from "@/components/context/useAppContext/file";
import { FileUserImageType } from "@/types/types";
import Image from "next/image";
import { useTeamSettingsContext } from "@/components/context/teamSettingsContext";

export default function Component() {
  const {
    state: { user, teamSelected },
  } = useAppContext();

  const { data, setData } = useTeamSettingsContext();

  const { uploadSupaseFile } = useSupabaseFile();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputLogoRef = useRef<HTMLInputElement | null>(null);

  const handleLogoClick = () => {
    fileInputLogoRef.current?.click();
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const [symbolLoading, setSymbolLoading] = useState(false);
  const [logoLoading, setLogoLoading] = useState(false);

  useEffect(() => {
    if (data.name) {
      const slug = slugify(typeof data?.name === "string" ? data?.name : "", {
        lower: true,
        strict: true,
      });
      setData({ ...data, subDomain: slug });
    }
  }, [data.name]);

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-8">
      <Card>
        <CardHeader className="border-b mb-2">
          <CardTitle>Team settings</CardTitle>
          <CardDescription>
            This is how others will see you on the site.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="team-name">Team name</Label>
            <Input
              id="team-name"
              value={
                (typeof data?.name === "string" && data?.name) ||
                teamSelected?.name ||
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
                  (typeof data?.subDomain === "string" && data?.subDomain) ||
                  teamSelected?.subDomain ||
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

      <Card>
        <CardHeader className="border-b mb-2">
          <CardTitle>Team images</CardTitle>
          <CardDescription>
            This is how others will see you on the site.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Upload a logo</Label>
            <div className="flex items-center space-x-2">
              {logoLoading || !teamSelected?.logoUrl ? (
                <Ellipsis className="h-8 w-8 animate-pulse text-slate-400" />
              ) : (typeof data?.logoUrl === "string" && data?.logoUrl) ||
                teamSelected?.logoUrl ? (
                <div className="w-10 h-10 rounded-full  flex items-center justify-center">
                  <Image
                    src={`https://${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID}.supabase.co/storage/v1/object/public/${teamSelected.logoUrl}`}
                    alt="favicon"
                    width={30}
                    height={30}
                  />
                </div>
              ) : (
                <div className="w-10 h-10 border rounded-full  flex items-center justify-center bg-muted">
                  CN
                </div>
              )}
              <Button variant="outline" size="sm" onClick={handleLogoClick}>
                Choose
                <input
                  ref={fileInputLogoRef}
                  type="file"
                  className="hidden"
                  // multiple
                  accept=".png,.jpg,.jpeg"
                  onChange={async (e) => {
                    setLogoLoading(true);
                    if (e.target.files && teamSelected?.id) {
                      const url = await uploadSupaseFile({
                        fileInput: e.target.files as unknown as FileList,
                        userId: user.user.id,
                        teamId: teamSelected.id as string,
                        fileUserImageType: FileUserImageType.LOGO,
                      });
                      setData({ ...data, logoUrl: url.data });
                    }
                    setLogoLoading(false);
                  }}
                />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Recommended size 180 × 180
            </p>
          </div>
          <div className="space-y-2">
            <Label>Upload a favicon</Label>
            <div className="flex items-center space-x-2">
              {symbolLoading || !teamSelected?.symbolUrl ? (
                <Ellipsis className="h-8 w-8 animate-pulse text-slate-400" />
              ) : (typeof data?.symbolUrl === "string" && data?.symbolUrl) ||
                teamSelected?.symbolUrl ? (
                <div className="w-10 h-10 rounded-full  flex items-center justify-center">
                  <Image
                    src={`https://${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID}.supabase.co/storage/v1/object/public/${(typeof data?.symbolUrl === "string" && data?.symbolUrl) || teamSelected?.symbolUrl}`}
                    alt="favicon"
                    width={30}
                    height={30}
                  />
                </div>
              ) : (
                <div className="w-10 h-10 border rounded-full  flex items-center justify-center bg-muted">
                  CN
                </div>
              )}

              <Button variant="outline" size="sm" onClick={handleClick}>
                Choose
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  // multiple
                  accept=".svg"
                  onChange={async (e) => {
                    setSymbolLoading(true);
                    if (e.target.files && teamSelected?.id) {
                      const url = await uploadSupaseFile({
                        fileInput: e.target.files as unknown as FileList,
                        userId: user.user.id,
                        teamId: teamSelected.id as string,
                        fileUserImageType: FileUserImageType.SYMBOL,
                      });
                      setData({ ...data, symbolUrl: url.data });
                    }
                    setSymbolLoading(false);
                  }}
                />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Recommended size 180 × 180
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
          <Button variant="destructive">Delete Acme Inc</Button>
        </CardContent>
      </Card>
    </div>
  );
}
