import { useState, useEffect, useRef } from 'react';
import { GoldDivider } from './BlossomDecor';

export default function VoucherSection() {
  const [copied, setCopied] = useState(false);
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

  const handleCopy = () => {
    navigator.clipboard.writeText('HUONGTET2027').then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <section ref={ref} className="relative py-24 md:py-36 px-8 md:px-16 overflow-hidden" style={{ background: '#5C1A24' }}>
      {/* Background pattern */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `radial-gradient(circle at 20% 50%, #BFA06A10 0%, transparent 50%), radial-gradient(circle at 80% 20%, #E8C4C010 0%, transparent 50%)`,
      }} />
      {/* Top gold line */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(to right, transparent, #BFA06A60, transparent)' }} />

      <div
        className="max-w-5xl mx-auto"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'none' : 'translateY(40px)',
          transition: 'opacity 0.9s ease, transform 0.9s ease',
        }}
      >
        {/* Header */}
        <div className="text-center mb-14">
          <p className="font-script text-xl mb-3" style={{ color: '#E8C4C0' }}>Ưu đãi đặc biệt</p>
          <h2 className="font-display text-3xl md:text-5xl font-semibold mb-4" style={{ color: '#FDF9F4' }}>
            Nhận voucher sau khi tạo thiệp
          </h2>
          <GoldDivider className="w-48 mx-auto" />
        </div>

        {/* Voucher card */}
        <div
          className="relative rounded-3xl overflow-hidden mx-auto max-w-2xl"
          style={{ border: '1px solid #BFA06A55', background: '#FAF6F0' }}
        >
          {/* Top decorative band */}
          <div className="h-2 w-full" style={{ background: 'linear-gradient(to right, #C9968A, #BFA06A, #C9968A)' }} />

          <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              {/* Left: discount */}
              <div className="flex-shrink-0 text-center">
                <div
                  className="w-28 h-28 rounded-full flex flex-col items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #5C1A24, #8B3042)', boxShadow: '0 8px 32px rgba(92, 26, 36, 0.3)' }}
                >
                  <span className="font-display text-3xl font-bold" style={{ color: '#BFA06A' }}>5%</span>
                  <span className="font-body text-xs" style={{ color: '#E8C4C0' }}>GIẢM GIÁ</span>
                </div>
              </div>

              {/* Dashed divider */}
              <div className="hidden md:block w-px h-32 border-l-2 border-dashed" style={{ borderColor: '#BFA06A44' }} />
              <div className="block md:hidden w-full h-px border-t-2 border-dashed" style={{ borderColor: '#BFA06A44' }} />

              {/* Right: voucher details */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-display text-xl font-semibold mb-2" style={{ color: '#5C1A24' }}>
                  Ưu đãi mừng Xuân Đinh Mùi
                </h3>
                <p className="font-body text-sm leading-relaxed mb-6" style={{ color: '#8C7070' }}>
                  Áp dụng cho đơn hàng đầu tiên tại hệ thống cửa hàng đối tác. Hạn sử dụng đến hết 28/01/2027.
                </p>

                {/* Code box */}
                <div
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: '#FDF9F4', border: '1.5px dashed #BFA06A66' }}
                >
                  <div className="flex-1 font-display text-xl font-bold tracking-widest text-center" style={{ color: '#5C1A24', letterSpacing: '0.2em' }}>
                    HUONGTET2027
                  </div>
                  <button
                    onClick={handleCopy}
                    className="flex-shrink-0 px-4 py-2 rounded-lg font-body text-xs transition-all duration-300"
                    style={{
                      background: copied ? '#5C1A24' : '#E8C4C0',
                      color: copied ? '#FAF6F0' : '#5C1A24',
                    }}
                  >
                    {copied ? '✓ Đã sao chép' : 'Sao chép'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom decorative band */}
          <div className="h-2 w-full" style={{ background: 'linear-gradient(to right, #C9968A, #BFA06A, #C9968A)' }} />

          {/* Punch-out circles */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full" style={{ background: '#5C1A24' }} />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-8 h-8 rounded-full" style={{ background: '#5C1A24' }} />
        </div>


      </div>
    </section>
  );
}
