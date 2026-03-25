import axios from "axios";

export const ai = async (req, res) => {
  try {
    const { message } = req.body;
console.log(message);

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo", // free/cheap model
        messages: [
          {
            role: "system",
            content: "You are a chat assistant. Reply like WhatsApp short message.",
          },
          {
            role: "user",
            content: message,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.choices[0].message.content;

    res.json({ reply });

  } catch (err) {
    console.log(err.response?.data || err.message);
    res.status(500).json({ error: "AI failed" });
  }
};
export const suggestMessages = async (req, res) => {
    try {
        const { messages } = req.body;
        console.log(messages);
        const formattedMessages = messages.map((m) => {
  if (m.text && m.text.trim() !== "") {
    return `${m.senderId}: ${m.text}`;
  }

  // 📁 Handle files
  if (m.fileType?.startsWith("image")) {
    return `${m.senderId}: [Image]`;
  }

  if (m.fileType?.startsWith("video")) {
    return `${m.senderId}: [Video]`;
  }

  if (m.fileType?.includes("zip")) {
    return `${m.senderId}: [ZIP File]`;
  }

  if (m.fileType?.includes("text")) {
    return `${m.senderId}: [Text File]`;
  }

  return `${m.senderId}: [File]`;
}).join("\n");
        

    const prompt = `
Act like a real person chatting.

Based on the conversation, suggest 3 short replies.

Rules:
- Max 5–6 words per reply
- Casual tone (like WhatsApp chat)
- Friendly and natural
- No formal or AI-style language
- No long sentences

Conversation:
${formattedMessages}

Replies:
1.
2.
3.
`;
console.log(prompt);


    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const text = response.data.choices[0].message.content;

   
    const suggestions = text
      .split("\n")
      .filter(line => line.trim() !== "");

    res.json({ suggestions });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "AI failed" });
  }
};