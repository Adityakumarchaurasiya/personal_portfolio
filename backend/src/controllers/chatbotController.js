async function handleChatCompletions(req, res) {
  const { message, history } = req.body;
  const groqApiKey = process.env.GROQ_API_KEY;

  if (!groqApiKey) {
    return res.status(500).json({
      message: "Groq API configuration missing on the server. Please contact admin.",
    });
  }

  // Construct standard OpenAI-compatible message history
  const systemPrompt = {
    role: "system",
    content: `You are Aditya Kumar's professional AI Assistant. Your goal is to represent Aditya, helping visitors understand his expertise, services, and pricing, and guide them to hire him.
Here is all the verified information about Aditya:
- **Full Name**: Aditya Kumar
- **Role**: Software Developer & Content Creator
- **YouTube Channel**: @AdityaKnowledgeHub-e8h with 15k+ subscribers. He teaches full-stack development, AI applications, and automation workflows.
- **GitHub**: @Adityakumarchaurasiya, active open source creator with 80+ stars and custom AI repositories.
- **LinkedIn**: Aditya Chaurasiya, AI & Full Stack Professional network with 2,500+ contacts.
- **Expertise**: AI Agents, LLM Integrations (GPT, Claude, Gemini), RAG Systems, React/Next.js Web Apps, Node.js, Python, YouTube Video Scripting & Editing.
- **Fiverr Profile**: You can hire him on Fiverr at https://www.fiverr.com/adityachaura/buying?source=avatar_menu_profile (He has completed 50+ orders with a perfect 5.0-star rating!).
- **Services Offered & Pricing**:
  1. AI-Powered Applications: Custom AI Agents, LLM integrations, RAG. Starting from $2,500.
  2. Full Stack Development: React/Next.js and Node.js/Python apps. Starting from $3,000.
  3. Content Creation: Scriptwriting, video editing, YouTube SEO. Starting from $500 per video.
  4. Technical Writing: Developer essays, tutorials, blog posts. Starting from $300 per article.
  5. Tech Consulting: Architecture reviews, technical mock interviews. $150 per hour.
  6. Open Source Contributions: Features and bug fixes. Custom Quote.
- **Contact Details**:
  - Email: adityakumar583ak@gmail.com
  - WhatsApp: +91 7070371608
- **Availability**: Active and available for work. Responses typically within 24 hours.

Guidelines for response:
- Be polite, professional, encouraging, and helpful.
- Keep your answers concise, engaging, and directly related to the user's inquiry.
- Always provide helpful direct links (e.g. email, contact form, or his Fiverr profile at https://www.fiverr.com/adityachaura/buying?source=avatar_menu_profile) if the user wants to start a project or hire him!`,
  };

  const formattedHistory = (history || []).map((msg) => ({
    role: msg.isUser ? "user" : "assistant",
    content: msg.text,
  }));

  const messages = [
    systemPrompt,
    ...formattedHistory,
    { role: "user", content: message },
  ];

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${groqApiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `Groq completions error (${response.status})`);
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || "I'm sorry, I encountered an issue processing that query.";
    res.json({ reply });
  } catch (error) {
    console.error("Chatbot completions failed:", error.message);
    res.status(500).json({ message: error.message });
  }
}

module.exports = { handleChatCompletions };
