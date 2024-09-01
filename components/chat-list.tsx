import Avatar from './avatar';

export type UIState = {
  id: string;
  display: React.ReactNode;
}[];

export interface ChatList {
  messages: any;
}

export function ChatList({ messages }: ChatList) {
  if (!messages.length) {
    return null;
  }

  return (
    <div className="relative mx-auto max-w-2xl px-4">
      {messages.map((message: any) => {
        return (
          <div className="my-4" key={message.id}>
            <Avatar name={message.role} />
            {message.content}
            {/* {index < messages.length - 1 && <Separator className="my-4" />} */}
          </div>
        );
      })}
    </div>
  );
}