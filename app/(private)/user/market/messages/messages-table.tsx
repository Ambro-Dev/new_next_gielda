"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ExtendedConversation } from "./page";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowRight, MessageCircle } from "lucide-react";
import { useMessages } from "@/app/context/message-provider";

export function MessagesTable({
  data,
  userId,
}: {
  data: ExtendedConversation[];
  userId: string;
}) {
  const { messages } = useMessages();

  return (
    <Table>
      <TableCaption>Lista wiadomości</TableCaption>
      <TableBody>
        {data?.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="sm:px-0 px-1">
              <Card
                className={`${
                  messages?.find(
                    (message) => message.conversation?.id === item.id
                  ) && "drop-shadow-md"
                } relative flex md:flex-row flex-col gap-4 md:justify-between items-center p-5`}
              >
                {messages?.find(
                  (message) => message.conversation?.id === item.id
                ) && (
                  <div className="absolute flex flex-row items-center gap-1 top-0 left-1">
                    <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-sm font-semibold">Nowa</span>
                  </div>
                )}
                <div>
                  <Avatar className="flex h-24 w-24">
                    <AvatarFallback className="px-2 text-sm">
                      {
                        item.users.filter((user) => user.id !== userId)[0]
                          .username
                      }
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="w-full flex flex-col items-center justify-center gap-4">
                  <Card className="w-full p-3">
                    <div className="w-full flex flex-row gap-8 h-full justify-between items-end">
                      <div className="flex flex-col gap-2">
                        <span className="text-sm font-semibold">
                          Ostatnia wiadomość:{" "}
                          <span>({item.messages[0].sender.username})</span>
                        </span>
                        {messages?.find(
                          (message) => message.conversation?.id === item.id
                        ) ? (
                          <span className="font-semibold text-ellipsis overflow-hidden md:line-clamp-1 line-clamp-3">
                            {item.messages[item.messages.length - 1].text}
                          </span>
                        ) : (
                          <span className="font-light text-ellipsis overflow-hidden md:line-clamp-1 line-clamp-3">
                            {item.messages[item.messages.length - 1].text}
                          </span>
                        )}
                      </div>
                      <Link href={`/user/market/messages/${item.id}`}>
                        <Button>Odpowiedz</Button>
                      </Link>
                    </div>
                  </Card>
                  {item.transport && (
                    <div className="w-full flex flex-row justify-end items-center">
                      <span>Dotyczy ogłoszenia</span>
                      <ArrowRight className="mx-5" size={10} />
                      <Link
                        href={`/transport/${item.transport.id}`}
                        className="sm:self-end hover:underline"
                      >
                        Przejdź do ogłoszenia
                      </Link>
                    </div>
                  )}
                </div>
              </Card>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
