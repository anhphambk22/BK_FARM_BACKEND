import { useState } from 'react';
import { Send, Sparkles, Volume2 } from 'lucide-react';
import { chat } from '../services/api';

// Cấu trúc tin nhắn
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Hàm đọc giọng nói tiếng Việt
const speakText = (text: string) => {
  if (!('speechSynthesis' in window)) return;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'vi-VN';
  utter.rate = 1.0;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
};

export default function Advice() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        '**Xin chào! 🌱 Tôi là trợ lý AI của BK Farmers.**\n\n👉 Bạn có thể hỏi tôi: **“Khi nào nên tưới nước?”**, **“Làm sao tăng năng suất?”**, **“Phòng trừ sâu bệnh?”** hoặc bất cứ điều gì về cây trồng của bạn!'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const quickSuggestions = [
    '🌧️ Khi nào nên tưới nước?',
    '📈 Làm sao tăng năng suất?',
    '🐛 Phòng trừ sâu bệnh?',
    '🌾 Thời điểm bón phân?',
    '☀️ Chăm sóc theo mùa?',
  ];

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: text };
    const historyForApi = [...messages, userMessage];

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const data = await chat(historyForApi);
      const reply = data?.reply?.trim() || 'Xin lỗi, tôi chưa có câu trả lời phù hợp lúc này.';
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Lỗi không xác định.';
      setMessages((prev) => [...prev, { role: 'assistant', content: `⚠️ ${msg}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* === Tiêu đề === */}
      <div className="text-center mb-8">
        <div className="flex justify-center items-center mb-4">
          <Sparkles className="w-8 h-8 text-yellow-500 animate-pulse mr-3" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Tư vấn AI nông nghiệp
          </h1>
          <Sparkles className="w-8 h-8 text-yellow-500 animate-pulse ml-3" />
        </div>
        <p className="text-slate-600 font-semibold">
          <strong>Hỏi tôi bất cứ điều gì</strong> về cây trồng của bạn 🌾
        </p>
      </div>

      {/* === Gợi ý nhanh === */}
      <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {quickSuggestions.map((sug, i) => (
            <button
              key={i}
              onClick={() => handleSend(sug)}
              className="px-4 py-2 rounded-full font-semibold text-emerald-700 bg-gradient-to-r 
                         from-emerald-50 to-teal-50 border border-emerald-200 
                         hover:from-emerald-100 hover:to-teal-100 transition-all"
            >
              {sug}
            </button>
          ))}
        </div>

        {/* === Khung hội thoại === */}
        <div className="space-y-4 mb-6 max-h-[60vh] overflow-y-auto pr-2">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start ${
                msg.role === 'assistant' ? 'justify-start' : 'justify-end'
              }`}
            >
              {/* Avatar lớn cho AI */}
              {msg.role === 'assistant' && (
                <div className="w-16 h-16 rounded-full bg-emerald-100 mr-3 flex items-center justify-center text-3xl">
                  🤖
                </div>
              )}
              <div
                className={`p-4 rounded-2xl max-w-[80%] leading-relaxed whitespace-pre-line ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                    : 'bg-slate-50 border border-slate-200 text-slate-800'
                }`}
              >
                <p
                  className="font-medium"
                  dangerouslySetInnerHTML={{
                    __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
                  }}
                ></p>
              </div>

              {/* Nút đọc chữ (TTS) chỉ cho assistant */}
              {msg.role === 'assistant' && (
                <button
                  onClick={() => speakText(msg.content.replace(/\*\*/g, ''))}
                  className="ml-2 p-2 rounded-full hover:bg-emerald-50 transition"
                  title="Đọc to"
                >
                  <Volume2 className="w-5 h-5 text-emerald-600" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* === Ô nhập tin nhắn === */}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
            placeholder="Nhập câu hỏi của bạn..."
            disabled={isLoading}
            className="flex-1 px-6 py-4 rounded-full border-2 border-emerald-200
                       focus:border-emerald-500 focus:outline-none
                       text-slate-800 placeholder-slate-400 disabled:opacity-60"
          />
          <button
            onClick={() => handleSend(input)}
            disabled={isLoading}
            className="px-6 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500
                       text-white font-semibold hover:from-emerald-600 hover:to-teal-600
                       transition-all duration-300 transform hover:scale-105 shadow-lg
                       disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        {isLoading && (
          <div className="text-center text-sm text-slate-500 mt-2">Đang trả lời…</div>
        )}
      </div>
    </div>
  );
}
