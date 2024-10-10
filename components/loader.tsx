import Image from "next/image";

export function Loader() {
  return (
    <div className="w-full">
      <div className="h-[74px] flex border border-slate-200 justify-center content-center self-center justify-items-center rounded-lg">
        <Image
          src="/chatbotforSymbol.svg"
          width={36}
          height={36}
          alt="chatbotfor logo"
          className="w-6 animate-pulse text-slate-400"
        />
      </div>
    </div>
  );
}
