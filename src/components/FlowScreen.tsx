import { useState, useRef } from 'react';
import { GoldDivider, SmallBlossom } from './BlossomDecor';
import CardTemplateComponent from './CardTemplate';
import PhotoEditor, { type ImageTransform } from './PhotoEditor';
import MessageStep from './MessageStep';
import { selectTemplate } from '../data/templates';
import type { PreAnswers } from '../App';
import { downloadCardAsPng } from '../lib/cardExport';

// ── Step types ──
type Step = 'quiz' | 'message' | 'upload' | 'imageAdjust' | 'generating' | 'preview' | 'done';

// Displayed option labels (Vietnamese, shown in UI)
const questionLabels = [
  {
    q: 'Bạn muốn gửi thiệp cho ai?',
    options: ['Ba 👨', 'Mẹ 👩', 'Vợ 👰', 'Chồng 🤵', 'Con cái 👶', 'Ông 👴', 'Bà 👵', 'Người thân 👨‍👩‍👧','Bạn bè 👥'],
  },
  {
    q: 'Cảm xúc bạn muốn gửi gắm là gì?',
    options: ['❤️ Yêu thương & ấm áp', '🙏 Biết ơn & trân trọng', '✨ Vui vẻ & hạnh phúc', '🌸 Hoài niệm & kỷ niệm'],
  },
  {
    q: 'Kỷ niệm nào bạn muốn nhắc đến?',
    options: ['Những bữa cơm gia đình 🍜', 'Chuyến du lịch cùng nhau ✈️', 'Khoảnh khắc đặc biệt 🎉', 'Tình yêu hàng ngày 🌿'],
  },
];

function findMatchingOption(options: string[], label: string | undefined): string | null {
  if (!label) return null;
  return options.find(o =>
    o === label ||
    o.toLowerCase().startsWith(label.toLowerCase().split(' ')[0]) ||
    label.toLowerCase().includes(o.split(' ')[0].toLowerCase())
  ) ?? null;
}

interface FlowScreenProps {
  onBack: () => void;
  preAnswers?: PreAnswers;
}

