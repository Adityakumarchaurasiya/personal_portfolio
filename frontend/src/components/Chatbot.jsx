import { useState, useEffect, useRef } from "react";
import { api } from "../services/api";
import "./Chatbot.css";

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      text: "👋 Hi there! I'm Aditya's AI assistant. Ask me anything about his skills, services, pricing, fiverr or contact info!",
      isUser: false,
      isQuickReplies: true,
    },
  ]);
  const [history, setHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleToggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || input.trim();
    if (!text) return;

    // Clear input if sending from text bar
    if (!textToSend) setInput("");

    // Add user message
    const userMsg = { text, isUser: true };
    setMessages((prev) => [...prev, userMsg]);

    setIsTyping(true);

    try {
      // Send chat completion request to backend secure Groq proxy
      const response = await api.sendChatMessage(text, history);
      
      const botMsg = { text: response.reply, isUser: false };
      setMessages((prev) => [...prev, botMsg]);
      
      // Update historical memory for context tracking
      setHistory((prev) => [
        ...prev,
        { text, isUser: true },
        { text: response.reply, isUser: false },
      ]);
    } catch (err) {
      console.error("Chat completion error:", err);
      const errMsg = {
        text: "Sorry, I am having trouble connecting to the network right now. You can reach out directly via the email contact form!",
        isUser: false,
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleQuickReply = (topic) => {
    let query = "";
    switch (topic) {
      case "services":
        query = "What services do you offer?";
        break;
      case "experience":
        query = "Tell me about your background and experience.";
        break;
      case "pricing":
        query = "What are your service pricing rates?";
        break;
      case "contact":
        query = "How can I hire or contact you?";
        break;
      default:
        return;
    }
    handleSendMessage(query);
  };

  const renderFormattedText = (text) => {
    if (!text) return null;
    const lines = text.split("\n");
    return lines.map((line, i) => {
      const parts = line.split(/(\[.*?\]\(https?:\/\/[^\s)]+\)|https?:\/\/[^\s]+)/g);
      return (
        <p key={i} style={{ margin: 0, marginBottom: "0.35rem" }}>
          {parts.map((part, j) => {
            const matchLink = part.match(/^\[(.*?)\]\((https?:\/\/[^\s)]+)\)$/);
            if (matchLink) {
              return (
                <a
                  key={j}
                  href={matchLink[2]}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#00f2fe", textDecoration: "underline", fontWeight: 600 }}
                >
                  {matchLink[1]}
                </a>
              );
            }
            if (part.startsWith("http://") || part.startsWith("https://")) {
              return (
                <a
                  key={j}
                  href={part}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#00f2fe", textDecoration: "underline", fontWeight: 600 }}
                >
                  {part}
                </a>
              );
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className="chatbot-container">
      {/* Floating Toggle Button */}
      <button 
        className={`chatbot-toggle ${isOpen ? "active" : ""}`} 
        onClick={handleToggleChat}
        aria-label="Toggle AI Assistant"
      >
        {isOpen ? <i className="fas fa-times"></i> : <i className="fas fa-comment-dots"></i>}
      </button>

      {/* Floating Chatbot Window */}
      <div className={`chatbot-window ${isOpen ? "open" : ""}`}>
        <div className="chatbot-header">
          <i className="fas fa-robot"></i>
          <div>
            <h4>Aditya AI Agent</h4>
            <span className="online-tag">Online &amp; Active</span>
          </div>
          <button className="chatbot-close" onClick={handleToggleChat}>&times;</button>
        </div>

        {/* Messages List Area */}
        <div className="chatbot-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message-wrapper ${msg.isUser ? "user-wrap" : "bot-wrap"}`}>
              {!msg.isUser && <i className="fas fa-robot chatbot-avatar-icon"></i>}
              <div className={`message ${msg.isUser ? "user-message" : "bot-message"}`}>
                {renderFormattedText(msg.text)}

                {msg.isQuickReplies && (
                  <div className="quick-replies">
                    <button className="quick-reply" onClick={() => handleQuickReply("services")}>
                      📋 Services
                    </button>
                    <button className="quick-reply" onClick={() => handleQuickReply("experience")}>
                      💼 Experience
                    </button>
                    <button className="quick-reply" onClick={() => handleQuickReply("pricing")}>
                      💰 Rates
                    </button>
                    <button className="quick-reply" onClick={() => handleQuickReply("contact")}>
                      📞 Contact
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="message-wrapper bot-wrap">
              <i className="fas fa-robot chatbot-avatar-icon"></i>
              <div className="message bot-message typing-indicator-box">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="chatbot-input-area">
          <input
            type="text"
            placeholder="Ask anything about Aditya..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isTyping}
          />
          <button onClick={() => handleSendMessage()} disabled={isTyping || !input.trim()}>
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
