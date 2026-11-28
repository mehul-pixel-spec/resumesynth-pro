import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { SocialProofAndFaq } from '../components/SocialProofAndFaq';
import { PRESETS } from '../data/presets';

interface HomePageProps {
  selectedPresetId: string;
  onSelectPreset: (presetId: string) => void;
  score: number;
  onOpenSignUp: () => void;
  showHowItWorks: boolean;
  onToggleHowItWorks: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  selectedPresetId,
  onSelectPreset,
  score,
  onOpenSignUp,
  showHowItWorks,
  onToggleHowItWorks
}) => {
  return (
    <div className="space-y-12 sm:space-y-16">
      {/* Section 1: Hero & Real-Time Proof Specimen with CTA */}
      <HeroSection
        selectedPreset={selectedPresetId}
        onSelectPreset={onSelectPreset}
        showHowItWorks={showHowItWorks}
        onToggleHowItWorks={onToggleHowItWorks}
        score={score}
        onOpenSignUp={onOpenSignUp}
      />

      {/* Section 2: Social Proof & FAQ */}
      <SocialProofAndFaq />
    </div>
  );
};