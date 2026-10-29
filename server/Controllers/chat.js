const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MAX_HISTORY = 12;

const SYSTEM_PROMPT = `You are the Equilix assistant, a warm, supportive guide for teenagers on Equilix, a mental health check-in app.
- Help with feelings, stress, anxiety, low mood, sleep, school pressure, friendships, family and general wellbeing.
- If asked about something unrelated, say briefly that you're here for wellbeing topics and offer to help with that instead.
- Write in plain, friendly language a teenager would use. Keep answers short: a few sentences or a short list.
- Never diagnose. Suggest talking to a trusted adult, school counselor or doctor when it would help.
- If someone mentions self-harm, suicide or being in danger, respond with care, encourage them to reach out right now, and share: call or text 988 in the US, or find a local helpline at findahelpline.com.`;

exports.postChat = async (req, res) => {
  const { question, messages } = req.body;

  // Accept a running conversation, or a single question from older clients
  const history = Array.isArray(messages)
    ? messages
        .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
        .slice(-MAX_HISTORY)
        .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }))
    : question
    ? [{ role: "user", content: String(question).slice(0, 4000) }]
    : [];

  if (history.length === 0 || history[history.length - 1].role !== "user") {
    return res.status(400).json({ success: false, message: "Question is required" });
  }

  try {
    const response = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...history],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(502).json({ success: false, message: data.error?.message || "AI request failed" });
    }

    return res.json({ success: true, answer: data.choices[0].message.content });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
