import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Quote, Check, ArrowRight } from 'lucide-react';

export const SocialProofAndFaq: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const testimonials = [
    {
      quote: "Most resume builders turn your experience into marketing soup. Resume Synth forced me to identify the actual latency drops and throughput metrics from my Docker cluster. Got past Stripe's initial recruiter screen in 48 hours.",
      author: "Elena Rostova",
      role: "Staff Infrastructure Engineer",
      firm: "Ex-Fintech Lead"
    },
    {
      quote: "Recruiters spend 6 seconds reading a resume. If they don't see exact tool names and quantified outcomes, you're out. The side-by-side gap matrix showed 5 key tools I had used but forgot to list.",
      author: "Marcus Vance",
      role: "Senior Full-Stack Architect",
      firm: "SaaS Series B"
    }
  ];

  const faqs = [
    {
      q: "Why doesn't this use generic AI auto-generation?",
      a: "Because hiring managers and ATS filters penalize AI boilerplate. Hallucinated accomplishments and buzzwords like 'spearheaded strategic synergy' get rejected in technical interviews. Resume Synth focuses on evidence grounding: proving what you actually engineered."
    },
    {
      q: "How does the ATS scoring algorithm work?",
      a: "We compute an exact weighted cosine vector between the requirements stated in the job post and the tokenized evidence in your resume text. It tracks hard tools, system scale indicators, and action verbs."
    },
    {
      q: "Will my resume data be trained on or uploaded to third-party models?",
      a: "No. Everything runs strictly in your browser environment or local machine. Your drafts, career histories, and employer specifics stay private."
    },
    {
      q: "What formatting does the PDF export use?",
      a: "It adheres strictly to single-column, standard margin, machine-parseable PDF typesetting. No multi-column layout glitches, icons in place of words, or inaccessible text boxes that choke Workday or Taleo parsers."
    }
  ];

  return (
    <section aria-labelledby="editorial-faq-heading" className="space-y-12 mb-16">
      
      {/* Testimonials as Monospaced Field Notes */}
      <div className="border paper-border paper-surface p-6 sm:p-8">
        <div className="border-b paper-border pb-3 mb-6">
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--vermilion)] font-bold">
            Field Dispatches
          </span>
          <h2 className="font-serif text-2xl font-bold text-[var(--ink-solid)] mt-0.5">
            Observations from Technical Screenings
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t, idx) => (
            <div key={idx} className="border-l-2 border-[var(--ink-solid)] pl-4 space-y-3">
              <Quote className="w-5 h-5 text-[var(--vermilion)] opacity-60" />
              <p className="font-serif italic text-sm text-[var(--ink-solid)] leading-relaxed">
                "{t.quote}"
              </p>
              <div className="font-mono text-xs text-[var(--ink-muted)] pt-1">
                <span className="font-bold text-[var(--ink-solid)]">{t.author}</span> · {t.role} ({t.firm})
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Accordion Ledger */}
      <div className="border paper-border paper-surface p-6 sm:p-8">
        <div className="border-b paper-border pb-3 mb-6">
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--vermilion)] font-bold">
            Inquiries & Principles
          </span>
          <h2 id="editorial-faq-heading" className="font-serif text-2xl font-bold text-[var(--ink-solid)] mt-0.5">
            Frequently Addressed Questions
          </h2>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="border paper-border paper-surface">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 flex items-center justify-between text-left font-serif text-sm font-bold text-[var(--ink-solid)] hover:bg-[var(--paper-subtle)] cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-[var(--vermilion)]" /> : <ChevronDown className="w-4 h-4 text-[var(--ink-faint)]" />}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 font-sans text-xs text-[var(--ink-muted)] leading-relaxed border-t paper-border">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Editorial Footer with Distinct Personality */}
      <footer className="border-t-2 border-[var(--ink-solid)] pt-8 pb-12 flex flex-col sm:flex-row items-baseline justify-between gap-6 font-mono text-xs text-[var(--ink-muted)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[var(--ink-solid)] font-serif text-base font-bold">
            <span className="w-2 h-2 rounded-full bg-[var(--vermilion)]"></span>
            Resume Synth
          </div>
          <p>Typeset with mathematical precision for discerning hiring directors.</p>
        </div>

        <div className="flex flex-wrap gap-6 text-xs">
          <span>Single-Column ATS Spec</span>
          <span>•</span>
          <span>Zero Dark Patterns</span>
          <span>•</span>
          <span>Private Local Execution</span>
        </div>
      </footer>

    </section>
  );
};
