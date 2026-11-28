import React from 'react';
import { TemplateGallery } from '../components/TemplateGallery';

interface TemplatesPageProps {
  activeTemplate: 'editorial' | 'compact' | 'classic';
  onSelectTemplate: (id: string) => void;
}

export const TemplatesPage: React.FC<TemplatesPageProps> = ({
  activeTemplate,
  onSelectTemplate
}) => {
  return (
    <div className="space-y-12 sm:space-y-16">
      <div className="prose prose-ink max-w-3xl">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[var(--ink-solid)] mb-4">
          Template Gallery
        </h1>
        <p className="text-[var(--ink-muted)] leading-relaxed">
          Choose from our curated collection of ATS-optimized resume templates.
          Each template is designed with editorial precision — warm paper textures,
          ink-inspired typography, and layouts that respect both human readers and
          parsing algorithms.
        </p>
      </div>

      {/* Section 7: Architectural Templates Gallery with Hover Previews */}
      <TemplateGallery
        activeTemplateId={activeTemplate}
        onSelectTemplate={onSelectTemplate}
      />
    </div>
  );
};