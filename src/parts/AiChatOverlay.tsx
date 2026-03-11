import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext"; // Hämta inloggad användare


type AiChatOverlayProps = {
  onClose: () => void;
};

type ChatRole = "user" | "ai";

type ChatMessage = {
  role: ChatRole;
  text: string;
};

export default function AiChatOverlay({ onClose }: AiChatOverlayProps) {
  const { user } = useAuth(); // Inloggad användare

  // Avatarer
  const aiAvatar = "/images/logos/kino-chat.png"; // Kino / AI
  const userAvatar = user?.avatar || "/images/logos/avatarChatUser.png"; // DB-avatar eller fallback

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  async function sendToAI(message: string): Promise<string> {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          { role: "user", content: message }
        ]
      })
    });

    const data = await res.json();

    return (
      data?.choices?.[0]?.message?.content ||
      "Jag kunde inte generera ett svar just nu."
    );
  }

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: "user", text: input };
    setMessages(prev => [...prev, userMessage]);

    const userInput = input;
    setInput("");

    try {
      const aiReply = await sendToAI(userInput);

      const aiMessage: ChatMessage = { role: "ai", text: aiReply };
      setMessages(prev => [...prev, aiMessage]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: "ai", text: "Kunde inte kontakta AI:n just nu." }
      ]);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm bg-black/60 p-4">
      <div className="relative w-[90%] max-w-2xl bg-accent/90 rounded-3xl p-8 shadow-2xl border border-white/10 flex flex-col h-[80vh]">

        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 text-black text-4xl font-light hover:text-black/80 transition"
        >
          ×
        </button>

        <div className="flex items-center justify-center gap-3 mb-6">
          <img
            src="/images/logos/kino-chat.png"
            alt="AI"
            className="w-10 h-10 rounded-full border border-black/20"
          />
          <h2 className="text-black text-xl font-bold uppercase tracking-widest">
            AI-Support Kino
          </h2>
        </div>


        <div
          ref={chatRef}
          className="flex-1 overflow-y-auto pr-2 space-y-4 mb-6"
        >
          {messages.map((msg, i) => {
            const isUser = msg.role === "user";

            return (
              <div
                key={i}
                className={`flex items-start gap-3 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {/* AI avatar */}
                {!isUser && (
                  <img
                    src="/images/logos/kino-chat.png"
                    alt="AI"
                    className="w-10 h-10 rounded-full border border-black/20"
                  />
                )}

                {/* Bubble */}
                <div
                  className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${isUser
                    ? "bg-accent/90 text-black"
                    : "bg-white/10 text-black border border-white/10"
                    }`}
                >
                  {msg.text}
                </div>

                {/* User avatar */}
                {isUser && (
                  <img
                    src={userAvatar}
                    alt="User"
                    className="w-10 h-10 rounded-full border border-black/20"
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Skriv ett meddelande..."
            className="flex-1 rounded-xl bg-accent/90 border border-accent/10 px-4 py-3 text-black"
          />

          <button
            onClick={sendMessage}
            className="px-6 py-3 rounded-xl bg-red-600 text-white font-bold uppercase text-xs tracking-widest hover:bg-red-700 transition"
          >
            Skicka
          </button>
        </div>

      </div>
    </div>
  );
}
