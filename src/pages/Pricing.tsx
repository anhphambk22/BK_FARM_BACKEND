import { Check, Zap, Crown, Rocket } from 'lucide-react';

interface PricingCardProps {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  icon: React.ComponentType<{ className?: string }>;
  cta: string;
}

const PricingCard = ({ name, price, period, description, features, highlighted, icon: Icon, cta }: PricingCardProps) => {
  return (
    <div className={`relative rounded-3xl p-8 transition-all duration-500 transform hover:scale-105 ${
      highlighted
        ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-2xl scale-105'
        : 'bg-white shadow-xl hover:shadow-2xl border border-gray-100'
    }`}>
      {highlighted && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-orange-400 to-red-400 text-white text-sm font-bold py-2 px-6 rounded-full shadow-lg">
            PHỔ BIẾN NHẤT
          </span>
        </div>
      )}

      <div className="text-center mb-6">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${
          highlighted
            ? 'bg-white/20 backdrop-blur-sm'
            : 'bg-gradient-to-br from-emerald-100 to-teal-100'
        }`}>
          <Icon className={`w-8 h-8 ${highlighted ? 'text-white' : 'text-emerald-600'}`} />
        </div>
        <h3 className={`text-2xl font-bold mb-2 ${highlighted ? 'text-white' : 'text-gray-900'}`}>
          {name}
        </h3>
        <p className={`text-sm ${highlighted ? 'text-purple-100' : 'text-gray-600'}`}>
          {description}
        </p>
      </div>

      <div className="text-center mb-8">
        <div className="flex items-baseline justify-center">
          <span className={`text-5xl font-black ${highlighted ? 'text-white' : 'text-gray-900'}`}>
            {price}
          </span>
          {period && (
            <span className={`ml-2 ${highlighted ? 'text-purple-100' : 'text-gray-600'}`}>
              {period}
            </span>
          )}
        </div>
      </div>

      <ul className="space-y-4 mb-8">
        {features.map((feature, idx) => (
          <li key={idx} className={`flex items-start ${highlighted ? 'text-purple-100' : 'text-gray-600'}`}>
            <Check className={`w-5 h-5 mr-3 flex-shrink-0 mt-0.5 ${
              highlighted ? 'text-green-300' : 'text-emerald-500'
            }`} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <button className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg ${
        highlighted
          ? 'bg-white text-purple-600 hover:bg-gray-100'
          : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600'
      }`}>
        {cta}
      </button>
    </div>
  );
};

export default function Pricing() {
  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-5xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
          Chọn gói phù hợp với bạn
        </h1>
        <p className="text-xl text-slate-600 mb-2">
          Bắt đầu miễn phí, nâng cấp khi cần thiết
        </p>
        <p className="text-sm text-slate-500">
          Hoàn tiền 100% trong 30 ngày nếu không hài lòng
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        <PricingCard
          name="Khởi đầu"
          price="Miễn phí"
          period=""
          description="Phù hợp cho nông dân cá nhân"
          icon={Zap}
          features={[
            '3 cảm biến IoT',
            'Lịch sử dữ liệu 7 ngày',
            'Cảnh báo cơ bản',
            'Tư vấn AI cơ bản',
            'Hỗ trợ cộng đồng',
            'Ứng dụng di động'
          ]}
          cta="Bắt đầu miễn phí"
        />

        <PricingCard
          name="Chuyên nghiệp"
          price="299,000₫"
          period="/tháng"
          description="Cho trang trại nhỏ & vừa"
          icon={Crown}
          highlighted
          features={[
            'Không giới hạn cảm biến',
            'Lịch sử dữ liệu 1 năm',
            'Tư vấn AI nâng cao',
            'Cảnh báo tùy chỉnh',
            'Xuất báo cáo PDF/Excel',
            'Hỗ trợ qua điện thoại',
            'Phân tích xu hướng',
            'Dự đoán thời tiết'
          ]}
          cta="Dùng thử Pro 14 ngày"
        />

        <PricingCard
          name="Doanh nghiệp"
          price="Liên hệ"
          period=""
          description="Cho hợp tác xã & công ty"
          icon={Rocket}
          features={[
            'Tất cả tính năng Pro',
            'Quản lý nhiều trang trại',
            'White-label branding',
            'API tích hợp',
            'Quản lý nhóm',
            'Chuyên gia tư vấn riêng',
            'SLA đảm bảo 99.9%',
            'Đào tạo on-site'
          ]}
          cta="Đặt lịch tư vấn"
        />
      </div>

      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8 max-w-4xl mx-auto border border-emerald-200">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">
            Tại sao chọn BK Farmers?
          </h2>
          <p className="text-slate-600">
            Giải pháp IoT nông nghiệp hàng đầu Việt Nam
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
            <div className="text-4xl mb-3">📈</div>
            <div className="text-3xl font-black text-emerald-600 mb-2">40%</div>
            <div className="text-sm text-slate-600">Tăng năng suất trung bình</div>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
            <div className="text-4xl mb-3">💰</div>
            <div className="text-3xl font-black text-blue-600 mb-2">60%</div>
            <div className="text-sm text-slate-600">Tiết kiệm chi phí vận hành</div>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
            <div className="text-4xl mb-3">🌾</div>
            <div className="text-3xl font-black text-orange-600 mb-2">2000+</div>
            <div className="text-sm text-slate-600">Nông dân tin tưởng</div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-white rounded-3xl p-8 max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold mb-4">Câu hỏi thường gặp</h2>
        </div>
        <div className="space-y-4">
          <details className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <summary className="font-semibold cursor-pointer">
              Tôi có thể nâng cấp hoặc hạ cấp gói bất cứ lúc nào không?
            </summary>
            <p className="mt-2 text-white/80">
              Có, bạn có thể thay đổi gói đăng ký bất cứ lúc nào. Phần chênh lệch sẽ được tính theo tỷ lệ.
            </p>
          </details>
          <details className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <summary className="font-semibold cursor-pointer">
              Gói miễn phí có giới hạn thời gian không?
            </summary>
            <p className="mt-2 text-white/80">
              Không, gói miễn phí không có giới hạn thời gian. Bạn có thể sử dụng mãi mãi với 3 cảm biến.
            </p>
          </details>
          <details className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <summary className="font-semibold cursor-pointer">
              Chính sách hoàn tiền như thế nào?
            </summary>
            <p className="mt-2 text-white/80">
              Chúng tôi hoàn tiền 100% trong 30 ngày đầu tiên nếu bạn không hài lòng, không cần giải thích lý do.
            </p>
          </details>
          <details className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <summary className="font-semibold cursor-pointer">
              Tôi cần bao nhiêu cảm biến cho trang trại 2 hecta?
            </summary>
            <p className="mt-2 text-white/80">
              Khuyến nghị 6-8 cảm biến cho 2 hecta để giám sát toàn diện. Gói Pro phù hợp cho nhu cầu này.
            </p>
          </details>
        </div>
      </div>

      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full border border-green-300">
          <Check className="w-5 h-5 text-green-600" />
          <span className="text-green-800 font-semibold">Chứng nhận VietGAP</span>
          <span className="mx-2 text-green-400">•</span>
          <Check className="w-5 h-5 text-green-600" />
          <span className="text-green-800 font-semibold">ISO 27001</span>
          <span className="mx-2 text-green-400">•</span>
          <Check className="w-5 h-5 text-green-600" />
          <span className="text-green-800 font-semibold">Bảo mật ngân hàng</span>
        </div>
      </div>
    </div>
  );
}
