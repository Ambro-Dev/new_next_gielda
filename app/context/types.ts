import { Message } from "@prisma/client";

export type MessageWithUser = Message & {
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
  conversation?: {
    id: string;
  };
  offer?: {
    id: string;
    creator: { id: string };
  };
  transport?: {
    id: string;
    creator: { id: string };
  };
};

export type OfferWithUser = {
  id: string;
  createdAt: string;
  text: string;
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
  transport: {
    id: string;
  };
};

export type FileMessage = {
  fileName: string;
  createdAt: string;
  sender: {
    id: string;
    username: string;
    email: string;
  };
  reciever: {
    id: string;
  };
  offer: {
    id: string;
  };
  transport: {
    id: string;
  };
};
