import { useState, useRef, useCallback } from 'react';
import CardTemplateComponent from './CardTemplate';
import type { CardTemplate } from '../data/templates';
import { DEFAULT_TRANSFORM } from '../types/card';
import type { ImageTransform } from '../types/card';

// Re-export so FlowScreen can still do: import type { ImageTransform } from './PhotoEditor'
export type { ImageTransform };

interface PhotoEditorProps {
  template: CardTemplate;
  uploadedImage: string;
  message: string;
  recipient: string;
  onConfirm: (transform: ImageTransform) => void;
  onBack: () => void;
}



export default function PhotoEditor({
  template,
  uploadedImage,
  message,
  recipient,
  onConfirm,
  onBack,
}: PhotoEditorProps) {
  const [transform, setTransform] = useState<ImageTransform>(DEFAULT_TRANSFORM);
  const dragRef = useRef<{ startX: number; startY: number; startTx: number; startTy: number } | null>(null);
  const pinchRef = useRef<number | null>(null);

  // ── Drag (pan) ──
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startTx: transform.x,
      startTy: transform.y,
    };
  }, [transform]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setTransform(t => ({ ...t, x: dragRef.current!.startTx + dx * 0.5, y: dragRef.current!.startTy + dy * 0.5 }));
  }, []);

  const onPointerUp = useCallback(() => { dragRef.current = null; }, []);

  // ── Pinch zoom ──
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[1].clientX - e.touches[0].clientX;
      const dy = e.touches[1].clientY - e.touches[0].clientY;
      pinchRef.current = Math.hypot(dx, dy);
    }
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchRef.current !== null) {
      e.preventDefault();
      const dx = e.touches[1].clientX - e.touches[0].clientX;
      const dy = e.touches[1].clientY - e.touches[0].clientY;
      const newDist = Math.hypot(dx, dy);
      const ratio = newDist / pinchRef.current;
      pinchRef.current = newDist;
      setTransform(t => ({ ...t, scale: Math.max(0.5, Math.min(3, t.scale * ratio)) }));
    }
  }, []);

  const onTouchEnd = useCallback(() => { pinchRef.current = null; }, []);

  return (
    <div style={{ animation: 'fadeUp 0.5s ease forwards' }}>
      <div className="w-10 h-10 mx-auto mb-5 rounded-full flex items-center justify-center opacity-50" style={{ background: '#E8C4C0' }}>
        <span style={{ fontSize: 18 }}>✂️</span>
      </div>
      <h2 className="font-display text-2xl font-semibold text-center mb-2" style={{ color: '#5C1A24' }}>
        Điều chỉnh ảnh
      </h2>
      <p className="font-body text-sm text-center mb-6" style={{ color: '#8C7070' }}>
        Kéo để di chuyển ảnh · Chụm ngón tay để thu phóng
      </p>

      {/* Live card preview with drag zone */}
      <div
        className="relative mx-auto mb-6 overflow-hidden rounded-2xl shadow-xl select-none"
        style={{ width: 280, height: 380, cursor: 'grab', border: '1px solid #BFA06A44' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div style={{ transform: 'scale(0.609)', transformOrigin: 'top left', width: 460, height: 640, pointerEvents: 'none' }}>
          <CardTemplateComponent
            template={template}
            uploadedImage={uploadedImage}
            imageTransform={transform}
            message={message}
            recipient={recipient}
          />
        </div>
      </div>

      {/* Zoom slider */}
      <div className="mb-6 px-4">
        <div className="flex items-center gap-3">
          <span className="font-body text-xs" style={{ color: '#8C7070' }}>−</span>
          <input
            type="range"
            min={50}
            max={250}
            value={Math.round(transform.scale * 100)}
            onChange={e => setTransform(t => ({ ...t, scale: parseInt(e.target.value) / 100 }))}
            className="flex-1"
            style={{ accentColor: '#C9968A' }}
          />
          <span className="font-body text-xs" style={{ color: '#8C7070' }}>+</span>
        </div>
        <p className="font-body text-xs text-center mt-1" style={{ color: '#8C7070' }}>
          Thu phóng: {Math.round(transform.scale * 100)}%
        </p>
      </div>

      {/* Direction buttons */}
      <div className="flex justify-center mb-6">
        <div className="grid grid-cols-3 gap-1" style={{ width: 120 }}>
          <div />
          <button
            onClick={() => setTransform(t => ({ ...t, y: t.y - 20 }))}
            className="flex items-center justify-center rounded-xl py-2 font-body text-lg"
            style={{ background: '#FDF9F4', border: '1px solid #BFA06A44', color: '#5C1A24' }}
          >▲</button>
          <div />
          <button
            onClick={() => setTransform(t => ({ ...t, x: t.x - 20 }))}
            className="flex items-center justify-center rounded-xl py-2 font-body text-lg"
            style={{ background: '#FDF9F4', border: '1px solid #BFA06A44', color: '#5C1A24' }}
          >◀</button>
          <button
            onClick={() => setTransform(DEFAULT_TRANSFORM)}
            className="flex items-center justify-center rounded-xl py-2 font-body text-xs"
            style={{ background: '#E8C4C0', border: '1px solid #BFA06A44', color: '#5C1A24' }}
          >↺</button>
          <button
            onClick={() => setTransform(t => ({ ...t, x: t.x + 20 }))}
            className="flex items-center justify-center rounded-xl py-2 font-body text-lg"
            style={{ background: '#FDF9F4', border: '1px solid #BFA06A44', color: '#5C1A24' }}
          >▶</button>
          <div />
          <button
            onClick={() => setTransform(t => ({ ...t, y: t.y + 20 }))}
            className="flex items-center justify-center rounded-xl py-2 font-body text-lg"
            style={{ background: '#FDF9F4', border: '1px solid #BFA06A44', color: '#5C1A24' }}
          >▼</button>
          <div />
        </div>
      </div>

      {/* Actions */}
      <button
        onClick={() => onConfirm(transform)}
        className="w-full py-4 rounded-full font-body text-base transition-all duration-300 hover:shadow-xl hover:scale-105 mb-3"
        style={{ background: '#5C1A24', color: '#FAF6F0' }}
      >
        ✓ Xác nhận ảnh
      </button>
      <button
        onClick={onBack}
        className="w-full py-3 rounded-full font-body text-sm border transition-all duration-300"
        style={{ border: '1px solid #BFA06A44', color: '#8C7070', background: 'transparent' }}
      >
        ← Chọn lại ảnh
      </button>
    </div>
  );
}
