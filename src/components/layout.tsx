import React, {PropsWithChildren} from "react";
import {
  Trash2,
  User,
  LogOut,
  LayoutDashboard,
  ListCollapseIcon,
  LogIn,
  Loader2,
  Loader,
} from "lucide-react";
import {Button} from "~/components/ui";
import {usePrivy} from "@privy-io/react-auth";
import {cn} from "~/lib/utils";
import {geistSans} from "~/lib/fonts";
import {useRouter} from "next/router";

const Sidebar = () => {
  const {authenticated, logout, ready, login, user} = usePrivy();
  const {push} = useRouter();

  const onNavigateToNewChat = () => {
    if (authenticated) return push(`/chat/${self.crypto.randomUUID()}`);

    return login();
  };

  return (
    <aside
      className={cn(
        "flex h-screen w-[300px] flex-col border-r border-white/10 bg-[#1C1C1C] p-4 text-white",
        geistSans,
      )}>
      <Button
        onClick={onNavigateToNewChat}
        className="mb-7 w-full bg-[#00FFA3] text-base text-black hover:bg-white">
        + New chat
      </Button>

      <nav className="flex-1">
        <ul className="space-y-2">
          <li className="flex cursor-pointer items-center gap-2 rounded-md p-2.5 hover:bg-[#00FFA3] hover:text-black">
            <LayoutDashboard size={20} /> Home
          </li>
          <li className="flex cursor-pointer items-center gap-2 rounded-md p-2.5 hover:bg-[#00FFA3] hover:text-black">
            <ListCollapseIcon size={20} /> Chat History
          </li>
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
                onClick={logout}>
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
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  );
};
