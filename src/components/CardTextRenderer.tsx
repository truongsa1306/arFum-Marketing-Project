import { useEffect, useRef } from 'react';

interface CardTextRendererProps {
  message: string;
  width: number;
  height: number;
  fontFamily: string;
  minFontSize: number;
  maxFontSize: number;
  color: string;
  lineHeight?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function CardTextRenderer(props: CardTextRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high-DPI (Retina) displays to keep text sharp
    const dpr = window.devicePixelRatio || 1;
    canvas.width = props.width * dpr;
    canvas.height = props.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, props.width, props.height);

    if (!props.message) return;

    const lh = props.lineHeight || 1.35;
    let bestSize = props.minFontSize;
    let bestLines: string[] = [];

    // Binary/Linear search for the optimal font size that fits the bounding box
    for (let size = props.maxFontSize; size >= props.minFontSize; size--) {
      ctx.font = `700 ${size}px ${props.fontFamily}`; // Match script weight
      const words = props.message.split(/\s+/);
      let currentLine = '';
      const lines: string[] = [];

      // Word wrapping logic
      for (let i = 0; i < words.length; i++) {
        const testLine = currentLine + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > props.width && i > 0) {
          lines.push(currentLine.trim());
          currentLine = words[i] + ' ';
        } else {
          currentLine = testLine;
        }
      }
      lines.push(currentLine.trim());

      const totalHeight = lines.length * (size * lh);
      if (totalHeight <= props.height) {
        bestSize = size;
        bestLines = lines;
        break;
      }
    }

    // Render the optimal fitted text
    ctx.font = `700 ${bestSize}px ${props.fontFamily}`;
    ctx.fillStyle = props.color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const totalRenderHeight = bestLines.length * (bestSize * lh);
    // Calculate starting Y to perfectly center the text block vertically
    let startY = (props.height - totalRenderHeight) / 2 + bestSize / 2;

    bestLines.forEach((line) => {
      ctx.fillText(line, props.width / 2, startY);
      startY += bestSize * lh;
    });

  }, [props]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: props.width,
        height: props.height,
        display: 'block',
        ...props.style,
      }}
      className={props.className}
    />
  );
}
