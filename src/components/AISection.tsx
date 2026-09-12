import { useEffect, useRef, useState } from 'react';
import { GoldDivider, BlossomCluster } from './BlossomDecor';

export default function AISection() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: '🎨',
      title: 'Phong cách cá nhân',
      desc: 'AI phân tích câu trả lời và lựa chọn bố cục, màu sắc, font chữ phù hợp với cảm xúc bạn muốn gửi.',
    },
    {
      icon: '✍️',
      title: 'Nội dung từ trái tim',
      desc: 'Không phải những lời chúc khuôn mẫu. AI viết lời chúc riêng dựa trên kỷ niệm và cảm xúc bạn chia sẻ.',
    },
    {
      icon: '🖼️',
      title: 'Ảnh được nghệ thuật hóa',
      desc: 'Ảnh gia đình của bạn được tích hợp vào thiệp với hiệu ứng hội họa tinh tế — như một tác phẩm nghệ thuật.',
    },
    {
      icon: '🌸',
      title: 'Họa tiết truyền thống',
      desc: 'Hoa đào, lụa, vàng — những họa tiết Tết được vẽ tay được kết hợp một cách tinh tế vào thiệp của bạn.',
    },
  ];

  return (
    <section ref={ref} className="relative py-24 md:py-36 px-8 md:px-16 overflow-hidden" style={{ background: '#FDF9F4' }}>
      <BlossomCluster className="absolute -top-8 -right-8 w-80 h-80 opacity-20 pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Left: image composition */}
          <div
            className="relative"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'none' : 'translateX(-40px)',
              transition: 'opacity 1s ease, transform 1s ease',
            }}
          >
            {/* Main arch image */}
            <div
              className="relative overflow-hidden mx-auto md:mx-0"
              style={{
                width: '320px',
                height: '420px',
                borderRadius: '50% 50% 12px 12px / 55% 55% 12px 12px',
                border: '1.5px solid #BFA06A44',
                boxShadow: '0 24px 60px rgba(92, 26, 36, 0.15)',
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=640&h=840&fit=crop&auto=format"
                alt="Gia đình hạnh phúc ngày Tết"
                className="w-full h-full object-cover"
                style={{ filter: 'sepia(8%) saturate(95%)' }}
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 60%, #5C1A2430 100%)' }} />
            </div>

            {/* Floating card preview */}
            <div
              className="absolute -right-8 bottom-16 w-44 rounded-2xl overflow-hidden shadow-xl"
              style={{ border: '1px solid #BFA06A44' }}
            >
              <div className="relative h-56" style={{ background: 'linear-gradient(135deg, #FAF6F0 0%, #F0C8A8 100%)' }}>
                <img
                  src="https://images.unsplash.com/photo-1490750967868-88df5691cc36?w=200&h=280&fit=crop&auto=format"
                  alt="Thiệp mẫu"
                  className="w-full h-full object-cover"
                  style={{ filter: 'sepia(20%) saturate(80%)', opacity: 0.7, mixBlendMode: 'multiply' }}
                />
                <div className="absolute inset-0 p-3 flex flex-col justify-between">
                  <div className="flex justify-end">
                    <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                      <circle cx="16" cy="16" r="14" stroke="#BFA06A" strokeWidth="0.75" opacity="0.6" />
                      <path d="M16 6 L17.5 12 L24 12 L19 15.5 L21 22 L16 18.5 L11 22 L13 15.5 L8 12 L14.5 12 Z" fill="#BFA06A" opacity="0.5" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-script text-xs" style={{ color: '#5C1A24' }}>Chúc mừng năm mới</p>
                    <p className="font-display text-xs font-semibold mt-1" style={{ color: '#5C1A24' }}>Xuân Ất Tỵ 2025</p>
                  </div>
                </div>
              </div>
            </div>

            {/* AI badge */}
            <div
              className="absolute -left-4 top-12 flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg"
              style={{ background: '#5C1A24', color: '#FAF6F0' }}
            >
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#BFA06A' }} />
              <span className="font-body text-xs tracking-wide">AI đang tạo thiệp...</span>
            </div>
          </div>

          {/* Right: text + features */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'none' : 'translateX(40px)',
              transition: 'opacity 1s ease 0.2s, transform 1s ease 0.2s',
            }}
          >
            <p className="font-script text-xl mb-3" style={{ color: '#C9968A' }}>Công nghệ AI</p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold leading-snug mb-4" style={{ color: '#5C1A24' }}>
              Thiệp được tạo riêng
              <br />
              <span className="italic">cho người bạn yêu thương</span>
            </h2>
            <GoldDivider className="w-40 mb-8" />
            <p className="font-body text-base leading-relaxed mb-10" style={{ color: '#5C5050' }}>
              Không phải template cắt dán. Không phải lời chúc chung chung. Mỗi tấm thiệp là một tác phẩm được tạo ra từ câu chuyện của bạn và người thân — bằng trí tuệ nhân tạo và tình cảm con người.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="flex gap-4"
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'none' : 'translateY(20px)',
                    transition: `opacity 0.7s ease ${0.4 + i * 0.1}s, transform 0.7s ease ${0.4 + i * 0.1}s`,
                  }}
                >
                  <span className="text-2xl flex-shrink-0 mt-0.5">{f.icon}</span>
                  <div>
                    <h3 className="font-display text-sm font-semibold mb-1" style={{ color: '#5C1A24' }}>{f.title}</h3>
                    <p className="font-body text-xs leading-relaxed" style={{ color: '#8C7070' }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
