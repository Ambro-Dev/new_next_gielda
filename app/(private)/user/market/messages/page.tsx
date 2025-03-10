import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import React from "react";
import { ExtendedTransport } from "../page";
import { MessagesTable } from "./messages-table";
import { axiosInstance } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import NewConversationDialog from "./new-conversation-dialog";

type Props = {};

const getConversations = async (
  userId: string
): Promise<ExtendedConversation[]> => {
  try {
    const response = await axiosInstance.get(
      `/api/messages/user?userId=${userId}`
    );
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export type ExtendedConversation = {
  id: string;
  transport: ExtendedTransport;
  messages: {
    id: string;
    createdAt: Date;
    text: string;
    sender: {
      id: string;
      username: string;
    };
  }[];
  users: {
    id: string;
    username: string;
  }[];
};

const getUsers = async (
  userId: string
): Promise<{ label: string; value: string }[]> => {
  try {
    const response = await axiosInstance.get(`/api/users?userId=${userId}`);
    const data = response.data;
    return data.users;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const MarketMessages = async (props: Props) => {
  const session = await getServerSession(authOptions);
  const conversations = await getConversations(String(session?.user?.id));
  const users = await getUsers(String(session?.user?.id));

  return (
    <div className="flex flex-col">
      <NewConversationDialog users={users} userId={String(session?.user.id)} />
      <MessagesTable data={conversations} userId={String(session?.user.id)} />
    </div>
  );
};

export default MarketMessages;
