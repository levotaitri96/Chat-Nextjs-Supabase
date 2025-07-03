"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import ChatPresence, { untrackPresence } from "./ChatPresence";
import { Settings2, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export default function ChatHeader({ user }: { user: User | undefined }) {
	const router = useRouter();
	const { setTheme } = useTheme(); // hook của next-themes

	const handleLoginWithGoogle = () => {
		const supabase = supabaseBrowser();
		supabase.auth.signInWithOAuth({
			provider: "google",
			// provider: "github",
			options: {
				redirectTo: location.origin + "/auth/callback",
			},
		});
	};

	const handleLogout = async () => {
		untrackPresence();
		const supabase = supabaseBrowser();
		await supabase.auth.signOut();
		router.refresh();
	};

	return (
		<div className="h-20">
			<div className="p-5 border-b flex items-center justify-between h-full">
				<div>
					<h1 className="text-xl font-bold">Chat With Lê Võ Tài Trí</h1>
					<ChatPresence />
				</div>
				<div className="flex items-center gap-3">
					{/* Setting dropdown */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon">
								<Settings2 size={20} />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={() => setTheme("light")}>
								<Sun className="mr-2 h-4 w-4" />
								Light
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setTheme("dark")}>
								<Moon className="mr-2 h-4 w-4" />
								Dark
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					{/* Login / Logout */}
					{user ? (
						<Button onClick={handleLogout}>Logout</Button>
					) : (
						<Button onClick={handleLoginWithGoogle}>Login</Button>
					)}
				</div>
			</div>
		</div>
	);
}
