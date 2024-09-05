export default function Avatar({ name }: any) {
  return (
    <a href="#" className="group block flex-shrink-0 m-2">
      <div className="flex items-center">
        <div>
          <img
            className="inline-block h-9 w-9 rounded-full"
            src={name === "assistant" ? "/start.png" : "avatar.png"}
            alt=""
          />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
            {name === "assistant"
              ? process.env.NEXT_PUBLIC_ASSISTANT_NAME
                ? process.env.NEXT_PUBLIC_ASSISTANT_NAME
                : "Assistant"
              : "Tu"}
          </p>
        </div>
      </div>
    </a>
  );
}
