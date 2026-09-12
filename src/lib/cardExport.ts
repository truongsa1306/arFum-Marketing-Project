// ────────────────────────────────────────────────────────────
// Canvas-based final card compositor / PNG exporter.
//
// Reuses the CardGenerator.jsx reference techniques:
//   - base/frame image loading
//   - user photo drawing with cover-fit + pan/zoom transform
//   - oval clip mask for the photo region
//   - canvas measureText-based dynamic font fitting (same
//     algorithm as CardTextRenderer.tsx, ported to the export
//     canvas so the PNG matches the live preview)
//   - recipient text rendering
//   - PNG export via canvas.toDataURL / toBlob
//
// This does not replace the DOM/CSS live preview (CardTemplate.tsx) —
// it is the "flatten to PNG" step that the live preview does not do.
// ────────────────────────────────────────────────────────────

import type { ImageTransform } from '../types/card';
import type { CardTemplate } from '../data/templates';

// Card logical size — matches the 460×640 logical box used by the
// live preview (CardTemplate.tsx / CardTextRenderer.tsx).
const CARD_W = 460;
const CARD_H = 640;
const EXPORT_SCALE = 3; // render at 3x for a crisp, print-quality PNG

// Oval photo region — matches OVAL_TOP/LEFT/WIDTH/HEIGHT in CardTemplate.tsx
const OVAL = { top: 0.035, left: 0.13, width: 0.74, height: 0.54 };

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// Word-wrap + shrink-to-fit, identical approach to CardTextRenderer.tsx —
// searches from maxFontSize down to minFontSize for the largest size
// whose wrapped lines fit inside the given box.
function fitText(
  ctx: CanvasRenderingContext2D,
  message: string,
  fontFamily: string,
  width: number,
  height: number,
  minFontSize: number,
  maxFontSize: number,
  lineHeight: number
): { size: number; lines: string[] } {
  let bestSize = minFontSize;
  let bestLines: string[] = [message];

  for (let size = maxFontSize; size >= minFontSize; size--) {
    ctx.font = `700 ${size}px ${fontFamily}`;
    const words = message.split(/\s+/);
    let currentLine = '';
    const lines: string[] = [];

    for (let i = 0; i < words.length; i++) {
      const testLine = currentLine + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > width && i > 0) {
        lines.push(currentLine.trim());
        currentLine = words[i] + ' ';
      } else {
        currentLine = testLine;
      }
    }
    lines.push(currentLine.trim());

    const totalHeight = lines.length * (size * lineHeight);
    if (totalHeight <= height) {
      bestSize = size;
      bestLines = lines;
      break;
    }
  }
  return { size: bestSize, lines: bestLines };
}

export interface RenderCardOptions {
  template: CardTemplate;
  uploadedImageSrc: string | null;
  imageTransform: ImageTransform;
  message: string;
  recipient: string;
}

