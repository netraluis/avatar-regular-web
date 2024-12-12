import Image from "next/image";

export default function Avatar({ imageUrl, roleName }: any) {
  return (
    <div className="group block flex-shrink-0 m-2">
      <div className="flex items-center">
        <div>
          <Image
            className="inline-block h-9 w-9 rounded-full"
            src={imageUrl}
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
