import {ChatBox} from "~/components/chatbox";
import {Layout} from "~/components/layout";

const Chat = () => {
  return (
    <Layout>
      <div className="flex h-full flex-col items-center justify-end">
        <ChatBox />
      </div>
    </Layout>
  );
};

export default Chat;
