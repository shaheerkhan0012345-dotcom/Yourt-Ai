import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  CornerDownLeft, 
  Maximize2, 
  HelpCircle,
  HelpCircleIcon
} from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Initialize with elegant greeting message
  const [messages, setMessages] = useState<Message[]>(() => {
    const raw = localStorage.getItem("yourt_chat_messages");
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error("Failed to parse saved chat history", e);
      }
    }
    return [
      {
        id: "greet-1",
        sender: "bot",
        text: "👋 Hey there! Welcome to **Yourt AI Creator Suite**. I'm your dedicated platform copilot.\n\nI can assist you in your creative workflow—helping you brainstorm viral titles, optimize retention hooks, style high-converting thumbnails, or format script segments. What are you building today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("yourt_chat_messages", JSON.stringify(messages));
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle open focus
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [isOpen]);

  // Automatically expand chat when custom support event is triggered
  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener("open-yourt-chat", handleOpenChat);
    return () => window.removeEventListener("open-yourt-chat", handleOpenChat);
  }, []);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: `msg-user-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setLoading(true);

    try {
      // Map existing messages into system format
      const historyLog = messages.slice(-10).map(m => ({
        role: m.sender === "user" ? "user" : "model",
        text: m.text
      }));

      const response = await fetch("/api/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend, history: historyLog })
      });

      if (!response.ok) {
        throw new Error("Chat api request was not resolved.");
      }

      const data = await response.json();
      
      const botMsg: Message = {
        id: `msg-bot-${Date.now()}`,
        sender: "bot",
        text: data.text || "I apologize, but I stumbled on compiling that outline. Let me know if we should try a different concept format!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error("Chat error:", err);
      // Fallback
      const botMsg: Message = {
        id: `msg-bot-fail-${Date.now()}`,
        sender: "bot",
        text: "✨ It seems I'm operating on local reserve mode. I can still help brainstorm! Let me know if you want hook suggestions or styling configurations.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    if (window.confirm("Are you sure you want to clear your current conversation history?")) {
      setMessages([
        {
          id: "greet-re",
          sender: "bot",
          text: "🔄 Conversational log reset. What topics or creative challenges should we tackle now?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  // Preset prompts tailored specifically to creator suite actions
  const presetPrompts = [
    { label: "💡 Brainstorm ideas", text: "Give me 3 viral video ideas for a coding channel" },
    { label: "🔥 Create a hook", text: "Create a curiosity-inducing 3-second hook" },
    { label: "✍️ Script blueprint", text: "Provide a systematic script layout for a tech tutorial" },
    { label: "🎨 Suggest thumbnail", text: "What colors and layouts optimize click-rates (CTR)?" }
  ];

  return (
    <div id="yourt-support-assistant-widget" className="fixed bottom-6 right-6 z-50 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 35, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="bg-white border border-gray-100 shadow-2xl rounded-2xl w-[92vw] sm:w-[380px] h-[550px] flex flex-col mb-4 overflow-hidden"
          >
            {/* Header section styled elegantly with brand identity */}
            <div className="bg-[#0D0D0D] text-white p-4 flex items-center justify-between border-b border-gray-900 select-none">
              <div className="flex items-center gap-2.5">
                {/* Glowing status avatar */}
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/25 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-[#FF6B00]" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0d0d0d] rounded-full animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xs font-black tracking-wide uppercase flex items-center gap-1 text-white">
                    Yourt AI Support
                  </h3>
                  <p className="text-[10px] text-gray-400 font-medium">Copilot is Active & Ready</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button 
                  onClick={clearChat}
                  title="Clear chat log"
                  className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all text-[10px] uppercase font-bold"
                >
                  Reset
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Conversation Log area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FAF9F9]">
              {messages.map((m) => (
                <div 
                  key={m.id}
                  className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"} items-end gap-1.5`}
                >
                  {m.sender !== "user" && (
                    <div className="w-6 h-6 shrink-0 rounded-full bg-[#FF6B00]/10 flex items-center justify-center text-[10px] font-black text-[#FF6B00] border border-[#ff6b00]/10">
                      Y
                    </div>
                  )}

                  <div className="max-w-[82%] space-y-1">
                    <div 
                      className={`rounded-2xl p-3.5 text-xs font-sans leading-relaxed shadow-3xs ${
                        m.sender === "user" 
                          ? "bg-[#0D0D0D] text-white rounded-br-none" 
                          : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
                      }`}
                    >
                      {/* Very simple markdown parser for bolding/italics */}
                      {m.text.split("\n").map((line, lineIdx) => (
                        <p key={lineIdx} className={lineIdx > 0 ? "mt-1.5" : ""}>
                          {line.split("**").map((chunk, chunkIdx) => {
                            if (chunkIdx % 2 === 1) {
                              return <strong key={chunkIdx} className="font-bold text-[#FF6B00]">{chunk}</strong>;
                            }
                            return chunk.split("*").map((italicChunk, italicIdx) => {
                              if (italicIdx % 2 === 1) {
                                return <em key={italicIdx} className="italic text-gray-900 font-semibold">{italicChunk}</em>;
                              }
                              return italicChunk;
                            });
                          })}
                        </p>
                      ))}
                    </div>
                    <span className="text-[8px] text-gray-400 font-mono tracking-wider block px-1 text-right">
                      {m.sender === "user" ? "You" : "Copilot"} • {m.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {/* Loader feedback */}
              {loading && (
                <div className="flex justify-start items-center gap-1.5">
                  <div className="w-6 h-6 shrink-0 rounded-full bg-[#FF6B00]/15 flex items-center justify-center text-[10px] font-black text-[#FF6B00]">
                    Y
                  </div>
                  <div className="bg-white border border-gray-100 rounded-2xl p-3 flex items-center gap-1.5 shadow-3xs">
                    <span className="w-1.5 h-1.5 bg-[#FF6B00] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-[#FF6B00] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-[#FF6B00] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Quick Starters Carousel */}
            {messages.length <= 2 && (
              <div className="border-t border-gray-100 bg-[#FAF9F9] p-2 flex gap-1.5 overflow-x-auto scrollbar-none select-none">
                {presetPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(p.text)}
                    className="shrink-0 bg-white hover:bg-[#fffcf7] border border-gray-250 hover:border-[#ff6b00]/30 text-gray-650 hover:text-[#ff6b00] rounded-lg px-2.5 py-1.5 text-[10px] font-bold transition-all duration-150 cursor-pointer shadow-3xs"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            )}

            {/* Form messaging inputs */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputText);
              }}
              className="p-3 border-t border-gray-100 bg-white grid grid-cols-12 gap-1.5 items-center select-none"
            >
              <input 
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask me to generate outlines, hook ideas..."
                className="col-span-10 text-xs border border-gray-250 hover:border-gray-300 focus:border-[#FF6B00] rounded-xl px-3 py-2.5 focus:outline-none transition-all placeholder-gray-400 text-gray-800"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || loading}
                className="col-span-2 bg-[#FF6B00] text-white rounded-xl h-9.5 flex items-center justify-center hover:bg-[#E55F00] transition-colors disabled:bg-gray-200 disabled:text-gray-400 cursor-pointer active:scale-95 duration-100"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Primary bubble toggle button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#0D0D0D] hover:bg-[#FF6B00] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-[#FF6B00]/25 transition-all duration-200 cursor-pointer group border border-white/5 relative z-50"
      >
        <span className="absolute -top-1 -right-0.5 bg-[#FF6B00] border-2 border-[#FAF9F9] text-white text-[8px] font-black w-5 h-5 rounded-full flex items-center justify-center animate-bounce shadow">
          Y
        </span>

        {isOpen ? (
          <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
        ) : (
          <MessageSquare className="w-5.5 h-5.5 group-hover:scale-110 transition-transform duration-200" />
        )}
      </motion.button>
    </div>
  );
}
