import { createClient } from "@/lib/supabase/server";

export const getPublicUrlImage = async (fileName: string) => {
  const supabase = createClient();

  const { data } = supabase.storage.from("images").getPublicUrl(fileName);

  return data.publicUrl;
};

export const getPublicLimitedUrlImageimport = async (fileName: string) => {
  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from("images")
    .createSignedUrl(fileName, 3600);

  if (data) {
    return data.signedUrl;
  }
  if (error) {
    console.error(error);
  }
};
