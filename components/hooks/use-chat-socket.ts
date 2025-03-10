"use client";

import { useSocket } from "@/app/context/socket-provider";
import { Message } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect } from "react";

type ChatSocketProps = {
  offerId: string;
  conversationId: string;
};

type MessageWithUser = Message & {};

export const useChatSocket = ({ offerId, conversationId }: ChatSocketProps) => {
  const params = useParams();
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  const { data, status } = useSession();

  const userId = data?.user?.id;

  useEffect(() => {
    if (!socket || !userId) return;

    socket.on(`user:${userId}:messages`, (message: MessageWithUser) => {});

    return () => {
      socket.off(`user:${userId}:messages`);
    };
  }, [socket, userId]);
};
