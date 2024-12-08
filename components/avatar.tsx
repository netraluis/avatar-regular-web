import Image from "next/image";
import { useEffect, useState } from "react";

export default function Avatar({ imageUrl, roleName }: any) {
  const [url, setUrl] = useState(imageUrl);

  useEffect(() => {
    const interval = setInterval(() => {
      // Agregar un parámetro único a la URL de la imagen
      setUrl(`${imageUrl}?timestamp=${new Date().getTime()}`);
    }, 60000); // Actualizar cada 60 segundos

    return () => clearInterval(interval);
  }, [imageUrl]);

  return (
    <div className="group block flex-shrink-0 m-2">
      <div className="flex items-center">
        <div>
          <Image
            className="inline-block h-9 w-9 rounded-full"
            src={url}
            alt="avatar"
            width={30}
            height={30}
          />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
            {roleName}
          </p>
        </div>
      </div>
    </div>
  );
}
