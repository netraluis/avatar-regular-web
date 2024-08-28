import { Message } from "ai/react";
import Avatar from "./avatar";
import MarkdownDisplay from "./markdownDisplay";

export const Messages = ({ messages }: { messages: Message[] }) => {
  if (messages && messages.length > 0) {
    return messages.map((his, index) => {
      return (
        <div key={index}>
          <Avatar name={his.role} />
          <div className="ml-12 mt-3.5 flex mb-5">
            <div className="w-full ">
              <MarkdownDisplay markdownText={his.content} />
            </div>
          </div>
        </div>
      );
    });
  }
};
