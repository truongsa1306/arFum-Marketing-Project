import { useState } from 'react';
import Hero from './components/Hero';
import Story from './components/Story';
import HowItWorks from './components/HowItWorks';
import QuizPreview from './components/QuizPreview';
import FinalCTA from './components/FinalCTA';
import VoucherSection from './components/VoucherSection';
import FlowScreen from './components/FlowScreen';
import { RibbonWave } from './components/BlossomDecor';

export type PreAnswers = {
  recipient?: string;
  emotion?: string;
};

export default function App() {
  const [inFlow, setInFlow] = useState(false);
  const [preAnswers, setPreAnswers] = useState<PreAnswers>({});

  const handleStartWithAnswers = (answers: PreAnswers) => {
    setPreAnswers(answers);
    setInFlow(true);
  };

  const handleBack = () => {
    setInFlow(false);
    setPreAnswers({});
  };

  if (inFlow) {
    return <FlowScreen onBack={handleBack} preAnswers={preAnswers} />;
  }

  return (
    <div className="min-w-0 overflow-x-hidden" style={{ maxWidth: '1440px', margin: '0 auto' }}>
      <Hero onStart={() => handleStartWithAnswers({})} />

      <div className="relative" style={{ background: '#FDF9F4' }}>
        <RibbonWave className="absolute top-0 left-0 right-0 w-full" fill="#FAF6F0" />
        <Story />
      </div>

      <div className="relative">
        <RibbonWave className="absolute top-0 left-0 right-0 w-full" fill="#FDF9F4" />
        <HowItWorks />
      </div>

      <QuizPreview onStart={handleStartWithAnswers} />

      <FinalCTA onStart={() => handleStartWithAnswers({})} />

      <VoucherSection />

      {/* Footer */}
      <footer className="py-12 px-8 md:px-16 text-center" style={{ background: '#2D1818' }}>
        <div className="flex items-center justify-center gap-3 mb-4">
          <img src="/arfum-logo.png" alt="Arfum" className="w-12 h-12 object-contain brightness-90" />
          <div className="text-left">
            <p className="font-display text-base font-semibold" style={{ color: '#E8C4C0' }}>ərFÜM</p>
            <p className="font-body text-xs" style={{ color: '#8C7070' }}>Love That Stays.</p>
          </div>
        </div>
        <p className="font-body text-xs mb-2" style={{ color: '#8C7070' }}>Thương nhau từ những điều "thường" nhất — Xuân Đinh Mùi 2027</p>
        <p className="font-body text-xs" style={{ color: '#5C5050' }}>© 2027 ərFÜM. Được tạo ra với tình yêu.</p>
      </footer>
    </div>
  );
}
