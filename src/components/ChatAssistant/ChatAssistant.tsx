import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader, Bot, User, Sparkles } from "lucide-react";
import { useChatData } from "./ChatContext";
import { generateResponse, generateWelcomeMessage, ChatData } from "./chatUtils";
import "./ChatAssistant.css";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatAssistantProps {
  className?: string;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get data from ChatContext (loaded once, no backend calls for chat)
  const { events, favorites, registrations, studentName, isLoading: isDataLoading } = useChatData();

  // Build chat data object for response generation
  const chatData: ChatData = {
    events,
    favorites,
    registrations,
    studentName,
  };

  // Initialize chat with welcome message when opened
  useEffect(() => {
    if (isOpen && messages.length === 0 && !isDataLoading) {
      const welcomeMessage = generateWelcomeMessage(chatData);
      setMessages([{
        id: "welcome",
        role: "assistant",
        content: welcomeMessage,
        timestamp: new Date(),
      }]);
    }
  }, [isOpen, messages.length, isDataLoading, chatData]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Process message locally - no backend calls
  const handleSend = () => {
    if (!inputValue.trim() || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsProcessing(true);

    // Small delay for UX - makes it feel more natural
    setTimeout(() => {
      // Generate response using local data only
      const response = generateResponse(userMessage.content, chatData);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsProcessing(false);
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Format message content with basic markdown support
  const formatMessage = (content: string) => {
    return content
      .split("\n")
      .map((line, i) => {
        // Bold text
        const boldFormatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        return <p key={i} dangerouslySetInnerHTML={{ __html: boldFormatted }} />;
      });
  };

  return (
    <div className={`chat-assistant ${className}`}>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`chat-assistant-toggle ${isOpen ? "active" : ""}`}
        aria-label={isOpen ? "Închide chat" : "Deschide chat"}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        {!isOpen && (
          <span className="chat-assistant-badge">
            <Sparkles size={12} />
          </span>
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="chat-assistant-panel">
          {/* Header */}
          <div className="chat-assistant-header">
            <div className="chat-assistant-header-info">
              <div className="chat-assistant-avatar">
                <Bot size={20} />
              </div>
              <div>
                <h3>Asistent UNIfy</h3>
                <span className="chat-assistant-status">
                  <span className="status-dot"></span>
                  Online
                </span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="chat-assistant-close">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="chat-assistant-messages">
            {isDataLoading ? (
              <div className="chat-message assistant">
                <div className="chat-message-avatar">
                  <Bot size={16} />
                </div>
                <div className="chat-message-content typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`chat-message ${message.role === "user" ? "user" : "assistant"}`}
                >
                  <div className="chat-message-avatar">
                    {message.role === "user" ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className="chat-message-content">
                    {formatMessage(message.content)}
                  </div>
                </div>
              ))
            )}
            {isProcessing && (
              <div className="chat-message assistant">
                <div className="chat-message-avatar">
                  <Bot size={16} />
                </div>
                <div className="chat-message-content typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="chat-assistant-input">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Scrie un mesaj..."
              disabled={isProcessing}
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isProcessing}
              className="chat-send-btn"
            >
              {isProcessing ? <Loader size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatAssistant;
