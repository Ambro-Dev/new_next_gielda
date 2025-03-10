"use client";

import React from "react";
import ChatMessage from "./chat-message";
import { useSession } from "next-auth/react";

type Props = {
  messages: {
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
  }[];
};

const Messages = (props: Props) => {
  const chatRef = React.useRef<HTMLDivElement>(null);
  const bottomRef = React.useRef<HTMLDivElement>(null);

  const { data: session } = useSession();

  const messages = props.messages;

  React.useEffect(() => {
    if (!chatRef.current || !bottomRef.current) return;

    chatRef.current.scrollTop = bottomRef.current.offsetTop;
  }, [props.messages]);

  return (
    <div
      ref={chatRef}
      className="flex flex-col space-y-4 w-full max-h-[700px] overflow-auto"
    >
      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          message={message}
          user={String(session?.user.id)}
        />
      ))}
      <div ref={bottomRef}></div>
    </div>
  );
};

export default Messages;
