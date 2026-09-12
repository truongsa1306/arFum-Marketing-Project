import { useEffect, useRef, useState } from 'react';
import { GoldDivider } from './BlossomDecor';

const steps = [
  {
    num: '1',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8">
        <rect x="8" y="8" width="32" height="32" rx="8" stroke="#BFA06A" strokeWidth="1.5" />
        <path d="M16 24h16M24 16v16" stroke="#C9968A" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: 'Quét mã QR',
    desc: 'Nhận mã QR từ chương trình và quét để bắt đầu hành trình tạo thiệp.',
  },
  {
    num: '2',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8">
        <circle cx="24" cy="18" r="8" stroke="#BFA06A" strokeWidth="1.5" />
        <path d="M10 38c0-6 6-10 14-10s14 4 14 10" stroke="#C9968A" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: 'Kể về người thân',
    desc: 'Trả lời vài câu hỏi ngắn để arFum hiểu về người bạn yêu thương và cảm xúc bạn muốn gửi gắm.',
  },
  {
    num: '3',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8">
        <rect x="10" y="12" width="28" height="24" rx="4" stroke="#BFA06A" strokeWidth="1.5" />
        <circle cx="20" cy="22" r="4" stroke="#C9968A" strokeWidth="1.5" />
        <path d="M10 32l8-6 6 4 6-6 8 8" stroke="#C9968A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Tải ảnh gia đình',
    desc: 'Tải lên một bức ảnh kỷ niệm để arFum tích hợp vào thiệp theo phong cách nghệ thuật.',
  },
  {
    num: '4',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-8 h-8">
        <path d="M24 8 L30 20 L42 22 L33 30 L35 42 L24 36 L13 42 L15 30 L6 22 L18 20 Z" stroke="#BFA06A" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="24" cy="24" r="4" fill="#BFA06A" opacity="0.4" />
      </svg>
    ),
    title: 'Nhận & chia sẻ thiệp',
    desc: 'Tải thiệp về hoặc chia sẻ trực tiếp. Nhận voucher đặc biệt từ thương hiệu.',
  },
];

export default function HowItWorks() {
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

  return (
    <section ref={ref} className="relative py-24 md:py-36 px-8 md:px-16 overflow-hidden" style={{ background: '#FAF6F0' }}>
      {/* Background arch shape */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, #E8C4C020 0%, transparent 70%)',
        }}
      />

      <div className="max-w-6xl mx-auto">
        <div
          className="text-center mb-16"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'none' : 'translateY(30px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
          }}
        >
          <p className="font-script text-xl mb-3" style={{ color: '#C9968A' }}>Hướng dẫn</p>
          <h2 className="font-display text-3xl md:text-5xl font-semibold mb-4" style={{ color: '#5C1A24' }}>
            Chỉ 4 bước đơn giản
          </h2>
          <GoldDivider className="w-48 mx-auto" />
        </div>

        {/* Steps — connected with a flowing line on desktop */}
        <div className="relative">
          {/* Connector line */}
          <div
            className="hidden md:block absolute top-16 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(to right, transparent, #BFA06A55, #BFA06A55, transparent)' }}
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6">
            {steps.map((step, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center gap-5"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'none' : 'translateY(40px)',
                  transition: `opacity 0.8s ease ${0.1 + i * 0.15}s, transform 0.8s ease ${0.1 + i * 0.15}s`,
                }}
              >
                {/* Icon circle */}
                <div
                  className="relative w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"
                  style={{ background: '#FDF9F4', border: '1.5px solid #BFA06A55' }}
                >
                  {step.icon}
                  <span
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center font-display text-xs font-bold"
                    style={{ background: '#5C1A24', color: '#FAF6F0' }}
                  >
                    {step.num}
                  </span>
                </div>
                <h3 className="font-display text-lg font-semibold" style={{ color: '#5C1A24' }}>{step.title}</h3>
                <p className="font-body text-sm leading-relaxed" style={{ color: '#8C7070' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
