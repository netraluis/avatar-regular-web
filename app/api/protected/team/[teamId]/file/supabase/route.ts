import { NextRequest, NextResponse } from "next/server";
import sharp, { FitEnum, ResizeOptions } from "sharp";
import { createClient } from "@/lib/supabase/server";
import { FileUserImageType } from "@/types/types";
import { updateTeamByField } from "@/lib/data/team";
import { field } from "@/lib/helper/images";
import { handleError } from "@/lib/helper/errorHandler";

// async function compressImage(fileBuffer: Buffer, fileType: string) {
//   if (fileType === "image/jpeg") {
//     return (
//       sharp(fileBuffer)
//         // .resize(1024)
//         .jpeg({ quality: 80 })
//         .toBuffer()
//     );
//   } else if (fileType === "image/png") {
//     return (
//       sharp(fileBuffer)
//         // .resize(1024)
//         .png({ compressionLevel: 9 })
//         .toBuffer()
//     );
//   } else if (fileType === "image/svg+xml") {
//     return fileBuffer; // No modificar SVG
//   } else {
//     throw new Error("Unsupported image format");
//   }
// }

async function compressImage(
  fileBuffer: Buffer,
  fileUserImageType: FileUserImageType,
) {
  let dimensions: ResizeOptions;
  switch (fileUserImageType) {
    case FileUserImageType.LOGO:
      dimensions = { height: 100, fit: "contain" };
      break;
    case FileUserImageType.SYMBOL:
      dimensions = { width: 16, height: 16, fit: "contain" };
      break;
    case FileUserImageType.AVATAR:
      dimensions = { width: 16, height: 16, fit: "contain" };
      break;
    default:
      dimensions = { height: 400, fit: "contain" };
  }
  try {
    return sharp(fileBuffer)
      .resize(dimensions) // Redimensiona si es grande
      .toFormat("png") // Convierte a PNG
      .png({ compressionLevel: 6 }) // Comprime PNG
      .toBuffer();
  } catch (error) {
    console.error("Error compressing image:", error);
    throw new Error("Image compression failed");
  }
}

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const userId = req.headers.get("x-user-id");

  if (!userId) {
    return handleError(400, "User needs to be logged in", "USER_NOT_LOGGED_IN");
  }

  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const teamId = formData.get("teamId") as string;
    const fileUserImageType = formData.get(
      "fileUserImageType",
    ) as FileUserImageType;
    const oldNameDoc = formData.get("oldNameDoc");

    if (!teamId || !fileUserImageType) {
      return handleError(400, "Missing required fields", "MISSING_FIELDS");
    }

    if (files.length === 0) {
      return handleError(400, "No files provided", "NO_FILES_PROVIDED");
    }

    const file = files[0];

    if (!file.type.startsWith("image/")) {
      return handleError(
        400,
        "Only image files are allowed",
        "INVALID_FILE_TYPE",
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return handleError(
        400,
        "File size exceeds maximum allowed size of 10MB",
        "FILE_TOO_LARGE",
      );
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    let compressedBuffer;

    try {
      compressedBuffer = await compressImage(fileBuffer, fileUserImageType);
    } catch (e: any) {
      return handleError(400, e.message, "COMPRESSION_ERROR");
    }

    if (compressedBuffer.length > 5 * 1024 * 1024) {
      return handleError(
        400,
        `Compressed file size exceeds limit of 5MB. Actual size: ${(
          compressedBuffer.length /
          1024 /
          1024
        ).toFixed(2)} MB`,
        "COMPRESSED_FILE_TOO_LARGE",
      );
    }

    const urlDelete = `${teamId}/${fileUserImageType}/${oldNameDoc}`;

    if (oldNameDoc) {
      const { error: deleteError } = await supabase.storage
        .from("user-images")
        .remove([urlDelete]);

      if (deleteError) {
        return handleError(
          500,
          `Failed to delete old file: ${deleteError.message}`,
          "DELETE_OLD_FILE_ERROR",
        );
      }
    }

    // const urlUpload = `${teamId}/${fileUserImageType}/${name}`;

    const originalName = file.name.replace(/\.[^/.]+$/, ""); // Quita la extensión original
    const urlUpload = `${teamId}/${fileUserImageType}/${originalName}.png`;
    // const mimeType =
    //   file.type === "image/svg+xml" ? "image/svg+xml" : file.type;
    const mimeType = "image/png";

    const { data, error } = await supabase.storage
      .from("user-images")
      .upload(urlUpload, compressedBuffer, {
        upsert: true,
        contentType: mimeType,
      });

    if (error) {
      return handleError(
        500,
        `Failed to upload new file: ${error.message}`,
        "UPLOAD_ERROR",
      );
    }

    const response = await updateTeamByField({
      teamId,
      field: field(fileUserImageType as FileUserImageType) as string,
      value: data.fullPath,
    });

    return NextResponse.json({ status: 200, data: response });
  } catch (e: any) {
    return handleError(500, `File upload error: ${e.message}`, "SERVER_ERROR");
  }
}

export async function DELETE(req: NextRequest) {
  const supabase = createClient();
  const userId = req.headers.get("x-user-id");

  if (!userId) {
    return handleError(400, "User needs to be logged in", "USER_NOT_LOGGED_IN");
  }

  try {
    const formData = await req.formData();
    // const files = formData.getAll("files") as File[];
    const teamId = formData.get("teamId") as string;
    const fileUserImageType = formData.get(
      "fileUserImageType",
    ) as FileUserImageType;
    const oldNameDoc = formData.get("oldNameDoc");

    if (!teamId || !fileUserImageType) {
      return handleError(400, "Missing required fields", "MISSING_FIELDS");
    }

    const urlDelete = `${teamId}/${fileUserImageType}/${oldNameDoc}`;

    if (oldNameDoc) {
      const { error: deleteError } = await supabase.storage
        .from("user-images")
        .remove([urlDelete]);

      if (deleteError) {
        return handleError(
          500,
          `Failed to delete old file: ${deleteError.message}`,
          "DELETE_OLD_FILE_ERROR",
        );
      }
    }

    const response = await updateTeamByField({
      teamId,
      field: field(fileUserImageType as FileUserImageType) as string,
      value: null,
    });

    return NextResponse.json({ status: 200, data: response });
  } catch (e: any) {
    return handleError(500, `File upload error: ${e.message}`, "SERVER_ERROR");
  }
}
