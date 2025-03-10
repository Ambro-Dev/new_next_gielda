"use client";

import { authOptions } from "@/utils/authOptions";
import { useMessages } from "@/app/context/message-provider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import React from "react";

type Props = {
  messages: {
    id: string;
    createdAt: Date;
    text: string;
    sender: {
      id: string;
      username: string;
    };
  }[];
};

const timeFormat = new Intl.DateTimeFormat("pl", {
  hour: "numeric",
  minute: "numeric",
});

const Chat = (props: Props) => {
  const { data, status } = useSession();
  const user = data?.user?.id;

  const newMessages = props.messages;

  const { setMessages, messages } = useMessages();

  const chatRef = React.useRef<HTMLDivElement>(null);
  const bottomRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!chatRef.current || !bottomRef.current) return;

    const messagesToRemove = messages.filter((message) => {
      const isMessageInNewMessages = newMessages.find(
        (newMessage) => newMessage.id === message.id
      );
      return !isMessageInNewMessages;
    });

    setMessages(messagesToRemove);

    chatRef.current.scrollTop = bottomRef.current.offsetTop;
  }, [props.messages]);

  return (
    <div ref={chatRef} className="px-5 max-h-[700px] overflow-auto">
      {props.messages.map((message) => {
        const isUser = message.sender.id === user;
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
            key={message.id}
            className={`chat ${isUser ? "chat-end" : "chat-start"}`}
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
                {date === today
                  ? "Dzisiaj"
                  : date === yesterday
                  ? "Wczoraj"
                  : date}
                , {hourAndMinute}
              </time>
            </div>

            <div
              className={`chat-bubble text-black text-md ${
                isUser ? "chat-bubble-warning" : "bg-neutral-200"
              } `}
            >
              {message.text}
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
};

export default Chat;
