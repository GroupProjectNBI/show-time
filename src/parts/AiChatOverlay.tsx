import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Markdown from 'marked-react';
import { Volume2, PlayCircle, Mic, Square } from "lucide-react"; // Lade till Square för Stopp-knappen!

type AiChatOverlayProps = {
  onClose: () => void;
};

type ChatRole = "user" | "ai";

type ChatMessage = {
  role: ChatRole;
  text: string;
};

export default function AiChatOverlay({ onClose }: AiChatOverlayProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userAvatar = user?.avatar || "/images/logos/avatarChatUser.png";

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);

  // --- LJUDFUNKTIONALITET ---
  const [volume, setVolume] = useState<number>(0.8);
  const [isSpeaking, setIsSpeaking] = useState(false); // Nytt state för att hålla koll på om den pratar!

  // --- MICK-FUNKTIONALITET ---
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = "sv-SE";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        sendMessage(transcript); // Skicka direkt när man pratat klart!
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error("Mick-fel:", event.error);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
      } else {
        alert("Din webbläsare stödjer tyvärr inte röstinmatning.");
      }
    }
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // --- NY STOPP-FUNKTION ---
  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  // --- UPPDATERAD UPPLÄSNING ---
  const speakText = (textToRead: string) => {
    window.speechSynthesis.cancel();
    setIsSpeaking(true);

    const cleanText = textToRead
      .replace(/([*_~`])/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '') // Klipper bort Markdown-länkar helt!
      .replace(/boka biljetter här/gi, '') // Tar specifikt bort denna fras (case insensitive)
      .replace(/klicka här/gi, '') // Tar bort "klicka här"
      .replace(/#/g, '')
      .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '');

    const sentences = cleanText.match(/[^.!?]+[.!?]*\s*/g) || [cleanText];
    let completedSentences = 0;

    sentences.forEach((sentence) => {
      if (sentence.trim() === "") {
        completedSentences++;
        if (completedSentences === sentences.length) setIsSpeaking(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(sentence.trim());
      utterance.lang = "sv-SE";
      utterance.volume = volume;
      utterance.rate = 0.95;

      // När en mening är klar, kolla om det var den sista
      utterance.onend = () => {
        completedSentences++;
        if (completedSentences === sentences.length) {
          setIsSpeaking(false); // Återställ UI:t när den pratat klart
        }
      };

      // Om något går fel med uppläsningen
      utterance.onerror = () => {
        completedSentences++;
        if (completedSentences === sentences.length) setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    });
  };

  async function sendToAI(message: string): Promise<string> {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: message }]
      })
    });

    const data = await res.json();
    return (
      data?.choices?.[0]?.message?.content ||
      "Jag kunde inte generera ett svar just nu."
    );
  }

  const sendMessage = async (overrideText?: string) => {
    const textToUse = typeof overrideText === "string" ? overrideText : input;
    if (!textToUse.trim()) return;

    const userMessage: ChatMessage = { role: "user", text: textToUse };
    setMessages(prev => [...prev, userMessage]);

    if (typeof overrideText !== "string") {
      setInput("");
    }

    try {
      const aiReply = await sendToAI(textToUse);
      const aiMessage: ChatMessage = { role: "ai", text: aiReply };
      setMessages(prev => [...prev, aiMessage]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: "ai", text: "Kunde inte kontakta AI:n just nu." }
      ]);
    }
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'A') {
      e.preventDefault();
      const href = target.getAttribute('href');
      if (href) {
        if (href.startsWith('/')) {
          navigate(href);
          onClose();
        } else {
          window.open(href, '_blank');
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur/20 bg-black/60 p-4">
      <div className="relative w-[90%] max-w-2xl bg-accent/90 rounded-3xl p-8 shadow-2xl border border-white/10 flex flex-col h-[80vh]">

        <button
          type="button"
          onClick={() => {
            stopSpeaking(); // Använd den nya stop-funktionen när man stänger!
            onClose();
          }}
          className="absolute top-6 right-6 text-black text-4xl font-light hover:text-black/80 transition"
        >
          ×
        </button>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <img
              src="/images/logos/kino-chat.png"
              alt="AI"
              className="w-10 h-10 rounded-full border border-black/20"
            />
            <h2 className="text-black text-xl font-bold uppercase tracking-widest">
              AI-Support Kino
            </h2>
          </div>

          <div className="flex items-center gap-3 mr-8 sm:mr-12">
            {/* NY STOPP-KNAPP SOM BARA SYNS NÄR DEN PRATAR */}
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="flex items-center gap-1.5 bg-red-100 text-red-600 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-red-200 transition-colors"
              >
                <Square size={14} fill="currentColor" />
                Stopp
              </button>
            )}

            <div className="flex items-center gap-2 bg-black/5 px-3 py-1.5 rounded-full">
              <Volume2 size={16} className="text-black/60" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-20 accent-primary cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div ref={chatRef} onClick={handleLinkClick} className="flex-1 overflow-y-auto pr-2 space-y-4 mb-6">
          {messages.map((msg, i) => {
            const isUser = msg.role === "user";

            return (
              <div key={i} className={`flex items-start gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
                {!isUser && (
                  <img src="/images/logos/kino-chat.png" alt="AI" className="w-10 h-10 rounded-full border border-black/20 shrink-0 mt-1" />
                )}

                <div className="flex flex-col gap-1 max-w-[75%]">
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${isUser ? "bg-black/80 text-white rounded-br-none" : "bg-white text-black border border-black/10 rounded-bl-none prose prose-sm prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-li:my-0 max-w-none shadow-sm"}`}>
                    {isUser ? msg.text : <Markdown>{msg.text}</Markdown>}
                  </div>

                  {!isUser && (
                    <button
                      onClick={() => speakText(msg.text)}
                      disabled={isSpeaking} // Gråa ut Lyssna-knappen om den redan pratar
                      className={`flex items-center gap-1.5 self-start text-xs font-bold uppercase tracking-wider mt-1 ml-2 transition-colors ${isSpeaking ? "text-black/20 cursor-not-allowed" : "text-black/40 hover:text-primary"}`}
                    >
                      <PlayCircle size={14} /> Lyssna
                    </button>
                  )}
                </div>

                {isUser && (
                  <img src={userAvatar} alt="User" className="w-10 h-10 rounded-full border border-black/20 shrink-0 mt-1 bg-white" />
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-3 flex-wrap relative">
          <div className="relative flex-1">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder={isListening ? "Lyssnar... Prata nu!" : "Fråga om filmer, tider eller salonger..."}
              className={`w-full rounded-xl bg-white/80 border px-4 py-3 pr-12 text-black placeholder:text-black/60 focus:outline-none focus:ring-2 focus:ring-primary shadow-inner transition-colors ${isListening ? "border-red-400 bg-red-50/80" : "border-black/10"
                }`}
            />

            <button
              onClick={toggleListening}
              className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-all ${isListening ? "text-red-600 bg-red-100 animate-pulse" : "text-black/40 hover:text-primary hover:bg-black/5"
                }`}
              title="Prata istället för att skriva"
            >
              <Mic size={20} />
            </button>
          </div>

          <button
            onClick={() => sendMessage()}
            className="px-6 py-3 rounded-xl bg-primary text-accent font-bold uppercase text-xs tracking-widest hover:brightness-110 active:scale-95 transition-all w-full sm:w-auto shadow-md"
          >
            Skicka
          </button>
        </div>

      </div>
    </div>
  );
}