"use client";
import React from "react";
import { Input } from "./ui/input";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@/lib/store/user";
import { Imessage, useMessage } from "@/lib/store/messages";
import EmojiPicker from "emoji-picker-react";
import { SendHorizonal, Smile } from "lucide-react";

export default function ChatInput() {
	const user = useUser((state) => state.user);
	const addMessage = useMessage((state) => state.addMessage);
	const setOptimisticIds = useMessage((state) => state.setOptimisticIds);
	const [inputText, setInputText] = React.useState("");
	const supabase = supabaseBrowser();
	const [showEmojiPicker, setShowEmojiPicker] = React.useState(false);
	const handleSendMessage = async () => {
		if (inputText.trim()) {
			const id = uuidv4();
			const newMessage = {
				id,
				text: inputText,
				send_by: user?.id,
				is_edit: false,
				created_at: new Date().toISOString(),
				users: {
					id: user?.id,
					avatar_url: user?.user_metadata.avatar_url,
					created_at: new Date().toISOString(),
					display_name: user?.user_metadata.user_name,
				},
			};
			addMessage(newMessage as Imessage);
			setOptimisticIds(newMessage.id);
			const { error } = await supabase
				.from("messages")
				.insert({ text: inputText, id });
			if (error) {
				toast.error(error.message);
			}
			setInputText(""); // Clear sau khi gửi
		} else {
			toast.error("Message cannot be empty!!");
		}
	};

	return (
		// <div className="p-5">
		// 	<div className="p-5 flex items-center gap-2">
		// 		<Input
		// 			placeholder="Send message"
		// 			value={inputText}
		// 			onChange={(e) => setInputText(e.target.value)}
		// 			className="text-base"
		// 		/>
		// 		<button
		// 			onClick={handleSendMessage}
		// 			className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
		// 		>
		// 			Send
		// 		</button>
		// 	</div>
		// </div>
		<div className="p-5 flex items-center gap-2 relative">
			{/* Emoji Toggle Button */}
			<button
				type="button"
				onClick={() => setShowEmojiPicker((prev) => !prev)}
				className="text-xl"
			>
				<Smile />
			</button>

			{/* Emoji Picker Popup */}
			{showEmojiPicker && (
				<div className="absolute bottom-14 left-0 z-10">
					<EmojiPicker
						onEmojiClick={(emojiData) => {
							setInputText((prev) => prev + emojiData.emoji);
							setShowEmojiPicker(false);
						}}
					/>
				</div>
			)}

			{/* Input + Send */}
			<Input
				placeholder="Send message"
				value={inputText}
				onChange={(e) => setInputText(e.target.value)}
				className="text-base"
			/>

			<button
				onClick={handleSendMessage}
				className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-1"
			>
				<SendHorizonal size={18} />
				<span className="hidden sm:inline">Send</span>
			</button>
		</div>
	);
}
