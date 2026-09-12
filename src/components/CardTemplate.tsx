import type { ImageTransform } from '../types/card';
import type { CardTemplate } from '../data/templates';
import CardTextRenderer from './CardTextRenderer';

interface Props {
  template: CardTemplate;
  uploadedImage: string | null;
  imageTransform: ImageTransform;
  message: string;
  recipient: string;
  compact?: boolean;
}

export default function CardTemplateComponent({
  template: t,
  uploadedImage,
  imageTransform: tf,
  message,
  recipient,
  compact = false,
}: Props) {

  // ── Oval dimensions (% of card height/width) ──
  // Reference cards: oval frame occupies top ~57% of card, centered, ~72% wide
  // The oval is a true pill/ellipse shape
  const OVAL_TOP    = '3.5%';
  const OVAL_LEFT   = '13%';
  const OVAL_WIDTH  = '74%';
  const OVAL_HEIGHT = '54%';

  // ── Dynamic text zones (% of card height/width) ──
  // NOTE: "YOU ARE", "Loved", the two guide lines, the heart divider,
  // the "For" label, and the "arFÜM / Love That Stays" branding are all
  // already baked into `backgroundAsset` (the frame image). They are the
  // single source of truth for that fixed text, so we must NOT re-render
  // them here — doing so is what previously caused the duplicated /
  // overlapping text. Only the two genuinely dynamic pieces (the
  // personal message and the recipient name) are rendered on top, each
  // positioned to land exactly in the blank area the template reserves
  // for it.
  //
  // Coordinates were measured directly against the template art:
  //  - message zone sits between the bottom of "Loved" (~71%) and the
  //    heart divider (~81%), spanning the same width as the two guide lines.
  //  - recipient zone sits on the blank line right after the baked
  //    "For" label (~45%–73% width, ~82.5%–86.5% height).
  const MESSAGE_TOP    = '71.5%';
  const MESSAGE_HEIGHT = '9%';
  const MESSAGE_WIDTH  = '46%';
  const MESSAGE_LEFT   = '27%';

  const RECIPIENT_TOP    = '82.5%';
  const RECIPIENT_HEIGHT = '4%';
  const RECIPIENT_LEFT   = '45%';
  const RECIPIENT_WIDTH  = '28%';

  const msgArea = t.messageArea ?? { width: 210, height: 56, minFontSize: 10, maxFontSize: 26 };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '2 / 3',
        overflow: 'hidden',
        borderRadius: compact ? '10px' : '14px',
        containerType: 'inline-size',
        // The base background colour of the card (shows at edges)
        background: t.bgColor,
      }}
    >

      {/* ══════════════════════════════════════════
          LAYER 1 — User photo inside oval clip
          Sits BELOW the reference frame image
          ══════════════════════════════════════════ */}
      <div
        style={{
          position: 'absolute',
          top: OVAL_TOP,
          left: OVAL_LEFT,
          width: OVAL_WIDTH,
          height: OVAL_HEIGHT,
          // True oval/ellipse (pill shape) — matching the reference card frame
          borderRadius: '50%',
          overflow: 'hidden',
          zIndex: 1,
          background: t.frameColor,
        }}
      >
        {uploadedImage ? (
          <img
            src={uploadedImage}
            alt="user photo"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              // Apply pan/zoom from editor
              transform: `translate(calc(-50% + ${tf.x}px), calc(-50% + ${tf.y}px)) scale(${tf.scale})`,
              transformOrigin: 'center center',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              pointerEvents: 'none',
              userSelect: 'none',
            }}
            draggable={false}
          />
        ) : (
          // Placeholder when no image uploaded
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: 4, background: t.frameColor,
          }}>
            <span style={{ fontSize: 'clamp(20px, 6cqw, 36px)', opacity: 0.2 }}>📷</span>
            <span style={{
              fontFamily: 'Lora, serif',
              fontSize: 'clamp(7px, 2cqw, 11px)',
              color: t.accentColor, opacity: 0.45,
            }}>Ảnh của bạn</span>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════
          LAYER 2 — Reference frame image
          - mix-blend-mode: multiply makes the
            ivory/cream oval interior transparent
            → reveals the user photo below
          - This image already contains the fixed
            "YOU ARE Loved", the two guide lines, the
            heart divider, the "For" label, and the
            "arFÜM" branding baked in. Those are NOT
            re-rendered anywhere else in this component
            (see Layers 3 & 4 below) to avoid duplicating
            them.
          ══════════════════════════════════════════ */}
      <img
        src={t.backgroundAsset}
        alt=""
        aria-hidden
        style={{
          position: 'absolute',
          top: 0, left: 0,
          width: '100%', height: '100%',
          objectFit: 'cover',
          mixBlendMode: 'multiply',
          zIndex: 2,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      />

      {/* ══════════════════════════════════════════
          LAYER 3 — Personal message
          The only fixed text ("YOU ARE", "Loved", the
          two guide lines) comes from the template art
          itself — rendered once, here, only when there
          IS a message to show, positioned to sit exactly
          between the template's two guide lines.
          ══════════════════════════════════════════ */}
      {message && (
        <div
          style={{
            position: 'absolute',
            top: MESSAGE_TOP,
            left: MESSAGE_LEFT,
            width: MESSAGE_WIDTH,
            height: MESSAGE_HEIGHT,
            zIndex: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CardTextRenderer
            message={message}
            width={msgArea.width}
            height={msgArea.height}
            minFontSize={msgArea.minFontSize}
            maxFontSize={msgArea.maxFontSize}
            fontFamily="'Dancing Script', cursive"
            color={t.scriptColor}
            lineHeight={1.35}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      )}

      {/* ══════════════════════════════════════════
          LAYER 4 — Recipient name only
          The "For" label itself is already baked into
          the template art directly to the left of this
          box — we only render the name, so "For" is
          never duplicated.
          ══════════════════════════════════════════ */}
      {recipient && (
        <div
          style={{
            position: 'absolute',
            top: RECIPIENT_TOP,
            left: RECIPIENT_LEFT,
            width: RECIPIENT_WIDTH,
            height: RECIPIENT_HEIGHT,
            zIndex: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            overflow: 'hidden',
          }}
        >
          <p style={{
            fontFamily: 'Playfair Display, serif',
            fontStyle: 'italic',
            fontSize: 'clamp(7px, 2.2cqw, 13px)',
            color: t.titleColor,
            margin: 0,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>{recipient}</p>
        </div>
      )}

    </div>
  );
}