import { useState } from 'react';
import { GoldDivider } from './BlossomDecor';

interface MessageStepProps {
  initial?: string;
  onNext: (message: string) => void;
  onBack: () => void;
}

const MAX_WORDS = 20;

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export default function MessageStep({ initial = '', onNext, onBack }: MessageStepProps) {
  const [text, setText] = useState(initial);

  const words = text.trim() === '' ? 0 : countWords(text);
  const isOver = words > MAX_WORDS;
  const canContinue = !isOver;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  return (
    <div style={{ animation: 'fadeUp 0.5s ease forwards' }}>
      {/* Decorative icon */}
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6"
        style={{ background: '#F0C8A8', border: '1px solid #BFA06A44' }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 3c-1.5 0-2.8.6-3.8 1.5C6.4 5.8 5.5 7.8 5.5 10c0 4.2 6.5 10.5 6.5 10.5s6.5-6.3 6.5-10.5c0-2.2-.9-4.2-2.7-5.5C14.8 3.6 13.5 3 12 3z" fill="#C9968A" opacity="0.7" />
          <circle cx="12" cy="10" r="2.5" fill="#FAF6F0" />
        </svg>
      </div>

      <p className="font-script text-lg text-center mb-1" style={{ color: '#C9968A' }}>
        Lời nhắn từ trái tim
      </p>
      <h2 className="font-display text-xl md:text-2xl font-semibold text-center mb-2" style={{ color: '#5C1A24' }}>
        Đôi lời yêu thương gửi tới người nhận
      </h2>
      <GoldDivider className="w-40 mx-auto mb-4" />
      <p className="font-body text-sm text-center mb-8" style={{ color: '#8C7070' }}>
        Viết một lời nhắn ngắn, chân thành và dành riêng cho người ấy.
      </p>

      {/* Textarea */}
      <div
        className="relative rounded-3xl overflow-hidden mb-3"
        style={{
          border: isOver ? '1.5px solid #C9968A' : '1.5px solid #BFA06A55',
          background: '#FDF9F4',
          boxShadow: '0 2px 16px rgba(92,26,36,0.06)',
        }}
      >
        {/* Top gold accent bar */}
        <div className="h-1 w-full" style={{ background: 'linear-gradient(to right, #C9968A, #BFA06A, #C9968A)' }} />

        <textarea
          value={text}
          onChange={handleChange}
          placeholder="Ví dụ: Cảm ơn mẹ đã luôn chăm sóc con..."
          rows={4}
          className="w-full px-6 py-5 font-script text-base resize-none outline-none"
          style={{
            background: 'transparent',
            color: '#5C1A24',
            fontSize: '16px',
            lineHeight: 1.7,
            fontFamily: 'Dancing Script, cursive',
          }}
        />

        {/* Word counter */}
        <div
          className="flex items-center justify-between px-6 pb-4"
          style={{ borderTop: '1px solid #BFA06A22' }}
        >
          <p className="font-body text-xs" style={{ color: '#8C7070' }}>
            Tối đa {MAX_WORDS} từ
          </p>
          <span
            className="font-body text-xs font-medium"
            style={{ color: isOver ? '#C9968A' : '#8C7070' }}
          >
            {words}/{MAX_WORDS} từ
          </span>
        </div>
      </div>

      {/* Validation message */}
      {isOver && (
        <p
          className="font-body text-xs text-center mb-4 px-4"
          style={{ color: '#C9968A' }}
        >
          Vui lòng viết tối đa {MAX_WORDS} từ để lời nhắn vừa vặn trên thiệp.
        </p>
      )}

      {/* Skip option */}
      {!isOver && (
        <p className="font-body text-xs text-center mb-4" style={{ color: '#8C7070' }}>
          Bỏ trống nếu bạn muốn để thiệp nói thay lời.
        </p>
      )}

      {/* Next button */}
      <button
        onClick={() => canContinue && onNext(text.trim())}
        disabled={!canContinue}
        className="w-full py-4 rounded-full font-body text-base transition-all duration-300 mb-3"
        style={{
          background: canContinue ? '#5C1A24' : '#E8C4C0',
          color: canContinue ? '#FAF6F0' : '#C9968A',
          cursor: canContinue ? 'pointer' : 'not-allowed',
        }}
      >
        Tiếp theo: Tải ảnh →
      </button>

      <button
        onClick={onBack}
        className="w-full py-3 rounded-full font-body text-sm border transition-all duration-300"
        style={{ border: '1px solid #BFA06A44', color: '#8C7070', background: 'transparent' }}
      >
        ← Quay lại
      </button>
    </div>
  );
}
