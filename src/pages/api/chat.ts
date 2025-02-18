import {NextApiRequest, NextApiResponse} from "next";
import {generateText} from "ai";
import {openai} from "@ai-sdk/openai";
import {PostgrestError, createClient} from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_API_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({error: "Method not allowed"});
  }

  const {userId, userMessage} = req.body;

  if (!userId || !userMessage) {
    return res.status(400).json({error: "Missing userId or userMessage"});
  }

  try {
    const {data: previousChats, error: fetchError} = await supabase
      .from("chats")
      .select("id, messages")
      .eq("user_id", userId)
      .order("created_at", {ascending: false})
      .limit(1);

    if (fetchError) throw fetchError;

    let messages = [];
    let chatId: string | undefined;

    if (previousChats?.length) {
      messages = previousChats[0]?.messages || [];
      chatId = previousChats[0]?.id;
      messages.push({role: "user" as const, content: userMessage});
    } else {
      messages.push({role: "user" as const, content: userMessage});
    }

    const {text} = await generateText({
      model: openai("gpt-4o"),
      system: "You are a friendly assistant!",
      messages,
    });

    const assistantMessage = {role: "assistant", content: text};
    messages.push(assistantMessage);

    let insertOrUpdateError: PostgrestError | null;

    if (chatId) {
      const {error: updateError} = await supabase
        .from("chats")
        .update({messages})
        .eq("id", chatId);

      insertOrUpdateError = updateError;
    } else {
      const {error: insertError} = await supabase
        .from("chats")
        .insert([{user_id: userId, messages}]);

      insertOrUpdateError = insertError;
    }

    if (insertOrUpdateError) throw insertOrUpdateError;

    return res.status(200).json({assistantMessage});
  } catch (error) {
    console.error("Error creating or updating chat:", error);
    return res.status(500).json({error: "Internal server error"});
  }
}
