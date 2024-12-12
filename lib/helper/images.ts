import { FileUserImageType } from "@/types/types";

export const basePublicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/`;

export const field = (fileUserImageType: FileUserImageType) => {
  switch (fileUserImageType) {
    case FileUserImageType.LOGO:
      return "logoUrl";
    case FileUserImageType.AVATAR:
      return "avatarUrl";
    case FileUserImageType.SYMBOL:
      return "symbolUrl";
  }
};
