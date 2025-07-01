"use client";
import { useUser } from "@/lib/store/user";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { useEffect, useRef, useState } from "react";

let channelRefGlobal: any = null;

export function untrackPresence() {
	if (channelRefGlobal) {
		channelRefGlobal.untrack();
	}
}

export default function ChatPresence() {
	const channelRef = useRef<any>(null);
	const user = useUser((state) => state.user);
	const supabase = supabaseBrowser();
	const [onlineUsers, setOnlineUsers] = useState(0);

	useEffect(() => {
		if (!user?.id) return;

		if (channelRef.current) {
			supabase.removeChannel(channelRef.current);
		}

		const channel = supabase.channel("room1", {
			config: {
				presence: {
					key: user.id.toString(),
				},
			},
		});
		channelRef.current = channel;
		channelRefGlobal = channel; // expose to outside

		const updateOnlineCount = () => {
			const state = channel.presenceState();
			const userIds: string[] = [];
			for (const id in state) {
				const entries = state[id];
				for (const entry of entries as any) {
					userIds.push(entry.user_id);
				}
			}

			setOnlineUsers([...new Set(userIds)].length);
		};

		channel
			.on("presence", { event: "sync" }, updateOnlineCount)
			.on("presence", { event: "join" }, updateOnlineCount)
			.on("presence", { event: "leave" }, updateOnlineCount)
			.subscribe(async (status) => {
				if (status === "SUBSCRIBED") {
					await channel.track({
						online_at: new Date().toISOString(),
						user_id: user.id,
					});
				}
			});

		return () => {
			supabase.removeChannel(channel);
			channelRef.current = null;
			channelRefGlobal = null;
		};
	}, [user?.id]);

	if (!user) {
		return <div className="h-3 w-1"></div>;
	}

	return (
		<div className="flex items-center gap-1">
			<div className="h-4 w-4 bg-green-500 rounded-full animate-pulse"></div>
			<h1 className="text-sm text-gray-400">{onlineUsers} online</h1>
		</div>
	);
}
