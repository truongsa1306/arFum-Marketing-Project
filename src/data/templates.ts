// arFUM Card Template Definitions
// Data-driven — reference images are the source of truth

export type CardTemplate = {
  id: number;
  name: string;
  emotion: string;
  // ── Asset paths (served from /public/templates/) ──
  backgroundAsset: string;  // reference card frame image path
  cssFilter?: string;        // CSS filter for emotion-derived templates (04, 05)
  // ── Colors ──
  bgColor: string;           // card outer background (visible at edges / before image loads)
  frameColor: string;        // oval interior / text area background
  borderColor: string;       // gold accent color
  accentColor: string;       // placeholder tint
  titleColor: string;        // "YOU ARE" serif
  scriptColor: string;       // "Loved" + personal message script
  heartColor: string;        // heart ornament
  brandingColor: string;     // arFUM branding
  // ── Message fit-to-box area (in canvas-logical pixels, canvas = 460×640) ──
  messageArea: {
    width: number;      // logical px — width available for message text
    height: number;     // logical px — max height before overflow
    maxFontSize: number;
    minFontSize: number;
  };
};

export const TEMPLATES: CardTemplate[] = [
  // ── Template 01: Mẹ và những điều thương ──
  {
    id: 1,
    name: 'M\u1eb9 v\u00e0 nh\u1eefng \u0111i\u1ec1u th\u01b0\u01a1ng',
    emotion: '',
    backgroundAsset: '/templates/frame-01-pink.jpg',
    bgColor: '#F0DACE',
    frameColor: '#FDF5EE',
    borderColor: '#C8A96E',
    accentColor: '#C4829A',
    titleColor: '#7A3347',
    scriptColor: '#A63D59',
    heartColor: '#A63D59',
    brandingColor: '#7A3347',
    messageArea: { width: 210, height: 56, maxFontSize: 26, minFontSize: 10 },
  },

  // ── Template 02: Dịu dàng sắc xanh ──
  {
    id: 2,
    name: 'Di\u1ee5 d\u00e0ng s\u1eafc xanh',
    emotion: '',
    backgroundAsset: '/templates/frame-02-blue-lavender.jpg',
    bgColor: '#B8C0DC',
    frameColor: '#F8F5EE',
    borderColor: '#C8A96E',
    accentColor: '#7B87C2',
    titleColor: '#2D3A7A',
    scriptColor: '#3A49A0',
    heartColor: '#3A49A0',
    brandingColor: '#2D3A7A',
    messageArea: { width: 210, height: 56, maxFontSize: 26, minFontSize: 10 },
  },

  // ── Template 03: Vui vẻ & Hạnh phúc ──
  {
    id: 3,
    name: 'Vui v\u1ebb & H\u1ea1nh ph\u00fac',
    emotion: 'Vui v\u1ebb & h\u1ea1nh ph\u00fac',
    backgroundAsset: '/templates/frame-03-fresh-blue.jpg',
    bgColor: '#9EC8DC',
    frameColor: '#F5F5ED',
    borderColor: '#C8A96E',
    accentColor: '#4A9AB5',
    titleColor: '#1A5068',
    scriptColor: '#1E6880',
    heartColor: '#1E6880',
    brandingColor: '#1A5068',
    messageArea: { width: 210, height: 56, maxFontSize: 26, minFontSize: 10 },
  },

  // ── Template 04: Yêu thương & Ấm áp ──
  // Derived from pink reference + warm tint
  {
    id: 4,
    name: 'Y\u00eau th\u01b0\u01a1ng & \u1ea4m \u00e1p',
    emotion: 'Y\u00eau th\u01b0\u01a1ng & \u1ea5m \u00e1p',
    backgroundAsset: '/templates/frame-01-pink.jpg',
    cssFilter: 'saturate(1.15) brightness(0.97)',
    bgColor: '#E8C8C0',
    frameColor: '#FDF8F5',
    borderColor: '#C8A96E',
    accentColor: '#C4829A',
    titleColor: '#8C3050',
    scriptColor: '#A83060',
    heartColor: '#A83060',
    brandingColor: '#8C3050',
    messageArea: { width: 210, height: 56, maxFontSize: 26, minFontSize: 10 },
  },

  // ── Template 05: Biết ơn & Trân trọng ──
  // Derived from blue-lavender + hue-rotate to purple
  {
    id: 5,
    name: 'Bi\u1ebft \u01a1n & Tr\u00e2n tr\u1ecdng',
    emotion: 'Bi\u1ebft \u01a1n & tr\u00e2n tr\u1ecdng',
    backgroundAsset: '/templates/frame-02-blue-lavender.jpg',
    cssFilter: 'hue-rotate(30deg) saturate(0.9) brightness(0.95)',
    bgColor: '#A898C0',
    frameColor: '#F8F5FC',
    borderColor: '#C8A96E',
    accentColor: '#7A5E9A',
    titleColor: '#3D2060',
    scriptColor: '#5028A0',
    heartColor: '#5028A0',
    brandingColor: '#3D2060',
    messageArea: { width: 210, height: 56, maxFontSize: 26, minFontSize: 10 },
  },

  // ── Template 06: Hoài niệm & Kỷ niệm ──
  {
    id: 6,
    name: 'Ho\u00e0i ni\u1ec7m & K\u1ef7 ni\u1ec7m',
    emotion: 'Ho\u00e0i ni\u1ec7m & k\u1ef7 ni\u1ec7m',
    backgroundAsset: '/templates/frame-06-dusty-rose.jpg',
    bgColor: '#CEB0A8',
    frameColor: '#FAF2EE',
    borderColor: '#C8A96E',
    accentColor: '#9A4A60',
    titleColor: '#6A2030',
    scriptColor: '#8C2840',
    heartColor: '#8C2840',
    brandingColor: '#6A2030',
    messageArea: { width: 210, height: 56, maxFontSize: 26, minFontSize: 10 },
  },
];

// ────────────────────────────────────────────────────────
// Normalize Vietnamese string for emotion matching
// Strips diacritics so "Vui vẻ" matches "vui ve", etc.
// ────────────────────────────────────────────────────────
function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// ────────────────────────────────────────────────────────
// DETERMINISTIC TEMPLATE SELECTION
// Primary: emotion label
// Secondary refinement: recipient
// ────────────────────────────────────────────────────────
export function selectTemplate(emotion: string, recipient: string): CardTemplate {
  const e = normalize(emotion);
  const r = normalize(recipient);

  // Primary emotion mapping
  if (e.includes('vui ve') || e.includes('hanh phuc'))    return TEMPLATES[2]; // 03
  if (e.includes('yeu thuong') || e.includes('am ap'))    return TEMPLATES[3]; // 04
  if (e.includes('biet on') || e.includes('tran trong')) {
    // Formal recipients → more elegant blue template
    if (r.includes('ong') || r.includes('tho') || r.includes('thay') || r.includes('co ')) {
      return TEMPLATES[1]; // 02
    }
    return TEMPLATES[4]; // 05
  }
  if (e.includes('hoai niem') || e.includes('ky niem'))   return TEMPLATES[5]; // 06

  // Secondary: recipient-based fallback
  if (r.includes('me ') || r.includes('me👩') || r.includes('nguoi than')) return TEMPLATES[0]; // 01
  if (r.includes('ba ') || r.includes('ba👨'))            return TEMPLATES[0]; // 01
  if (r.includes('vo') || r.includes('chong'))            return TEMPLATES[3]; // 04
  if (r.includes('ban be'))                                return TEMPLATES[2]; // 03

  return TEMPLATES[0]; // Default: Template 01 (pink/blush)
}

export default TEMPLATES;