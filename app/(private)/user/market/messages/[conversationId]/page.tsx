"use client";

import { useMessages } from "@/hooks/use-messages";
import { useSupabase } from "@/context/supabase-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useRef, useEffect } from "react";
import { Loader2, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { pl } from "date-fns/locale";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";

export default function ConversationPage({
	params,
}: { params: { conversationId: string } }) {
	const { conversationId } = params;
	const { messages, loading, sendMessage } = useMessages(conversationId);
	const { user } = useSupabase();
	const [text, setText] = useState("");
	const [sending, setSending] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const { toast } = useToast();

	// Przewijanie do najnowszej wiadomości
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const handleSendMessage = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!text.trim() || sending) return;

		setSending(true);
		try {
			const result = await sendMessage(text);
			if (result) {
				setText("");
			} else {
				toast({
					title: "Błąd",
					description: "Nie udało się wysłać wiadomości",
					variant: "destructive",
				});
			}
		} finally {
			setSending(false);
		}
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-[calc(100vh-200px)]">
				<Loader2 className="w-8 h-8 animate-spin" />
			</div>
		);
	}

	return (
		<div className="flex flex-col h-[calc(100vh-200px)]">
			<div className="flex-1 overflow-y-auto p-4 space-y-4">
				{messages.map((message) => (
					<div
						key={message.id}
						className={`flex ${
							message.sender.id === user?.id ? "justify-end" : "justify-start"
						}`}
					>
						<div
							className={`max-w-[80%] rounded-lg p-3 ${
								message.sender.id === user?.id
									? "bg-blue-500 text-white"
									: "bg-gray-200 text-black"
							}`}
						>
							<div className="flex items-center space-x-2 mb-1">
								<Avatar className="w-6 h-6">
									<AvatarFallback>
										{message.sender.username.charAt(0).toUpperCase()}
									</AvatarFallback>
								</Avatar>
								<span className="text-xs font-medium">
									{message.sender.username}
								</span>
							</div>
							<p>{message.text}</p>
							<p className="text-xs opacity-70 text-right mt-1">
								{formatDistanceToNow(new Date(message.created_at), {
									addSuffix: true,
									locale: pl,
								})}
							</p>
						</div>
					</div>
				))}
				<div ref={messagesEndRef} />
			</div>

			<div className="p-4 border-t">
				<form onSubmit={handleSendMessage} className="flex space-x-2">
					<Input
						value={text}
						onChange={(e) => setText(e.target.value)}
						placeholder="Wpisz wiadomość..."
						disabled={sending}
						className="flex-1"
					/>
					<Button type="submit" disabled={sending || !text.trim()}>
						{sending ? (
							<Loader2 className="w-4 h-4 animate-spin" />
						) : (
							<Send className="w-4 h-4" />
						)}
					</Button>
				</form>
			</div>
		</div>
	);
}
