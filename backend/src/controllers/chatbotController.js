const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// Advanced Knowledge Base Fallback Engine
function generateKnowledgeResponse(userMsg) {
  const query = (userMsg || "").toLowerCase();

  if (query.includes("fiverr") || query.includes("hire") || query.includes("order") || query.includes("gig")) {
    return `💼 **Hire Aditya Kumar on Fiverr!**
Aditya has completed 50+ orders with a perfect ⭐ 5.0 Rating! You can view his active gigs and hire him directly here:
👉 **[Aditya's Fiverr Profile](https://www.fiverr.com/adityachaura/buying?source=avatar_menu_profile)**

Direct Contact:
- 📧 Email: adityakumar583ak@gmail.com
- 💬 WhatsApp: +91 7070371608`;
  }

  if (query.includes("price") || query.includes("cost") || query.includes("rate") || query.includes("fee") || query.includes("budget")) {
    return `💰 **Aditya's Service Rates & Pricing**:

1. 🤖 **AI-Powered Applications**: Custom AI Agents, LLMs & RAG (Starting at $2,500)
2. 💻 **Full-Stack Development**: Custom React/Node.js web apps (Starting at $3,000)
3. 🎥 **Content & Video Editing**: Scriptwriting, SEO & editing (Starting at $500 / video)
4. 📝 **Technical Writing**: Articles & developer docs (Starting at $300 / article)
5. 💡 **Technical Consulting**: System architecture & tech reviews ($150 / hour)

Ready to start? Reach out via WhatsApp **+91 7070371608** or email **adityakumar583ak@gmail.com**!`;
  }

  if (query.includes("service") || query.includes("offer") || query.includes("do") || query.includes("work")) {
    return `🚀 **Services Offered by Aditya Kumar**:

- **AI Development**: Custom LLM agents, RAG document search, and chatbot integrations.
- **Full Stack Web Apps**: Production-grade React, Next.js, Node.js, and Python backend development.
- **Content & YouTube Creation**: Technical video production, scripting, and SEO for dev channels.
- **Code Audit & Consulting**: Technical architecture guidance and performance optimization.

View his verified Fiverr profile: **[Fiverr Gigs](https://www.fiverr.com/adityachaura/buying?source=avatar_menu_profile)**`;
  }

  if (query.includes("contact") || query.includes("reach") || query.includes("email") || query.includes("phone") || query.includes("whatsapp")) {
    return `📞 **Get in Touch with Aditya Kumar**:

- 📧 **Email**: adityakumar583ak@gmail.com
- 💬 **WhatsApp**: +91 7070371608
- 🟢 **Fiverr**: [fiverr.com/adityachaura](https://www.fiverr.com/adityachaura/buying?source=avatar_menu_profile)
- 🐙 **GitHub**: [github.com/Adityakumarchaurasiya](https://github.com/Adityakumarchaurasiya)
- 🎥 **YouTube**: [@AdityaKnowledgeHub-e8h](https://www.youtube.com/@AdityaKnowledgeHub-e8h)

He typically responds within a few hours!`;
  }

  if (query.includes("youtube") || query.includes("channel") || query.includes("video") || query.includes("subscriber")) {
    return `🎥 **YouTube Channel: @AdityaKnowledgeHub-e8h**
Aditya produces tutorials and practical guides on software engineering, full-stack development, AI automation, and cloud deployments.
Check out the channel on YouTube: **[Aditya Knowledge Hub](https://www.youtube.com/@AdityaKnowledgeHub-e8h)**!`;
  }

  if (query.includes("github") || query.includes("project") || query.includes("code") || query.includes("repo")) {
    return `🐙 **GitHub Projects & Contributions**:
Aditya is an active open-source creator with custom AI repositories, property-matching engines, and web apps.
Explore his code repositories on GitHub: **[Adityakumarchaurasiya](https://github.com/Adityakumarchaurasiya)**!`;
  }

  if (query.includes("who") || query.includes("aditya") || query.includes("about") || query.includes("background")) {
    return `👋 **About Aditya Kumar**:
Aditya is a Full-Stack Software Developer, AI Engineer, and Tech Content Creator. He builds intelligent web platforms, LLM agentic workflows, and creates educational software content.

- 🌟 50+ Completed Freelance Projects
- 💬 Direct Contact: adityakumar583ak@gmail.com | +91 7070371608`;
  }

  return `🤖 **Hi! I am Aditya's AI Assistant.**
I can help you learn more about Aditya's background, services, pricing, projects, or guide you on how to hire him!

Popular topics:
- 📋 **Services**: Ask "What services do you offer?"
- 💰 **Pricing**: Ask "What are your service rates?"
- 💼 **Fiverr**: Ask "How can I hire you on Fiverr?"
- 📞 **Contact**: Ask "How can I contact Aditya?"`;
}

async function handleChatCompletions(req, res) {
  const { message, history } = req.body;
  const groqApiKey = process.env.GROQ_API_KEY;

  // System Prompt for Groq AI
  const systemPrompt = {
    role: "system",
    content: `You are Aditya Kumar's professional AI Assistant. Your goal is to represent Aditya, helping visitors understand his expertise, services, and pricing, and guide them to hire him.
Verified Information about Aditya:
- **Full Name**: Aditya Kumar
- **Role**: Software Developer & Content Creator
- **YouTube Channel**: @AdityaKnowledgeHub-e8h
- **GitHub**: @Adityakumarchaurasiya
- **LinkedIn**: Aditya Chaurasiya
- **Fiverr Profile**: https://www.fiverr.com/adityachaura/buying?source=avatar_menu_profile (5.0 rating, 50+ completed orders).
- **Contact Details**: Email: adityakumar583ak@gmail.com | WhatsApp: +91 7070371608

Always be polite, encouraging, professional, and provide helpful direct links when answering!`,
  };

  // If GROQ_API_KEY is available, attempt AI call with Groq
  if (groqApiKey) {
    try {
      const formattedHistory = (history || []).map((msg) => ({
        role: msg.isUser ? "user" : "assistant",
        content: msg.text,
      }));

      const messages = [
        systemPrompt,
        ...formattedHistory,
        { role: "user", content: message },
      ];

      const response = await fetch(GROQ_API_URL, {
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

      if (response.ok) {
        const data = await response.json();
        const reply = data?.choices?.[0]?.message?.content;
        if (reply) {
          return res.json({ reply });
        }
      }
    } catch (err) {
      console.warn("Groq AI API call failed, using Knowledge Base fallback:", err.message);
    }
  }

  // Fallback to Knowledge Base Engine if Groq API key is missing or fails
  const fallbackReply = generateKnowledgeResponse(message);
  return res.json({ reply: fallbackReply });
}

module.exports = { handleChatCompletions };
