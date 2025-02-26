import React, {PropsWithChildren, useState} from "react";
import {
  Trash2,
  User,
  LogOut,
  LayoutDashboard,
  LogIn,
  MessageCircle,
  Menu,
  X,
  Edit,
} from "lucide-react";
import {Button} from "~/components/ui";
import {usePrivy} from "@privy-io/react-auth";
import {cn} from "~/lib/utils";
import {exoTwo} from "~/lib/fonts";
import {useRouter} from "next/router";
import {ChatHistory} from "./chat-history";
import {chatAtom} from "~/state/chat";
import {useSetAtom} from "jotai";
import {useDeleteChat} from "~/hooks/useChat";
import Link from "next/link";

const Sidebar = () => {
  const {authenticated, logout, ready, login, user} = usePrivy();
  const {push, replace, query} = useRouter();

  const setMessages = useSetAtom(chatAtom);
  const deleteChat = useDeleteChat();
  const isCurrentChat = query.type === "current-chat";
  const chatId = query.id as string;

  const onNavigateToNewChat = () => {
    if (authenticated) {
      return replace(`/chat?id=${self.crypto.randomUUID()}&type=new-chat`);
    }

    return login();
  };

  const onLogout = () => {
    logout();
    setMessages(null);
    push("/chat");
  };

  return (
    <aside
      className={cn(
        "flex h-screen w-full flex-col overflow-auto border-r border-white/10 bg-[#1C1C1C] p-4 text-white ipad-mini:w-[350px]",
        exoTwo.className,
      )}>
      <Button
        onClick={onNavigateToNewChat}
        className="mb-7 w-full bg-[#00FFA3] text-base text-black hover:bg-white">
        + New chat
      </Button>

      <nav className="flex-1">
        <ul className="space-y-2">
          <Link href="https://trenchpatrol.ai" target="_blank">
            <li className="flex cursor-pointer items-center gap-2 rounded-md px-2.5 pb-2 pt-2.5 hover:bg-[#00FFA3] hover:text-black">
              <LayoutDashboard size={20} /> Home
            </li>
          </Link>
          {authenticated && (
            <li className="p-2.5">
              <div className="flex items-center space-x-2">
                <MessageCircle size={20} />
                <p>Recents</p>
              </div>
              <div className="mt-5">
                <ChatHistory />
              </div>
            </li>
          )}
        </ul>
      </nav>

      <div className="mt-4 border-t border-gray-700 pt-4">
        <ul className="space-y-2">
          {!!user && (
            <>
              {isCurrentChat && (
                <li
                  onClick={() => deleteChat.mutate({chatId})}
                  className="flex cursor-pointer items-center gap-2 rounded-md p-2.5 hover:bg-[#00FFA3] hover:text-black">
                  <Trash2 size={20} /> Delete conversations
                </li>
              )}
              <li className="flex cursor-pointer items-center gap-2 rounded-md p-2.5 hover:bg-[#00FFA3] hover:text-black">
                <User size={20} /> My account
              </li>
              <li
                className="flex cursor-pointer items-center gap-2 rounded-md p-2.5 text-red-400 hover:bg-[#00FFA3] hover:text-black"
                onClick={onLogout}>
                <LogOut size={20} /> Log out
              </li>
            </>
          )}

          {ready && !authenticated && (
            <li
              className="flex cursor-pointer items-center gap-2 rounded-md p-2.5 text-[#00FFA3] hover:bg-[#00FFA3] hover:text-black"
              onClick={login}>
              <LogIn size={20} /> Log in
            </li>
          )}
        </ul>
      </div>
    </aside>
  );
};

export const Layout = ({children}: PropsWithChildren) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="relative flex h-screen w-full">
      <div className="hidden nesthub:hidden laptop-sm:block">
        <Sidebar />
      </div>

      <div className="fixed z-50 h-[68px] w-full max-w-full bg-[#191919] px-5 py-3 nesthub:block laptop-sm:hidden">
        <div className="flex justify-between">
          <button
            type="button"
            onClick={toggleSidebar}
            className={cn(
              isSidebarOpen ? "right-5" : "left-5",
              "top-4 rounded-md bg-[#00FFA3] p-2 text-black hover:bg-white",
            )}>
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <button type="button">
            <Edit size={25} />
          </button>
        </div>
      </div>

      {isSidebarOpen && (
        <div className="fixed z-40 h-full w-4/5 nesthub:block laptop-sm:hidden">
          <Sidebar />
        </div>
      )}

      <main className={cn("flex-1 overflow-hidden p-1", exoTwo.className)}>
        {children}
      </main>
    </div>
  );
};
