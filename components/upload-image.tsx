import Image from "next/image";
import { Label } from "./ui/label";
import { useAppContext } from "./context/appContext";
import { Button } from "./ui/button";
import { LogoCharging } from "./loaders/loadersSkeleton";
import { useSupabaseFile } from "./context/useAppContext/file";
import { FileUserImageType } from "@/types/types";
import { field } from "@/lib/helper/images";
import React, {
  useImperativeHandle,
  useState,
  forwardRef,
  useRef,
} from "react";

export interface UploadImageProps {
  description: string;
  alt: string;
  recommendedSize: string;
  fileUserImageType: FileUserImageType;
  accept: string;
  choose: string;
  assistantId?: string;
  onPreviewChange: (previewUrl: string | null) => void;
}

export const UploadImage = forwardRef(
  (
    {
      description,
      alt,
      recommendedSize,
      fileUserImageType,
      accept,
      choose,
      onPreviewChange,
    }: UploadImageProps,
    ref,
  ) => {
    const {
      state: { user, teamSelected },
    } = useAppContext();
    const { uploadSupaseFile } = useSupabaseFile();

    const imageField = field(fileUserImageType);

    const fileInputLogoRef = useRef<HTMLInputElement | null>(null);
    const [logoLoading, setLogoLoading] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null); // Estado para la previsualización
    const [file, setFile] = useState<FileList | null>(null);

    const handleLogoClick = () => {
      fileInputLogoRef.current?.click();
    };

    const handleImageChange = async (
      e: React.ChangeEvent<HTMLInputElement>,
    ) => {
      setLogoLoading(true);

      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        setFile(e.target.files as unknown as FileList);
        // Generar URL para la previsualización
        const previewUrl = URL.createObjectURL(file);
        setPreviewImage(previewUrl);
        onPreviewChange(previewUrl);
      }

      setLogoLoading(false);
    };

    const saveImage = async () => {
      if (!previewImage) return;
      setLogoLoading(true);
      if (teamSelected?.id && user?.user.id && fileUserImageType) {
        await uploadSupaseFile({
          fileInput: file as unknown as FileList,
          userId: user.user.id,
          teamId: teamSelected.id as string,
          fileUserImageType,
          oldUrl: teamSelected[imageField] || "",
        });
      }

      setLogoLoading(false);
    };

    useImperativeHandle(ref, () => ({
      saveImage,
    }));

    return (
      <div className="space-y-2 mb-3">
        <Label>{description}</Label>
        <div className="flex items-center space-x-2">
          {logoLoading || imageLoading || !teamSelected ? (
            <LogoCharging />
          ) : previewImage ? (
            // Mostrar la imagen seleccionada para previsualización
            <div className="w-10 h-10 rounded-full flex items-center justify-center relative">
              <Image
                src={previewImage}
                alt={alt}
                width={30}
                height={30}
                className="rounded-full"
                unoptimized
              />
            </div>
          ) : teamSelected && imageField ? (
            // Mostrar la imagen cargada desde Supabase
            <div className="w-10 h-10 rounded-full flex items-center justify-center relative">
              <Image
                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${teamSelected[imageField]}`}
                alt={alt}
                width={30}
                height={30}
                onLoad={() => setImageLoading(false)}
                onError={() => {
                  setImageLoading(false);
                }}
                unoptimized
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
              onChange={handleImageChange} // Nuevo manejador de cambio
            />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreviewImage(null)}
            disabled={logoLoading}
          >
            Undo
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">{recommendedSize}</p>
      </div>
    );
  },
);

UploadImage.displayName = "UploadImage";

export default UploadImage;
