import {useRouter} from "next/router";
import {useGetChatHistory} from "~/hooks/useChat";

export const ChatHistory = () => {
  const {data} = useGetChatHistory();
  const {replace} = useRouter();

  return (
    <ul>
      {Number(data?.chats.length) >= 1 ? (
        data?.chats.map((item, index) => (
          <li
            className="mb-3 cursor-pointer text-sm"
            key={item.chatId}
            onClick={() => replace(`/chat/${item.chatId}`)}>
            {index}. {item.chatName}
          </li>
        ))
      ) : (
        <li>
          <p className="text-center text-sm text-gray-400">No recent chats exist</p>
        </li>
      )}
    </ul>
  );
};
