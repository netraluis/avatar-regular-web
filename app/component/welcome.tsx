"use client";
import { HandThumbUpIcon } from "@heroicons/react/24/outline";
import Avatar from "./avatar";
import Button from "./button";
import { GlobalContext } from "./context/globalContext";
import { useContext } from "react";

export default function Welcome() {
  const { setState } = useContext(GlobalContext);
  return (
    <div className="mx-auto w-full max-w-6xl h-full flex flex-col justify-center w-full max-w-[898px] relative">
      <div>
        <Avatar name="assistant" />
        <div className="ml-12 mt-3.5 flex mb-5 ">
          <div className="w-full">
            <p>
              Sóc la Meritxell, una assistent d’intel·ligència Artificial (AI){" "}
            </p>
            <br />
            <p>
              He estat creada específicament per ajudar a contestar i aclarir
              qualsevol dubte o consulta referent a l&apos;Acord
              d&apos;Associació.{" "}
            </p>
            <br />
            <p>Si vols conèixer més, mira el vídeo o visita la web</p>
            <br />
          </div>
        </div>
      </div>
      <div className="ml-12">
        <Button
          onClick={() => {
            setState(2);
          }}
        >
          <HandThumbUpIcon className="ml-0.5 h-5 w-5" aria-hidden="true" />
          Començar
        </Button>
      </div>
      <div className=" absolute bottom-0 w-full">

      <p className="mt-2 text-sm text-zinc-500 flex justify-center absolute bottom-0 w-full mb-4">
        Totes les respostes en aquesta conversa estan generades mitjançant una
        Intel·ligència Artificial (AI)
      </p>
      </div>
    </div>
  );
}
