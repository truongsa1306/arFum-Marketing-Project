import { useState, useEffect, useRef } from 'react';
import { GoldDivider, SmallBlossom } from './BlossomDecor';

const cards = [
  {
    id: 1,
    title: 'Hoa Đào Mùa Xuân',
    style: 'Tinh tế • Trữ tình',
    bg: 'linear-gradient(135deg, #FDF9F4 0%, #F0C8A8 100%)',
    accent: '#C9968A',
    image: 'https://images.unsplash.com/photo-1578307992055-b49fa7ec4a52?w=400&h=560&fit=crop&auto=format',
    tag: 'Phổ biến nhất',
  },
  {
    id: 2,
    title: 'Nét Thư Pháp',
    style: 'Cổ điển • Sang trọng',
    bg: 'linear-gradient(135deg, #5C1A24 0%, #8B3042 100%)',
    accent: '#BFA06A',
    image: 'https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=400&h=560&fit=crop&auto=format',
    tag: 'Cao cấp',
  },
  {
    id: 3,
    title: 'Ký Ức Gia Đình',
    style: 'Ấm áp • Gần gũi',
    bg: 'linear-gradient(135deg, #E8C4C0 0%, #C9968A 100%)',
    accent: '#5C1A24',
    image: 'https://images.unsplash.com/photo-1602578689782-d8bef55a61ec?w=400&h=560&fit=crop&auto=format',
    tag: 'Cảm xúc nhất',
  },
  {
    id: 4,
    title: 'Vàng Son Phồn Thịnh',
    style: 'Xa hoa • Đẳng cấp',
    bg: 'linear-gradient(135deg, #2D1818 0%, #5C1A24 100%)',
    accent: '#BFA06A',
    image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&h=560&fit=crop&auto=format',
    tag: 'Mới',
  },
  {
    id: 5,
    title: 'Cánh Bướm Xuân',
    style: 'Nhẹ nhàng • Tươi mới',
    bg: 'linear-gradient(135deg, #FDF9F4 0%, #E8C4C0 100%)',
    accent: '#C9968A',
    image: 'https://images.unsplash.com/photo-1490750967868-88df5691cc36?w=400&h=560&fit=crop&auto=format',
    tag: '',
  },
  {
    id: 6,
    title: 'Đêm Giao Thừa',
    style: 'Huyền ảo • Đặc biệt',
    bg: 'linear-gradient(135deg, #1A0D10 0%, #3D1320 100%)',
    accent: '#BFA06A',
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400&h=560&fit=crop&auto=format',
    tag: 'Giới hạn',
  },
];

export default function CardShowcase() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative py-24 md:py-36 px-8 md:px-16 overflow-hidden" style={{ background: '#FAF6F0' }}>
      <SmallBlossom className="absolute top-12 right-12 w-20 h-20 opacity-30 animate-float pointer-events-none" />
      <SmallBlossom className="absolute bottom-12 left-12 w-16 h-16 opacity-25 animate-float pointer-events-none" style={{ animationDelay: '2.5s' } as React.CSSProperties} />

      <div className="max-w-7xl mx-auto">
        <div
          className="text-center mb-16"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'none' : 'translateY(30px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
          }}
        >
          <p className="font-script text-xl mb-3" style={{ color: '#C9968A' }}>Bộ sưu tập</p>
          <h2 className="font-display text-3xl md:text-5xl font-semibold mb-4" style={{ color: '#5C1A24' }}>
            Những mẫu thiệp được yêu thích
          </h2>
          <GoldDivider className="w-48 mx-auto" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {cards.map((card, i) => (
            <div
              key={card.id}
              onMouseEnter={() => setHovered(card.id)}
              onMouseLeave={() => setHovered(null)}
              className="group cursor-pointer"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'none' : 'translateY(50px)',
                transition: `opacity 0.8s ease ${0.05 * i}s, transform 0.8s ease ${0.05 * i}s`,
              }}
            >
              {/* Card visual */}
              <div
                className="relative overflow-hidden shadow-lg mb-4 transition-all duration-500"
                style={{
                  borderRadius: '16px 16px 8px 8px',
                  transform: hovered === card.id ? 'translateY(-8px) scale(1.02)' : 'none',
                  boxShadow: hovered === card.id
                    ? '0 24px 48px rgba(92, 26, 36, 0.2)'
                    : '0 4px 20px rgba(92, 26, 36, 0.08)',
                }}
              >
                {/* Arch top */}
                <div
                  className="absolute top-0 left-0 right-0 h-8 z-10"
                  style={{
                    background: card.bg,
                    borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
                  }}
                />

                {/* Image */}
                <div className="relative h-64 md:h-80 overflow-hidden" style={{ background: card.bg }}>
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover transition-transform duration-700"
                    style={{
                      filter: 'sepia(15%) saturate(80%)',
                      transform: hovered === card.id ? 'scale(1.08)' : 'scale(1)',
                      mixBlendMode: 'multiply',
                    }}
                  />
                  <div className="absolute inset-0" style={{ background: card.bg, opacity: 0.4, mixBlendMode: 'multiply' }} />

                  {/* Tag badge */}
                  {card.tag && (
                    <div
                      className="absolute top-4 left-4 px-3 py-1 rounded-full font-body text-xs"
                      style={{ background: card.accent, color: '#FAF6F0', letterSpacing: '0.05em' }}
                    >
                      {card.tag}
                    </div>
                  )}

                  {/* Gold ornament overlay */}
                  <svg className="absolute bottom-4 right-4 w-12 h-12 opacity-50" viewBox="0 0 48 48" fill="none" aria-hidden="true">
                    <circle cx="24" cy="24" r="20" stroke="#BFA06A" strokeWidth="0.75" />
                    <path d="M24 8 L26 20 L38 20 L29 27 L32 39 L24 32 L16 39 L19 27 L10 20 L22 20 Z" fill="#BFA06A" opacity="0.4" />
                  </svg>
                </div>

                {/* Hover overlay */}
                <div
                  className="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
                  style={{ opacity: hovered === card.id ? 1 : 0, background: 'rgba(92, 26, 36, 0.6)' }}
                >
                  <button className="px-6 py-2.5 rounded-full font-body text-sm font-medium" style={{ background: '#FAF6F0', color: '#5C1A24' }}>
                    Dùng mẫu này
                  </button>
                </div>
              </div>

              {/* Card info */}
              <div className="px-1">
                <h3 className="font-display text-base font-semibold mb-1" style={{ color: '#5C1A24' }}>{card.title}</h3>
                <p className="font-body text-xs" style={{ color: '#8C7070' }}>{card.style}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
