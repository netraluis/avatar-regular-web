import { NextResponse } from "next/server";

export const handleError = (status: number, message: string, code: string) => {
  console.error(message);
  return NextResponse.json({ status, message, code });
};
