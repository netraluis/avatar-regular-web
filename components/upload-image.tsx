import Image from "next/image";

import { Label } from "./ui/label";
import { useTeamSettingsContext } from "./context/teamSettingsContext";
import { useAppContext } from "./context/appContext";
import { Button } from "./ui/button";
import { useRef, useState } from "react";
import { LogoCharging } from "./loaders/loadersSkeleton";
import { useSupabaseFile } from "./context/useAppContext/file";
import { FileUserImageType } from "@/types/types";

export interface UploadImageProps {
  src: string;
  description: string;
  alt: string;
  recommendedSize: string;
  fileUserImageType: FileUserImageType;
  accept: string;
  choose: string;
  assistantId: string;
}

export const UploadImage = ({
  src,
  description,
  alt,
  recommendedSize,
  fileUserImageType,
  accept,
  choose,
  assistantId,
}: UploadImageProps) => {
  const {
    state: { user, teamSelected },
  } = useAppContext();

  const { data, setData } = useTeamSettingsContext();

  const { uploadSupaseFile } = useSupabaseFile();

  const fileInputLogoRef = useRef<HTMLInputElement | null>(null);
  const [logoLoading, setLogoLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const handleLogoClick = () => {
    fileInputLogoRef.current?.click();
  };

  const field = (fileUserImageType: FileUserImageType) => {
    switch (fileUserImageType) {
      case FileUserImageType.LOGO:
        return "logoUrl";
      case FileUserImageType.AVATAR:
        return "avatarUrl";
      case FileUserImageType.SYMBOL:
        return "symbolUrl";
    }
  };

  return (
    <div className="space-y-2 mb-3">
      <Label>{description}</Label>
      <div className="flex items-center space-x-2">
        {logoLoading || imageLoading || !teamSelected ? (
          <LogoCharging />
        ) : src ? (
          <div className="w-10 h-10 rounded-full flex items-center justify-center relative">
            <Image
              src={src}
              alt={alt}
              width={30}
              height={30}
              onLoad={() => setImageLoading(false)}
              onError={() => setImageLoading(false)}
            />
          </div>
        ) : (
          <div className="w-10 h-10 border rounded-full  flex items-center justify-center bg-muted">
            CN
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={handleLogoClick}
          disabled={logoLoading}
        >
          {choose}
          <input
            ref={fileInputLogoRef}
            type="file"
            className="hidden"
            accept={accept}
            onChange={async (e) => {
              setLogoLoading(true);
              if (e.target.files && teamSelected?.id && user?.user.id) {
                const url = await uploadSupaseFile({
                  fileInput: e.target.files as unknown as FileList,
                  userId: user.user.id,
                  teamId: teamSelected.id as string,
                  fileUserImageType,
                  assistantId,
                });
                setData({ ...data, [field(fileUserImageType)]: url.data });
              }
              setLogoLoading(false);
            }}
          />
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">{recommendedSize}</p>
    </div>
  );
};
