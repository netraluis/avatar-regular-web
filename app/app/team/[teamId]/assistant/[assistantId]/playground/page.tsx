"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Playground = () => {
  const router = useRouter();

  //   useEffect(() => {
  //     const currentPath = window.location.pathname;

  //     // Concatenar el nuevo path con la ruta actual
  //     const newPath = `${currentPath}/playground`;

  //     return router.push(newPath);
  //   }, []);

  return <div>Playground...</div>;
};

export default Playground;
