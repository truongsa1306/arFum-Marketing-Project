import { useEffect, useRef, useState } from 'react';
import { GoldDivider, BlossomCluster } from './BlossomDecor';

export default function Story() {
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
    <section
      ref={ref}
      className="relative py-24 md:py-36 px-8 md:px-16 overflow-hidden"
      style={{ background: '#FDF9F4' }}
    >
      <BlossomCluster className="absolute right-0 top-0 w-72 h-72 opacity-30 pointer-events-none" />
      <BlossomCluster className="absolute left-0 bottom-0 w-56 h-56 opacity-25 pointer-events-none" style={{ transform: 'scaleX(-1)' }} />

      <div
        className="max-w-4xl mx-auto text-center"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'none' : 'translateY(40px)',
          transition: 'opacity 0.9s ease, transform 0.9s ease',
        }}
      >
        <p className="font-script text-xl md:text-2xl mb-4" style={{ color: '#C9968A' }}>Câu chuyện</p>
        <GoldDivider className="w-48 mx-auto mb-10" />
        <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-medium leading-snug mb-10" style={{ color: '#5C1A24' }}>
          Những điều thương,
          <br />
          <span className="italic">đôi khi không cần nói nhiều.</span>
        </h2>
        <p className="font-body text-base md:text-lg leading-loose max-w-2xl mx-auto" style={{ color: '#5C5050' }}>
          Một tấm thiệp Tết không chỉ là lời chúc. Đó là khoảnh khắc bạn dừng lại, nghĩ đến một người và muốn họ cảm nhận được yêu thương ấy. Vì vậy, mỗi tấm thiệp được cá nhân hóa thành một câu chuyện riêng — về người nhận, về kỷ niệm, và về tình cảm của bạn.
        </p>
      </div>
    </section>
  );
}