export default function FlowScreen({ onBack, preAnswers = {} }: FlowScreenProps) {
  // ── Compute initial state from preAnswers ──
  const buildInitialState = () => {
    const initialAnswers: string[] = [];
    let startIndex = 0;
    const q0Match = findMatchingOption(questionLabels[0].options, preAnswers.recipient);
    if (q0Match) { initialAnswers[0] = q0Match; startIndex = 1; }
    const q1Match = findMatchingOption(questionLabels[1].options, preAnswers.emotion);
    if (q1Match) {
      initialAnswers[1] = q1Match;
      if (initialAnswers[0]) { startIndex = 2; } else { startIndex = 0; }
    }
    const allPreFilled = !!(initialAnswers[0] && initialAnswers[1]);
    return {
      initialAnswers,
      qIdx: allPreFilled ? 2 : startIndex,
      initialStep: (allPreFilled ? 'quiz' : 'quiz') as Step,
    };
  };

  const { initialAnswers, qIdx, initialStep } = buildInitialState();

  // ── State ──
  const [step, setStep] = useState<Step>(initialStep);
  const [qIndex, setQIndex] = useState(qIdx);
  const [answers, setAnswers] = useState<string[]>(initialAnswers);
  const [selectedOption, setSelectedOption] = useState<string | null>(initialAnswers[qIdx] ?? null);
  const [message, setMessage] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageTransform, setImageTransform] = useState<ImageTransform>({ x: 0, y: 0, scale: 1 });
  const [progress, setProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // ── Derived template from answers ──
  const emotionAnswer = answers[1] ?? '';
  const recipientAnswer = answers[0] ?? '';
  const template = selectTemplate(emotionAnswer, recipientAnswer);

  // ── Step numbers for progress bar ──
  const stepNum =
    step === 'quiz' ? qIndex + 1 :
    step === 'message' ? 4 :
    step === 'upload' ? 5 :
    step === 'imageAdjust' ? 6 :
    step === 'generating' ? 7 : 8;
  const totalSteps = 8;

  // ── Handlers ──
  const handleNext = () => {
    if (!selectedOption) return;
    const newAnswers = [...answers];
    newAnswers[qIndex] = selectedOption;
    setAnswers(newAnswers);
    setSelectedOption(null);

    if (qIndex < questionLabels.length - 1) {
      let nextIdx = qIndex + 1;
      while (nextIdx < questionLabels.length && newAnswers[nextIdx]) nextIdx++;
      if (nextIdx < questionLabels.length) {
        setQIndex(nextIdx);
        setSelectedOption(newAnswers[nextIdx] ?? null);
      } else {
        setStep('message');
      }
    } else {
      setStep('message');
    }
  };

  const handleMessageNext = (msg: string) => {
    setMessage(msg);
    setStep('upload');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedImage(url);
      setImageTransform({ x: 0, y: 0, scale: 1 });
      setStep('imageAdjust');
    }
  };

  const handleConfirmImage = (transform: ImageTransform) => {
    setImageTransform(transform);
    handleGenerate();
  };

  const handleGenerate = () => {
    setStep('generating');
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); setStep('preview'); return 100; }
        return p + Math.random() * 14;
      });
    }, 200);
  };

  // Short recipient name for card "For ___"
  const shortRecipient = recipientAnswer.split(' ')[0].replace(/[👨👩👰🤵👶👴👵👥👨‍👩‍👧]/gu, '').trim();

  // ── Final PNG export (Canvas-based, mirrors CardGenerator.jsx techniques) ──
  const handleDownload = async () => {
    setIsExporting(true);
    setExportError(null);
    try {
      await downloadCardAsPng({
        template,
        uploadedImageSrc: uploadedImage,
        imageTransform,
        message,
        recipient: shortRecipient,
      });
      setStep('done');
    } catch (err) {
      setExportError('Không thể tạo file ảnh. Vui lòng thử lại.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FAF6F0' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid #BFA06A22' }}>
        <button onClick={onBack} className="flex items-center gap-2 font-body text-sm transition-opacity hover:opacity-70" style={{ color: '#8C7070' }}>
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
            <path fillRule="evenodd" d="M15 8a.5.5 0 00-.5-.5H2.707l3.147-3.146a.5.5 0 10-.708-.708l-4 4a.5.5 0 000 .708l4 4a.5.5 0 00.708-.708L2.707 8.5H14.5A.5.5 0 0015 8z" />
          </svg>
          Quay lại
        </button>
        <div className="flex items-center gap-2">
          <img src="/arfum-logo.png" alt="Arfum" className="w-8 h-8 object-contain" />
          <span className="font-display text-sm font-semibold" style={{ color: '#5C1A24' }}>ərFÜM</span>
        </div>
        <div className="w-16" />
      </div>

      {/* Progress bar */}
      <div className="h-0.5 w-full" style={{ background: '#E8C4C0' }}>
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${(stepNum / totalSteps) * 100}%`, background: 'linear-gradient(to right, #C9968A, #BFA06A)' }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-lg">

          {/* ── QUIZ ── */}
          {step === 'quiz' && (
            <div key={qIndex} style={{ animation: 'fadeUp 0.5s ease forwards' }}>
              <SmallBlossom className="w-12 h-12 mx-auto mb-6 opacity-50" />
              <p className="font-body text-xs text-center mb-3 tracking-widest uppercase" style={{ color: '#BFA06A' }}>
                Câu hỏi {qIndex + 1} / {questionLabels.length}
              </p>
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-center mb-8" style={{ color: '#5C1A24' }}>
                {questionLabels[qIndex].q}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                {questionLabels[qIndex].options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedOption(option)}
                    className="p-4 rounded-2xl text-left font-body text-sm transition-all duration-200"
                    style={{
                      background: selectedOption === option ? '#5C1A2412' : '#FDF9F4',
                      border: selectedOption === option ? '1.5px solid #5C1A24' : '1.5px solid #BFA06A33',
                      color: selectedOption === option ? '#5C1A24' : '#5C5050',
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <button
                onClick={handleNext}
                disabled={!selectedOption}
                className="w-full py-4 rounded-full font-body text-base transition-all duration-300"
                style={{
                  background: selectedOption ? '#5C1A24' : '#E8C4C0',
                  color: selectedOption ? '#FAF6F0' : '#C9968A',
                  cursor: selectedOption ? 'pointer' : 'not-allowed',
                }}
              >
                {qIndex < questionLabels.length - 1 ? 'Tiếp theo →' : 'Viết lời nhắn →'}
              </button>
            </div>
          )}

          {/* ── MESSAGE STEP ── */}
          {step === 'message' && (
            <MessageStep
              initial={message}
              onNext={handleMessageNext}
              onBack={() => {
                setQIndex(questionLabels.length - 1);
                setSelectedOption(answers[questionLabels.length - 1] ?? null);
                setStep('quiz');
              }}
            />
          )}

          {/* ── UPLOAD ── */}
          {step === 'upload' && (
            <div style={{ animation: 'fadeUp 0.5s ease forwards' }}>
              <SmallBlossom className="w-12 h-12 mx-auto mb-6 opacity-50" />
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-center mb-3" style={{ color: '#5C1A24' }}>
                Tải ảnh của bạn lên
              </h2>
              <p className="font-body text-sm text-center mb-4" style={{ color: '#8C7070' }}>
                Ảnh gia đình, kỷ niệm, hoặc ảnh bạn yêu thích.
              </p>

              {/* Template preview */}
              <div className="flex justify-center mb-6">
                <div style={{ width: 200, height: 270, overflow: 'hidden', borderRadius: 12, boxShadow: '0 4px 20px rgba(92,26,36,0.12)' }}>
                  <div style={{ transform: 'scale(0.435)', transformOrigin: 'top left', width: 460, height: 640, pointerEvents: 'none' }}>
                    <CardTemplateComponent
                      template={template}
                      uploadedImage={null}
                      imageTransform={{ x: 0, y: 0, scale: 1 }}
                      message={message}
                      recipient={shortRecipient}
                    />
                  </div>
                </div>
              </div>
              <p className="font-body text-xs text-center mb-6" style={{ color: '#BFA06A' }}>
                Mẫu thiệp: {template.name}
              </p>

              <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              <div
                onClick={() => fileRef.current?.click()}
                className="relative cursor-pointer rounded-3xl flex flex-col items-center justify-center gap-4 mb-6 transition-all duration-300 hover:shadow-lg"
                style={{ height: '160px', border: '2px dashed #BFA06A55', background: '#FDF9F4' }}
              >
                <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: '#E8C4C0' }}>
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                    <path d="M12 16V4M12 4L8 8M12 4L16 8" stroke="#5C1A24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M3 16v2a2 2 0 002 2h14a2 2 0 002-2v-2" stroke="#C9968A" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <p className="font-body text-sm" style={{ color: '#5C5050' }}>Nhấn để chọn ảnh</p>
                <p className="font-body text-xs" style={{ color: '#8C7070' }}>JPG, PNG — tối đa 10MB</p>
              </div>

              <button
                onClick={() => handleGenerate()}
                className="w-full py-3 rounded-full font-body text-sm border transition-all duration-300 mb-3"
                style={{ border: '1px solid #BFA06A44', color: '#8C7070', background: 'transparent' }}
              >
                Bỏ qua · Không thêm ảnh
              </button>
              <button
                onClick={() => setStep('message')}
                className="w-full py-3 rounded-full font-body text-sm border transition-all duration-300"
                style={{ border: '1px solid #BFA06A22', color: '#8C7070', background: 'transparent' }}
              >
                ← Quay lại lời nhắn
              </button>
            </div>
          )}

          {/* ── IMAGE ADJUST ── */}
          {step === 'imageAdjust' && uploadedImage && (
            <PhotoEditor
              template={template}
              uploadedImage={uploadedImage}
              message={message}
              recipient={shortRecipient}
              onConfirm={handleConfirmImage}
              onBack={() => setStep('upload')}
            />
          )}

          {/* ── GENERATING ── */}
          {step === 'generating' && (
            <div className="text-center" style={{ animation: 'fadeUp 0.5s ease forwards' }}>
              <div className="relative w-32 h-32 mx-auto mb-8">
                <svg className="w-full h-full" viewBox="0 0 128 128">
                  <circle cx="64" cy="64" r="56" stroke="#E8C4C0" strokeWidth="2" fill="none" />
                  <circle
                    cx="64" cy="64" r="56"
                    stroke="#BFA06A" strokeWidth="2" fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - Math.min(progress, 100) / 100)}`}
                    strokeLinecap="round"
                    transform="rotate(-90 64 64)"
                    style={{ transition: 'stroke-dashoffset 0.3s ease' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display text-2xl font-semibold" style={{ color: '#5C1A24' }}>
                    {Math.min(Math.round(progress), 100)}%
                  </span>
                </div>
              </div>
              <h2 className="font-display text-2xl font-semibold mb-3" style={{ color: '#5C1A24' }}>Đang tạo thiệp...</h2>
              <p className="font-body text-sm" style={{ color: '#8C7070' }}>
                {progress < 30 ? 'Chọn mẫu thiệp phù hợp...' :
                  progress < 60 ? 'Sắp xếp bố cục và màu sắc...' :
                  progress < 85 ? 'Đặt lời nhắn vào thiệp...' :
                  'Hoàn thiện thiệp...'}
              </p>
            </div>
          )}

          {/* ── PREVIEW ── */}
          {step === 'preview' && (
            <div style={{ animation: 'fadeUp 0.5s ease forwards' }}>
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-center mb-2" style={{ color: '#5C1A24' }}>
                Thiệp của bạn đã sẵn sàng!
              </h2>
              <p className="font-body text-sm text-center mb-6" style={{ color: '#8C7070' }}>
                Nhấn tải về hoặc chia sẻ trực tiếp
              </p>

              {/* Full card preview */}
              <div className="flex justify-center mb-6">
                <div style={{
                  width: 280, height: Math.round(280 * 640 / 460),
                  overflow: 'hidden', borderRadius: 16,
                  boxShadow: '0 12px 40px rgba(92,26,36,0.2)',
                  border: '1px solid #BFA06A44',
                }}>
                  <div style={{ transform: `scale(${280 / 460})`, transformOrigin: 'top left', width: 460, height: 640 }}>
                    <CardTemplateComponent
                      template={template}
                      uploadedImage={uploadedImage}
                      imageTransform={imageTransform}
                      message={message}
                      recipient={shortRecipient}
                    />
                  </div>
                </div>
              </div>

              <p className="font-body text-xs text-center mb-6" style={{ color: '#BFA06A' }}>
                Mẫu: {template.name}
              </p>

              {exportError && (
                <p className="font-body text-xs text-center mb-3" style={{ color: '#C9968A' }}>{exportError}</p>
              )}
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleDownload}
                  disabled={isExporting}
                  className="w-full py-4 rounded-full font-body text-base transition-all duration-300 hover:shadow-xl hover:scale-105"
                  style={{ background: '#5C1A24', color: '#FAF6F0', opacity: isExporting ? 0.7 : 1 }}
                >
                  {isExporting ? 'Đang tạo ảnh…' : '⬇ Tải thiệp về'}
                </button>
                <button
                  onClick={handleDownload}
                  disabled={isExporting}
                  className="w-full py-4 rounded-full font-body text-base border transition-all duration-300 hover:scale-105"
                  style={{ border: '1.5px solid #5C1A2444', color: '#5C1A24', background: 'transparent' }}
                >
                  ↗ Chia sẻ thiệp
                </button>
              </div>
            </div>
          )}

          {/* ── DONE ── */}
          {step === 'done' && (
            <div className="text-center" style={{ animation: 'fadeUp 0.5s ease forwards' }}>
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: '#E8C4C0' }}>
                <span className="text-3xl">🌸</span>
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-semibold mb-3" style={{ color: '#5C1A24' }}>
                Hoàn tất! Chúc mừng năm mới!
              </h2>
              <GoldDivider className="w-40 mx-auto my-6" />
              <p className="font-body text-sm mb-8" style={{ color: '#8C7070' }}>
                Thiệp của bạn đã được lưu. Đây là voucher ưu đãi dành riêng cho bạn:
              </p>
              <div className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl mb-8" style={{ background: '#5C1A24' }}>
                <div>
                  <p className="font-body text-xs mb-1" style={{ color: '#E8C4C0' }}>Mã ưu đãi của bạn</p>
                  <p className="font-display text-xl font-bold tracking-widest" style={{ color: '#BFA06A' }}>HUONGTET2027</p>
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText('HUONGTET2027')}
                  className="px-3 py-2 rounded-lg font-body text-xs"
                  style={{ background: '#BFA06A22', border: '1px solid #BFA06A55', color: '#BFA06A' }}
                >
                  Sao chép
                </button>
              </div>
              <div>
                <button onClick={onBack} className="font-body text-sm underline-offset-4 hover:underline" style={{ color: '#8C7070' }}>
                  Tạo thêm thiệp khác
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
