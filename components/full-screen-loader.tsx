import React from "react";
import Image from "next/image";

export default function FullScreenLoader({
  isLoading,
}: {
  isLoading: boolean;
}) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="flex flex-col items-center">
        <Image
          src="/chatbotforSymbol.svg"
          width={360}
          height={360}
          alt="chatbotfor logo"
          className="w-6 animate-pulse text-slate-400"
          unoptimized
        />
      </div>
    </div>
  );
}