// Draws the full composited card onto a fresh canvas and returns it.
export async function renderCardToCanvas(opts: RenderCardOptions): Promise<HTMLCanvasElement> {
  const { template: t, uploadedImageSrc, imageTransform: tf, message, recipient } = opts;

  // Wait for the web fonts (Dancing Script / Playfair Display / Lora) to be
  // ready so canvas text metrics match what the DOM preview shows.
  if ('fonts' in document) {
    try { await (document as any).fonts.ready; } catch { /* noop */ }
  }

  const canvas = document.createElement('canvas');
  canvas.width = CARD_W * EXPORT_SCALE;
  canvas.height = CARD_H * EXPORT_SCALE;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');
  ctx.scale(EXPORT_SCALE, EXPORT_SCALE);

  // ── Base background ──
  ctx.fillStyle = t.bgColor;
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  const ovalX = OVAL.left * CARD_W;
  const ovalY = OVAL.top * CARD_H;
  const ovalW = OVAL.width * CARD_W;
  const ovalH = OVAL.height * CARD_H;

  // ── Layer 1: user photo, clipped to the oval, cover-fit + pan/zoom ──
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(ovalX + ovalW / 2, ovalY + ovalH / 2, ovalW / 2, ovalH / 2, 0, 0, Math.PI * 2);
  ctx.clip();

  ctx.fillStyle = t.frameColor;
  ctx.fillRect(ovalX, ovalY, ovalW, ovalH);

  if (uploadedImageSrc) {
    const img = await loadImage(uploadedImageSrc);
    // "cover" fit: scale so the image fills the oval bounding box, then
    // apply the same pan (tf.x/tf.y in preview px) + zoom (tf.scale) the
    // user chose in PhotoEditor. The preview box is ovalW×ovalH logical
    // px at 1:1 with these canvas units, so transforms carry over directly.
    const coverScale = Math.max(ovalW / img.width, ovalH / img.height) * tf.scale;
    const drawW = img.width * coverScale;
    const drawH = img.height * coverScale;
    const cx = ovalX + ovalW / 2 + tf.x;
    const cy = ovalY + ovalH / 2 + tf.y;
    ctx.drawImage(img, cx - drawW / 2, cy - drawH / 2, drawW, drawH);
  } else {
    ctx.fillStyle = t.accentColor;
    ctx.globalAlpha = 0.15;
    ctx.fillRect(ovalX, ovalY, ovalW, ovalH);
    ctx.globalAlpha = 1;
  }
  ctx.restore();

  // ── Layer 2: fixed decorative frame, multiply-blended over the photo ──
  // (mirrors the mix-blend-mode: multiply used in the live DOM preview,
  // so the ivory oval interior of the frame art reveals the photo below)
  const frameImg = await loadImage(t.backgroundAsset);
  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  ctx.drawImage(frameImg, 0, 0, CARD_W, CARD_H);
  ctx.restore();
  if (t.cssFilter) {
    // Approximate the CSS filter variants (T04/T05) with a translucent tint,
    // since canvas has no direct hue-rotate/saturate filter for drawImage
    // composites without a second offscreen pass.
    ctx.save();
    ctx.globalCompositeOperation = 'overlay';
    ctx.fillStyle = t.accentColor;
    ctx.globalAlpha = 0.08;
    ctx.fillRect(0, 0, CARD_W, CARD_H);
    ctx.restore();
  }

  // ── Layer 3: dynamic text (message + recipient name) ──
  //
  // IMPORTANT: "YOU ARE", "Loved", the two guide lines, the heart
  // divider, the "For" label, and the "arFÜM / Love That Stays"
  // branding are already baked into `t.backgroundAsset` and were just
  // drawn above via `frameImg`. They must NOT be drawn again here —
  // doing so previously produced a duplicated "For" (and would
  // duplicate the title/branding too). Only the two genuinely dynamic
  // pieces — the personal message and the recipient's name — are drawn,
  // using the same logical zones as the live preview
  // (CardTemplate.tsx's MESSAGE_* / RECIPIENT_* constants).
  ctx.textAlign = 'center';

  // Personal message — fitted via the same shrink-to-fit algorithm as
  // the live preview's CardTextRenderer, positioned between the bottom
  // of "Loved" (~71.5%) and the heart divider (~80.5%).
  const msgArea = t.messageArea ?? { width: 210, height: 56, maxFontSize: 26, minFontSize: 10 };
  const msgBoxTop = CARD_H * 0.715;
  const msgBoxHeight = CARD_H * 0.09;
  if (message) {
    const { size, lines } = fitText(
      ctx, message, "'Dancing Script', cursive",
      msgArea.width, msgArea.height, msgArea.minFontSize, msgArea.maxFontSize, 1.35
    );
    ctx.fillStyle = t.scriptColor;
    ctx.font = `700 ${size}px "Dancing Script", cursive`;
    const lineH = size * 1.35;
    const totalTextHeight = lines.length * lineH;
    // Vertically center the fitted text block inside the message box.
    let y = msgBoxTop + (msgBoxHeight - totalTextHeight) / 2 + lineH * 0.7;
    for (const line of lines) {
      ctx.fillText(line, CARD_W / 2, y);
      y += lineH;
    }
  }

  // Recipient name only — the "For" label is already part of the
  // template art immediately to the left of this box.
  if (recipient) {
    ctx.textAlign = 'left';
    ctx.fillStyle = t.titleColor;
    ctx.font = 'italic 13px "Playfair Display", serif';
    ctx.fillText(recipient, CARD_W * 0.45, CARD_H * 0.855);
  }

  return canvas;
}

// Renders the card and triggers a browser download of the PNG.
export async function downloadCardAsPng(opts: RenderCardOptions, filename = 'arfum-thiep-tet.png'): Promise<void> {
  const canvas = await renderCardToCanvas(opts);
  const blob: Blob | null = await new Promise(resolve => canvas.toBlob(resolve, 'image/png', 1));
  if (!blob) throw new Error('Failed to export PNG');
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// Renders the card and returns a data URL (for share/preview flows).
export async function renderCardToDataUrl(opts: RenderCardOptions): Promise<string> {
  const canvas = await renderCardToCanvas(opts);
  return canvas.toDataURL('image/png', 1);
}