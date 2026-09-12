import { memo } from 'react';

// SVG peach/apricot blossom motifs and gold ornaments

export const BlossomCluster = memo(({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    {/* Center */}
    <circle cx="100" cy="100" r="8" fill="#BFA06A" opacity="0.6" />
    {/* Petals */}
    {[0, 72, 144, 216, 288].map((angle, i) => (
      <ellipse
        key={i}
        cx={100 + 22 * Math.cos((angle * Math.PI) / 180)}
        cy={100 + 22 * Math.sin((angle * Math.PI) / 180)}
        rx="14"
        ry="20"
        fill={i % 2 === 0 ? '#E8C4C0' : '#F0C8A8'}
        opacity="0.75"
        transform={`rotate(${angle + 90}, ${100 + 22 * Math.cos((angle * Math.PI) / 180)}, ${100 + 22 * Math.sin((angle * Math.PI) / 180)})`}
      />
    ))}
    {/* Stamen dots */}
    {[0, 60, 120, 180, 240, 300].map((angle, i) => (
      <circle
        key={i}
        cx={100 + 10 * Math.cos((angle * Math.PI) / 180)}
        cy={100 + 10 * Math.sin((angle * Math.PI) / 180)}
        r="2"
        fill="#BFA06A"
        opacity="0.8"
      />
    ))}
    {/* Small side blossoms */}
    <ellipse cx="45" cy="50" rx="9" ry="13" fill="#E8C4C0" opacity="0.5" transform="rotate(-30, 45, 50)" />
    <ellipse cx="55" cy="38" rx="8" ry="12" fill="#F0C8A8" opacity="0.5" transform="rotate(20, 55, 38)" />
    <circle cx="50" cy="44" r="4" fill="#BFA06A" opacity="0.4" />
    <ellipse cx="155" cy="160" rx="9" ry="13" fill="#E8C4C0" opacity="0.45" transform="rotate(15, 155, 160)" />
    <ellipse cx="165" cy="148" rx="8" ry="11" fill="#F0C8A8" opacity="0.45" transform="rotate(-20, 165, 148)" />
    <circle cx="160" cy="154" r="4" fill="#BFA06A" opacity="0.35" />
  </svg>
));

export const SmallBlossom = memo(({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    <circle cx="40" cy="40" r="5" fill="#BFA06A" opacity="0.7" />
    {[0, 72, 144, 216, 288].map((angle, i) => (
      <ellipse
        key={i}
        cx={40 + 14 * Math.cos((angle * Math.PI) / 180)}
        cy={40 + 14 * Math.sin((angle * Math.PI) / 180)}
        rx="8"
        ry="12"
        fill={i % 2 === 0 ? '#E8C4C0' : '#F0C8A8'}
        opacity="0.8"
        transform={`rotate(${angle + 90}, ${40 + 14 * Math.cos((angle * Math.PI) / 180)}, ${40 + 14 * Math.sin((angle * Math.PI) / 180)})`}
      />
    ))}
  </svg>
));

export const GoldDivider = memo(({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 400 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    <line x1="0" y1="20" x2="155" y2="20" stroke="#BFA06A" strokeWidth="0.75" strokeOpacity="0.5" />
    <circle cx="170" cy="20" r="3" fill="#BFA06A" opacity="0.6" />
    <circle cx="183" cy="20" r="5" fill="none" stroke="#BFA06A" strokeWidth="0.75" opacity="0.6" />
    <path d="M188 20 L200 14 L212 20 L200 26 Z" fill="#BFA06A" opacity="0.5" />
    <circle cx="217" cy="20" r="5" fill="none" stroke="#BFA06A" strokeWidth="0.75" opacity="0.6" />
    <circle cx="230" cy="20" r="3" fill="#BFA06A" opacity="0.6" />
    <line x1="245" y1="20" x2="400" y2="20" stroke="#BFA06A" strokeWidth="0.75" strokeOpacity="0.5" />
  </svg>
));

export const RibbonWave = memo(({ className = '', fill = '#E8C4C0' }: { className?: string; fill?: string }) => (
  <svg viewBox="0 0 1440 80" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    <path
      d="M0 40 C240 10, 480 70, 720 40 C960 10, 1200 70, 1440 40 L1440 80 L0 80 Z"
      fill={fill}
      opacity="0.25"
    />
    <path
      d="M0 50 C240 20, 480 80, 720 50 C960 20, 1200 80, 1440 50 L1440 80 L0 80 Z"
      fill={fill}
      opacity="0.15"
    />
  </svg>
));

export const OvalFrame = memo(({ className = '', children }: { className?: string; children?: React.ReactNode }) => (
  <div className={`relative ${className}`} style={{ borderRadius: '60% 40% 40% 60% / 50% 50% 50% 50%', overflow: 'hidden' }}>
    {children}
  </div>
));

export const ArchFrame = memo(({ className = '', children }: { className?: string; children?: React.ReactNode }) => (
  <div
    className={`relative overflow-hidden ${className}`}
    style={{ borderRadius: '50% 50% 12px 12px / 60% 60% 12px 12px' }}
  >
    {children}
  </div>
));
