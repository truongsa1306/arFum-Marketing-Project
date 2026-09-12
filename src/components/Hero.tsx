import { useEffect, useRef, useState } from 'react';
import { BlossomCluster, SmallBlossom, GoldDivider } from './BlossomDecor';
import heroCampaign from '@/imports/hero-campaign.png';

interface HeroProps {
  onStart: () => void;
}

export default function Hero({ onStart }: HeroProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section ref={ref} className="relative min-h-screen flex flex-col overflow-hidden" style={{ background: '#FAF6F0' }}>
      {/* Decorative blossoms */}
      <BlossomCluster className="absolute top-[-40px] left-[-40px] w-64 h-64 opacity-60 animate-float pointer-events-none" />
      <BlossomCluster className="absolute bottom-10 right-[-30px] w-56 h-56 opacity-50 animate-float pointer-events-none" style={{ animationDelay: '2s' } as React.CSSProperties} />
      <SmallBlossom className="absolute top-32 right-24 w-16 h-16 opacity-40 animate-float pointer-events-none" style={{ animationDelay: '1s' } as React.CSSProperties} />
      <SmallBlossom className="absolute bottom-32 left-20 w-12 h-12 opacity-35 animate-float pointer-events-none" style={{ animationDelay: '3s' } as React.CSSProperties} />

      {/* Gold corner ornaments */}
      <svg className="absolute top-6 left-6 w-20 h-20 pointer-events-none" viewBox="0 0 80 80" fill="none" aria-hidden="true">
        <path d="M8 8 L8 32 M8 8 L32 8" stroke="#BFA06A" strokeWidth="1" strokeOpacity="0.5" strokeLinecap="round" />
        <circle cx="8" cy="8" r="3" fill="#BFA06A" opacity="0.4" />
      </svg>
      <svg className="absolute top-6 right-6 w-20 h-20 pointer-events-none" viewBox="0 0 80 80" fill="none" aria-hidden="true">
        <path d="M72 8 L72 32 M72 8 L48 8" stroke="#BFA06A" strokeWidth="1" strokeOpacity="0.5" strokeLinecap="round" />
        <circle cx="72" cy="8" r="3" fill="#BFA06A" opacity="0.4" />
      </svg>

      {/* Nav / Logo */}
      <nav className="relative z-10 flex items-center px-8 md:px-16 pt-8 pb-4">
        <div className="flex items-center gap-3">
          <img src="/arfum-logo.png" alt="Arfum" className="w-12 h-12 object-contain" />
          <span className="font-display text-lg font-semibold tracking-wide" style={{ color: '#5C1A24' }}>ərFÜM</span>
        </div>
      </nav>

      {/* Main hero content */}
      <div className="relative z-10 flex-1 flex flex-col md:flex-row items-center gap-10 md:gap-0 px-8 md:px-16 py-12 md:py-0">
        {/* Left: Text */}
        <div
          className="flex-1 flex flex-col gap-6 md:gap-8 text-center md:text-left"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(40px)', transition: 'opacity 0.9s ease, transform 0.9s ease' }}
        >
          <p className="font-script text-lg md:text-xl" style={{ color: '#C9968A' }}>Xuân Đinh Mùi 2027</p>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-semibold leading-tight" style={{ color: '#5C1A24' }}>
            Thương nhau<br />
            <span >từ những điều</span><br />
            <span style={{ color: '#BFA06A' }}>
  "<span className="italic">thường</span>" nhất
</span>
          </h1>
          <GoldDivider className="w-64 md:w-80" />
          <p className="font-body text-base md:text-lg leading-relaxed max-w-md" style={{ color: '#5C5050' }}>
            Gửi yêu thương đến những người thân bằng một tấm thiệp Tết được tạo ra chỉ riêng cho họ — từ trái tim bạn, qua đôi tay.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center md:items-start">
            <button
              onClick={onStart}
              className="group flex items-center gap-3 px-8 py-4 rounded-full font-body text-base transition-all duration-300 hover:scale-105 hover:shadow-xl"
              style={{ background: '#5C1A24', color: '#FAF6F0', letterSpacing: '0.05em' }}
            >
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
              Tạo thiệp
            </button>
            <button
              className="flex items-center gap-2 font-body text-sm underline-offset-4 hover:underline transition-all"
              style={{ color: '#8C7070' }}
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              Xem mẫu thiệp
            </button>
          </div>
        </div>

        {/* Right: Oval hero image */}
        <div
          className="flex-1 flex justify-center md:justify-end items-center"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateX(40px)', transition: 'opacity 1.1s ease 0.3s, transform 1.1s ease 0.3s' }}
        >
          <div className="relative">
            {/* Oval image frame */}
            <div
              className="relative w-72 h-96 md:w-96 md:h-[520px] overflow-hidden shadow-2xl"
              style={{
                borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%',
                border: '2px solid #BFA06A44',
              }}
            >
              <img
                src={heroCampaign}
                alt="Thương nhau từ những điều thường nhất"
                className="w-full h-full object-cover"
                style={{ objectPosition: 'center 20%' }}
              />
              {/* Warm overlay */}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 50%, #5C1A2420 100%)' }} />
            </div>
            {/* Gold ring behind image */}
            <div
              className="absolute -inset-3 -z-10"
              style={{
                borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%',
                border: '1px solid #BFA06A',
                opacity: 0.3,
              }}
            />
            {/* Floating blossom badge */}
            <div
              className="absolute -bottom-4 -left-8 px-4 py-3 rounded-2xl shadow-lg"
              style={{ background: '#FDF9F4', border: '1px solid #BFA06A44' }}
            >
              <p className="font-script text-sm" style={{ color: '#C9968A' }}>Thiệp từ trái tim</p>
              <p className="font-display text-xs mt-0.5" style={{ color: '#5C1A24' }}>♡ Made with love</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="relative z-10 flex justify-center pb-8 md:pb-12">
        <div className="flex flex-col items-center gap-2">
          <p className="font-body text-xs tracking-widest uppercase" style={{ color: '#8C7070' }}>Khám phá</p>
          <div className="w-px h-12 relative overflow-hidden" style={{ background: '#E8C4C0' }}>
            <div className="absolute top-0 w-full bg-gradient-to-b from-transparent via-rose-300 to-transparent h-6" style={{ animation: 'float 2s ease-in-out infinite' }} />
          </div>
        </div>
      </div>
    </section>
  );
}
