import { useState } from 'react';
import { Send, Sparkles, Volume2 } from 'lucide-react';

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

  const quickSuggestions = [
    '🌧️ Khi nào nên tưới nước?',
    '📈 Làm sao tăng năng suất?',
    '🐛 Phòng trừ sâu bệnh?',
    '🌾 Thời điểm bón phân?',
    '☀️ Chăm sóc theo mùa?',
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setInput('');

    setTimeout(() => {
      let response = '';
      const lower = text.toLowerCase();

      if (lower.includes('tưới') || lower.includes('nước')) {
        response =
          '**💧 Khuyến nghị tưới nước:**\n\n' +
          '• Độ ẩm đất hiện tại ~65% – khá tốt!\n' +
          '• Tưới vào sáng sớm (5–7h) hoặc chiều mát (16–18h)\n' +
          '• 2–3 lần/tuần tuỳ thời tiết\n' +
          '• Tránh tưới giữa trưa nắng gắt';
      } else if (lower.includes('năng suất')) {
        response =
          '**📈 Tăng năng suất:**\n\n' +
          '1️⃣ Duy trì nhiệt độ 18–25°C\n' +
          '2️⃣ Độ ẩm KK 60–80%\n' +
          '3️⃣ Bón NPK đúng liều\n' +
          '4️⃣ pH đất 5.5–6.5\n' +
          '5️⃣ Ánh sáng đủ 6–8h/ngày\n' +
          '👉 Các chỉ số hiện tại của bạn đều tốt, cứ tiếp tục nhé 🌟';
      } else if (lower.includes('sâu') || lower.includes('bệnh')) {
        response =
          '**🐛 Phòng trừ sâu bệnh:**\n\n' +
          '✅ Biện pháp sinh học: dầu neem, tỏi, ớt, bẫy đèn\n' +
          '⚠️ Thuốc BVTV: chọn loại sinh học, phun đúng liều, đúng lúc\n' +
          '💡 Hiện tại môi trường cây của bạn đang khỏe mạnh!';
      } else if (lower.includes('phân') || lower.includes('bón')) {
        response =
          '**🌾 Hướng dẫn bón phân:**\n\n' +
          '• N: 45 ppm ✅  P: 25 ppm ✅  K: 35 ppm ✅\n' +
          '📅 Lịch:\n' +
          '- Sinh trưởng: NPK 16-16-8 (2 tuần/lần)\n' +
          '- Ra hoa: NPK 10-20-20\n' +
          '- Kết trái: NPK 5-10-15';
      } else if (lower.includes('mùa') || lower.includes('thời tiết')) {
        response =
          '**☀️ Chăm sóc theo mùa:**\n\n' +
          '🌸 Xuân: tăng N, tưới đều\n' +
          '☀️ Hè: che nắng, tưới sáng + chiều\n' +
          '🍂 Thu: giảm đạm, tăng lân/kali\n' +
          '❄️ Đông: giảm tưới, tránh úng\n' +
          '📅 Tháng 10 – sắp mùa thu hoạch!';
      } else {
        response =
          '**🌱 Bạn có thể hỏi tôi về:**\n' +
          '• Cách tưới nước\n' +
          '• Tăng năng suất\n' +
          '• Phòng sâu bệnh\n' +
          '• Bón phân, lịch chăm sóc\n\n' +
          '💬 Hãy mô tả cụ thể vấn đề của cây trồng nhé!';
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
    }, 800);
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
            className="flex-1 px-6 py-4 rounded-full border-2 border-emerald-200
                       focus:border-emerald-500 focus:outline-none
                       text-slate-800 placeholder-slate-400"
          />
          <button
            onClick={() => handleSend(input)}
            className="px-6 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500
                       text-white font-semibold hover:from-emerald-600 hover:to-teal-600
                       transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
