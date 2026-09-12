import { useEffect, useRef, useState } from 'react';
import { BlossomCluster, GoldDivider } from './BlossomDecor';

interface FinalCTAProps {
  onStart: () => void;
}

export default function FinalCTA({ onStart }: FinalCTAProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative py-24 md:py-40 px-8 md:px-16 overflow-hidden text-center" style={{ background: '#FAF6F0' }}>
      <BlossomCluster className="absolute left-1/2 -translate-x-1/2 -top-16 w-96 h-96 opacity-20 pointer-events-none" />

      {/* Gold arch frame */}
      <div
        className="absolute inset-8 md:inset-16 pointer-events-none"
        style={{
          border: '1px solid #BFA06A33',
          borderRadius: '48% 48% 12px 12px / 30% 30% 12px 12px',
        }}
      />

      <div
        className="relative max-w-3xl mx-auto"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'none' : 'translateY(40px)',
          transition: 'opacity 0.9s ease, transform 0.9s ease',
        }}
      >
        <p className="font-script text-2xl md:text-3xl mb-4" style={{ color: '#C9968A' }}>Bắt đầu ngay hôm nay</p>
        <GoldDivider className="w-40 mx-auto mb-8" />
        <h2 className="font-display text-3xl md:text-5xl font-semibold leading-tight mb-6" style={{ color: '#5C1A24' }}>
          Một tấm thiệp, một mùa xuân trọn vẹn và ấm áp
        </h2>
        <p className="font-body text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-12" style={{ color: '#5C5050' }}>
          Khi Tết dần lắng lại trong lòng, arFÜM lưu giữ hương yêu thương và những khoảnh khắc ta dành sự quan tâm cho nhau.
        </p>

        <div className="flex justify-center">
          <button
            onClick={onStart}
            className="group flex items-center gap-3 px-10 py-4 rounded-full font-body text-base transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            style={{ background: '#5C1A24', color: '#FAF6F0', letterSpacing: '0.05em' }}
          >
            Tạo thiệp
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 16 16" fill="currentColor">
              <path fillRule="evenodd" d="M1 8a.5.5 0 01.5-.5h11.793l-3.147-3.146a.5.5 0 01.708-.708l4 4a.5.5 0 010 .708l-4 4a.5.5 0 01-.708-.708L13.293 8.5H1.5A.5.5 0 011 8z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
