import { useState, useEffect, useRef } from 'react';
import { GoldDivider } from './BlossomDecor';
import type { PreAnswers } from '../App';

const recipients = [
  
  { icon: '👨', label: 'Ba' },
  { icon: '👩', label: 'Mẹ' },
  { icon: '👰', label: 'Vợ' },
  { icon: '🤵', label: 'Chồng' },
  { icon: '👶', label: 'Con cái' },
  { icon: '👴', label: 'Ông' },
  { icon: '👵', label: 'Bà' },
  { icon: '👨‍👩‍👧', label: 'Người thân' },
  { icon: '👥', label: 'Bạn bè' },
];

const emotions = [
  { color: '#E8C4C0', label: 'Yêu thương & ấm áp', icon: '❤️' },
  { color: '#F0C8A8', label: 'Biết ơn & trân trọng', icon: '🙏' },
  { color: '#C9968A', label: 'Vui vẻ & hạnh phúc', icon: '✨' },
  { color: '#BFA06A', label: 'Hoài niệm & kỷ niệm', icon: '🌸' },
];

interface QuizPreviewProps {
  onStart: (answers: PreAnswers) => void;
}

export default function QuizPreview({ onStart }: QuizPreviewProps) {
  const [selectedRecipient, setSelectedRecipient] = useState<number | null>(null);
  const [selectedEmotion, setSelectedEmotion] = useState<number | null>(null);
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

  const handleContinue = () => {
    onStart({
      recipient: selectedRecipient !== null ? recipients[selectedRecipient].label : undefined,
      emotion: selectedEmotion !== null ? emotions[selectedEmotion].label : undefined,
    });
  };

  return (
    <section ref={ref} className="relative py-24 md:py-36 px-8 md:px-16 overflow-hidden" style={{ background: '#5C1A24' }}>
      {/* Decorative arch */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center top, #BFA06A18 0%, transparent 70%)' }}
      />
      {/* Gold line border top */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(to right, transparent, #BFA06A60, transparent)' }} />

      <div
        className="max-w-4xl mx-auto"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'none' : 'translateY(40px)',
          transition: 'opacity 0.9s ease, transform 0.9s ease',
        }}
      >
        <div className="text-center mb-14">
          <p className="font-script text-xl mb-3" style={{ color: '#E8C4C0' }}>Bắt đầu</p>
          <h2 className="font-display text-3xl md:text-5xl font-semibold mb-4" style={{ color: '#FDF9F4' }}>
            Bạn muốn gửi thiệp cho ai?
          </h2>
          <GoldDivider className="w-48 mx-auto" />
        </div>

        {/* Recipient selection */}
        <div className="mb-12">
          <p className="font-body text-sm mb-5 text-center" style={{ color: '#C9968A' }}>Chọn người nhận</p>
          <div className="grid grid-cols-3 md:grid-cols-9 gap-3">
            {recipients.map((r, i) => (
              <button
                key={i}
                onClick={() => setSelectedRecipient(i)}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-300 hover:scale-105"
                style={{
                  background: selectedRecipient === i ? '#BFA06A22' : '#FFFFFF0A',
                  border: selectedRecipient === i ? '1.5px solid #BFA06A' : '1.5px solid #FFFFFF15',
                }}
              >
                <span className="text-2xl">{r.icon}</span>
                <span className="font-body text-xs" style={{ color: selectedRecipient === i ? '#BFA06A' : '#E8C4C0' }}>{r.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Emotion selection */}
        <div className="mb-14">
          <p className="font-body text-sm mb-5 text-center" style={{ color: '#C9968A' }}>Cảm xúc bạn muốn gửi gắm</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {emotions.map((e, i) => (
              <button
                key={i}
                onClick={() => setSelectedEmotion(i)}
                className="flex items-center gap-3 p-4 rounded-2xl transition-all duration-300 hover:scale-105"
                style={{
                  background: selectedEmotion === i ? `${e.color}30` : '#FFFFFF0A',
                  border: selectedEmotion === i ? `1.5px solid ${e.color}` : '1.5px solid #FFFFFF15',
                }}
              >
                <span className="text-xl flex-shrink-0">{e.icon}</span>
                <span className="font-body text-sm text-left" style={{ color: selectedEmotion === i ? e.color : '#E8C4C0' }}>{e.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={handleContinue}
            className="group inline-flex items-center gap-3 px-10 py-4 rounded-full font-body text-base transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            style={{
              background: selectedRecipient !== null || selectedEmotion !== null ? '#BFA06A' : '#FFFFFF18',
              color: '#FAF6F0',
              border: '1px solid #BFA06A55',
              letterSpacing: '0.04em',
            }}
          >
            Tiếp tục tạo thiệp
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 16 16" fill="currentColor">
              <path fillRule="evenodd" d="M1 8a.5.5 0 01.5-.5h11.793l-3.147-3.146a.5.5 0 01.708-.708l4 4a.5.5 0 010 .708l-4 4a.5.5 0 01-.708-.708L13.293 8.5H1.5A.5.5 0 011 8z" clipRule="evenodd" />
            </svg>
          </button>
          <p className="font-body text-xs mt-4" style={{ color: '#8C7070' }}></p>
        </div>
      </div>
    </section>
  );
}
