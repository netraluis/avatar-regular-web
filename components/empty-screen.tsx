// import Avatar from "./avatar";

export function EmptyScreen({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className=" mx-auto max-w-2xl px-4">
        <div className="flex flex-col gap-2 rounded-lg bg-background p-8">
          {/* <div
          className="w-full"
          dangerouslySetInnerHTML={{ __html: configuration.chatStartText }}
        /> */}

          <div>
            {/* <Avatar name="assistant" /> */}
            <div className="ml-12 mt-3.5 flex mb-5">
              <div className="w-full">
                <p>
                  Hola!{" "}
                  <span role="img" aria-label="wave">
                    👋
                  </span>
                </p>
                <p>
                  Sóc la Meritxell, una assistent d&apos;intel·ligència
                  Artificial (AI){" "}
                </p>
                <br />
                <p>
                  He estat creada específicament per respondre i aclarir
                  qualsevol dubte o consulta referent a l&apos;Acord
                  d&apos;associació entre Andorra i la Unió Europea.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="px-8">{children}</div>
      </div>
    </div>
  );
}
