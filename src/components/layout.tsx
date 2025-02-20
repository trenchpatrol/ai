import React, {PropsWithChildren} from "react";
import {Trash2, User, LogOut, LayoutDashboard, LogIn, MessageCircle} from "lucide-react";
import {Button} from "~/components/ui";
import {usePrivy} from "@privy-io/react-auth";
import {cn} from "~/lib/utils";
import {exoTwo} from "~/lib/fonts";
import {useRouter} from "next/router";
import {ChatHistory} from "./chat-history";
import {chatAtom} from "~/state/chat";
import {useSetAtom} from "jotai";

const Sidebar = () => {
  const {authenticated, logout, ready, login, user} = usePrivy();
  const {push, replace} = useRouter();

  const setMessages = useSetAtom(chatAtom);

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
        "flex h-screen w-[300px] flex-col border-r border-white/10 bg-[#1C1C1C] p-4 text-white",
        exoTwo.className,
      )}>
      <Button
        onClick={onNavigateToNewChat}
        className="mb-7 w-full bg-[#00FFA3] text-base text-black hover:bg-white">
        + New chat
      </Button>

      <nav className="flex-1">
        <ul className="space-y-2">
          <li className="flex cursor-pointer items-center gap-2 rounded-md px-2.5 pb-2 pt-2.5 hover:bg-[#00FFA3] hover:text-black">
            <LayoutDashboard size={20} /> Home
          </li>
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
              <li className="flex cursor-pointer items-center gap-2 rounded-md p-2.5 hover:bg-[#00FFA3] hover:text-black">
                <Trash2 size={20} /> Delete conversations
              </li>
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
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className={cn("flex-1 overflow-auto p-6 text-[15px]", exoTwo.className)}>
        {children}
      </main>
    </div>
  );
};
