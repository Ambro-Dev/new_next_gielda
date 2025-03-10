import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  message: {
    id: string;
    text: string;
    createdAt: Date;
    sender: {
      id: string;
      username: string;
      email: string;
    };
    receiver: {
      id: string;
      username: string;
      email: string;
    };
  };
  user: string;
  className?: string;
};

const ChatMessage = (props: Props) => {
  const { message, user, className } = props;
  const hourAndMinute = new Intl.DateTimeFormat("pl", {
    hour: "numeric",
    minute: "numeric",
  }).format(new Date(message.createdAt));
  const today = new Date().toLocaleDateString();
  const yesterday = new Date(
    new Date().setDate(new Date().getDate() - 1)
  ).toLocaleDateString();
  const date = new Date(message.createdAt).toLocaleDateString();
  return (
    <div
      className={cn(
        `chat ${message.sender.id === user ? "chat-end" : "chat-start"}`,
        className
      )}
    >
      <div className="chat-image avatar">
        <Avatar>
          <AvatarFallback className="uppercase">
            {message.sender.username.substring(0, 1)}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="chat-header">
        {message.sender.username}
        <time className="text-xs opacity-50 p-1">
          {date === today ? "Dzisiaj" : date === yesterday ? "Wczoraj" : date},{" "}
          {hourAndMinute}
        </time>
      </div>
      <div
        className={`chat-bubble text-black text-md ${
          message.sender.id === user ? "chat-bubble-warning" : "bg-neutral-200"
        } `}
      >
        {message.text}
      </div>
    </div>
  );
};

export default ChatMessage;
