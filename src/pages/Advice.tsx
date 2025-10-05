import { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Advice() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Xin chào! 🌱 Tôi là trợ lý AI của BK Farmers. Tôi có thể tư vấn gì cho cây trồng của bạn hôm nay?'
    }
  ]);
  const [input, setInput] = useState('');

  const quickSuggestions = [
    '🌧️ Khi nào nên tưới nước?',
    '📈 Làm sao tăng năng suất?',
    '🐛 Phòng trừ sâu bệnh?',
    '🌾 Thời điểm bón phân?',
    '☀️ Chăm sóc theo mùa?'
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInput('');

    setTimeout(() => {
      let response = '';
      const lowerText = text.toLowerCase();

      if (lowerText.includes('tưới') || lowerText.includes('nước')) {
        response = 'Dựa vào dữ liệu hiện tại, độ ẩm đất của bạn đang ở mức 65% - khá tốt! 💧\n\nKhuyến nghị:\n- Tưới vào sáng sớm (5-7h) hoặc chiều mát (16-18h)\n- Tưới 2-3 lần/tuần tùy thời tiết\n- Kiểm tra độ ẩm đất trước khi tưới\n- Tránh tưới giữa trưa nắng gắt';
      } else if (lowerText.includes('năng suất') || lowerText.includes('tăng')) {
        response = '📈 Để tăng năng suất cây trồng, bạn nên:\n\n1. Duy trì nhiệt độ 18-25°C\n2. Độ ẩm không khí 60-80%\n3. Bón phân NPK đúng liều lượng\n4. pH đất duy trì 5.5-6.5\n5. Ánh sáng đầy đủ 6-8h/ngày\n6. Phòng trừ sâu bệnh định kỳ\n\nTheo dữ liệu của bạn, các chỉ số đều ở mức tốt! Tiếp tục duy trì nhé! 🌟';
      } else if (lowerText.includes('sâu') || lowerText.includes('bệnh')) {
        response = '�� Phòng trừ sâu bệnh hiệu quả:\n\n✅ Biện pháp sinh học:\n- Sử dụng thiên địch tự nhiên\n- Dầu neem, tỏi, ớt\n- Bẫy đèn bắt côn trùng\n\n⚠️ Khi cần thuốc BVTV:\n- Chọn thuốc sinh học an toàn\n- Phun đúng liều lượng, đúng thời điểm\n- Thời gian cách ly trước thu hoạch\n\n💡 Với môi trường tốt như hiện tại, cây của bạn đang khỏe mạnh, ít bị sâu bệnh!';
      } else if (lowerText.includes('phân') || lowerText.includes('bón')) {
        response = '🌾 Hướng dẫn bón phân:\n\nDựa vào dữ liệu:\n- N (Nitơ): 45 ppm - Tốt ✅\n- P (Phốt pho): 25 ppm - Tốt ✅  \n- K (Kali): 35 ppm - Tốt ✅\n\n📅 Lịch bón phân:\n- Giai đoạn sinh trưởng: NPK 16-16-8 mỗi 2 tuần\n- Giai đoạn ra hoa: Tăng P, K (NPK 10-20-20)\n- Giai đoạn kết trái: NPK 5-10-15\n\n💡 Hiện tại chỉ số dinh dưỡng của bạn rất tốt!';
      } else if (lowerText.includes('mùa') || lowerText.includes('thời tiết')) {
        response = '☀️ Chăm sóc theo mùa:\n\n🌸 Mùa xuân (2-4):\n- Tăng cường bón phân N\n- Tưới đều, không để khô\n\n☀️ Mùa hè (5-8):\n- Che bớt nắng, tạo bóng mát\n- Tưới nhiều hơn, sáng + chiều\n- Phòng sâu bệnh tích cực\n\n🍂 Mùa thu (9-11):\n- Chuẩn bị thu hoạch\n- Giảm dần phân đạm\n- Tăng phân lân, kali\n\n❄️ Mùa đông (12-1):\n- Bảo vệ cây khỏi rét\n- Giảm tưới, tránh úng\n\n📅 Hiện tại là tháng 10, sắp đến mùa thu hoạch! 🌾';
      } else {
        response = 'Cảm ơn câu hỏi của bạn! 🌱\n\nBạn có thể hỏi tôi về:\n- Hướng dẫn tưới nước\n- Cách tăng năng suất\n- Phòng trừ sâu bệnh\n- Lịch bón phân\n- Chăm sóc theo mùa\n\nHoặc bạn có thể mô tả vấn đề cụ thể về cây trồng, tôi sẽ tư vấn chi tiết hơn! 😊';
      }

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <div className="flex justify-center items-center mb-4">
          <Sparkles className="w-8 h-8 text-yellow-500 animate-pulse mr-3" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Tư vấn AI nông nghiệp
          </h1>
          <Sparkles className="w-8 h-8 text-yellow-500 animate-pulse ml-3" />
        </div>
        <p className="text-slate-600">
          Hỏi tôi bất cứ điều gì về cây trồng của bạn
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
        <div className="flex flex-wrap gap-2 mb-6">
          {quickSuggestions.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(suggestion)}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-emerald-50 to-teal-50
                         text-emerald-700 font-medium text-sm
                         hover:from-emerald-100 hover:to-teal-100
                         transition-all duration-300 transform hover:scale-105
                         border border-emerald-200"
            >
              {suggestion}
            </button>
          ))}
        </div>

        <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
          {messages.map((message, idx) => (
            <div
              key={idx}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                    : 'bg-gradient-to-r from-slate-50 to-gray-50 text-slate-800 border border-gray-200'
                }`}
              >
                <p className="whitespace-pre-line">{message.content}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
            placeholder="Nhập câu hỏi của bạn..."
            className="flex-1 px-6 py-4 rounded-full border-2 border-emerald-200
                       focus:border-emerald-500 focus:outline-none
                       text-slate-800 placeholder-slate-400"
          />
          <button
            onClick={() => handleSend(input)}
            className="px-6 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500
                       text-white font-semibold
                       hover:from-emerald-600 hover:to-teal-600
                       transition-all duration-300 transform hover:scale-105
                       shadow-lg hover:shadow-xl"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
