import {useState} from "react";
import {Button} from "~/components/ui";
import {useGetChat, useSendChat} from "~/hooks/useChat";
import {usePrivy} from "@privy-io/react-auth";
import {useQueryClient} from "@tanstack/react-query";

const Chat = () => {
  const {ready, authenticated, user, login, logout} = usePrivy();
  const {data, isLoading, error} = useGetChat({userId: user?.id as string});
  const [message, setMessage] = useState("");

  const sendChat = useSendChat();
  const qc = useQueryClient();

  const handleStartChat = () => {
    setMessage("");
    sendChat.mutateAsync(
      {userId: user?.id!, userMessage: message},
      {
        onSuccess: () => {
          qc.invalidateQueries({queryKey: ["get-chats"]});
        },
      },
    );
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading user data</p>;

  return (
    <div>
      {ready && !authenticated && <Button onClick={login}>Login</Button>}
      {!!authenticated && <Button onClick={logout}>Logout</Button>}

      {!!authenticated && (
        <div>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className="input"
          />
          <Button onClick={handleStartChat} disabled={!message}>
            Start Chat
          </Button>
        </div>
      )}
    </div>
  );
};

export default Chat;
