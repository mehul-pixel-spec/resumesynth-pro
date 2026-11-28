import {
  TemplateAuditResult,
  TemplateAuditIssue,
  TemplateAuditCategory,
  TemplateAuditSeverity,
  TemplateAuditConfidence,
  TemplateAuditActionability,
  TemplateAuditCategoryScore,
  UploadedResumeTemplate,
} from '../types';

// Standard ATS-friendly section headings
const STANDARD_SECTIONS = [
  'summary',
  'objective',
  'profile',
  'experience',
  'work experience',
  'employment history',
  'professional experience',
  'education',
  'skills',
  'technical skills',
  'core competencies',
  'projects',
  'certifications',
  'awards',
  'publications',
  'volunteer',
  'leadership',
];

const CONTACT_PATTERNS = {
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/,
  phone: /\b(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/,
  linkedin: /linkedin\.com\/in\/[A-Za-z0-9\-_]+/i,
  github: /github\.com\/[A-Za-z0-9\-_]+/i,
  website: /\b(?:https?:\/\/)?(?:www\.)?[A-Za-z0-9\-]+\.[A-Za-z]{2,}(?:\/[^\s]*)?\b/i,
};

const SECTION_KEYWORDS: Record<TemplateAuditCategory, string[]> = {
  parsing_safety: [],
  content_structure: [],
  section_detection: [...STANDARD_SECTIONS],
  role_alignment: [],
  market_readiness: [],
  contact_info: ['email', 'phone', 'linkedin'],
  formatting_quality: [],
};

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[+/#.-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractTextFromFile(file: File): Promise<{
  text: string;
  method: 'direct' | 'mammoth' | 'pdfjs' | 'failed' | 'manual';
  note?: string;
}> {
  return new Promise((resolve) => {
    const format = file.name.split('.').pop()?.toLowerCase() as 'pdf' | 'docx' | 'txt' | 'md';

    if (format === 'txt' || format === 'md') {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({ text: e.target?.result as string, method: 'direct' });
      };
      reader.onerror = () => {
        resolve({ text: '', method: 'failed', note: 'Failed to read text file' });
      };
      reader.readAsText(file);
      return;
    }

    if (format === 'docx') {
      import('mammoth')
        .then(({ extractRawText }) => {
          const reader = new FileReader();
          reader.onload = async (e) => {
            try {
              const arrayBuffer = e.target?.result as ArrayBuffer;
              const result = await extractRawText({ arrayBuffer });
              resolve({
                text: result.value,
                method: 'mammoth',
                note: result.messages.length > 0 ? result.messages.map((m) => m.message).join('; ') : undefined,
              });
            } catch (err) {
              resolve({ text: '', method: 'failed', note: 'DOCX parsing failed' });
            }
          };
          reader.onerror = () => {
            resolve({ text: '', method: 'failed', note: 'Failed to read DOCX file' });
          };
          reader.readAsArrayBuffer(file);
        })
        .catch(() => {
          resolve({ text: '', method: 'failed', note: 'Failed to load DOCX parser' });
        });
      return;
    }

    if (format === 'pdf') {
      // Use pdfjs-dist
      import('pdfjs-dist')
        .then((pdfjsLib) => {
          // Configure worker
          pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

          const reader = new FileReader();
          reader.onload = async (e) => {
            try {
              const arrayBuffer = e.target?.result as ArrayBuffer;
              const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
              let fullText = '';

              for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                const pageText = content.items
                  .map((item: any) => ('str' in item ? item.str : ''))
                  .join(' ');
                fullText += pageText + '\n';
              }

              if (fullText.trim().length < 50) {
                resolve({
                  text: fullText,
                  method: 'pdfjs',
                  note: 'Warning: Very little text extracted. PDF may be image-based or have complex layout.',
                });
              } else {
                resolve({ text: fullText, method: 'pdfjs' });
              }
            } catch (err) {
              resolve({ text: '', method: 'failed', note: 'PDF parsing failed' });
            }
          };
          reader.onerror = () => {
            resolve({ text: '', method: 'failed', note: 'Failed to read PDF file' });
          };
          reader.readAsArrayBuffer(file);
        })
        .catch(() => {
          resolve({ text: '', method: 'failed', note: 'Failed to load PDF parser' });
        });
      return;
    }

    resolve({ text: '', method: 'failed', note: 'Unsupported file format' });
  });
}

function detectSections(text: string): { detected: string[]; missing: string[] } {
  const normalized = normalizeText(text);
  const detected: string[] = [];

  STANDARD_SECTIONS.forEach((section) => {
    const regex = new RegExp(`\\b${section.replace(/\s+/g, '\\s+')}\\b`, 'i');
    if (regex.test(normalized) || text.toLowerCase().includes(section.toLowerCase())) {
      detected.push(section);
    }
  });

  const missing = STANDARD_SECTIONS.filter((s) => !detected.includes(s));

  return { detected, missing };
}

function checkContactInfo(text: string): {
  found: string[];
  missing: string[];
  evidence: Record<string, string>;
} {
  const found: string[] = [];
  const missing: string[] = [];
  const evidence: Record<string, string> = {};

  Object.entries(CONTACT_PATTERNS).forEach(([key, pattern]) => {
    const match = text.match(pattern);
    if (match) {
      found.push(key);
      evidence[key] = match[0];
    } else {
      missing.push(key);
    }
  });

  return { found, missing, evidence };
}

function checkParsingSafety(text: string, method: string): TemplateAuditIssue[] {
  const issues: TemplateAuditIssue[] = [];

  // Check extraction quality
  const wordCount = text.trim().split(/\s+/).length;
  if (method === 'failed') {
    issues.push({
      id: 'extraction-failed',
      severity: 'high',
      category: 'parsing_safety',
      title: 'Text Extraction Failed',
      evidence: 'The file could not be parsed. Content may be image-based, encrypted, or corrupted.',
      recommendation: 'Paste resume content manually using the text input below.',
      rationale: 'ATS systems cannot parse text from unreadable files. Manual entry ensures your content is analyzed.',
      actionability: 'needs_user_input',
      confidence: 'high',
    });
    return issues;
  }

  if (wordCount < 50) {
    issues.push({
      id: 'low-extraction-quality',
      severity: 'high',
      category: 'parsing_safety',
      title: 'Very Little Text Extracted',
      evidence: `Only ${wordCount} words extracted from the document.`,
      recommendation: 'Verify the file is not image-only. Consider pasting text manually for accurate analysis.',
      rationale: 'Image-based PDFs or complex layouts often yield poor extraction. ATS parsers face the same limitation.',
      actionability: 'needs_user_input',
      confidence: 'high',
    });
  }

  // Check for potential multi-column/table indicators
  const lineLengths = text.split('\n').map((l) => l.trim().length);
  const avgLineLength = lineLengths.reduce((a, b) => a + b, 0) / Math.max(1, lineLengths.length);
  const shortLineRatio = lineLengths.filter((l) => l < 40).length / Math.max(1, lineLengths.length);

  if (shortLineRatio > 0.5 && avgLineLength < 60) {
    issues.push({
      id: 'possible-multicolumn',
      severity: 'medium',
      category: 'parsing_safety',
      title: 'Possible Multi-Column Layout Detected',
      evidence: 'Many short lines detected, suggesting columns, sidebars, or tables that may confuse ATS parsers.',
      recommendation: 'Use a single-column layout. Move sidebar content to main flow or appendix.',
      rationale: 'ATS parsers typically read top-to-bottom, left-to-right. Columns can scramble section order and content.',
      actionability: 'manual_review',
      confidence: 'medium',
    });
  }

  // Check for excessive decorative characters
  const decorativeChars = (text.match(/[•◆▪▫◇◆■□▲△▼▽★☆♥♡]/g) || []).length;
  const symbolRatio = decorativeChars / Math.max(1, text.length);
  if (symbolRatio > 0.01) {
    issues.push({
      id: 'excessive-decorative-chars',
      severity: 'low',
      category: 'parsing_safety',
      title: 'Excessive Decorative Characters',
      evidence: `${decorativeChars} decorative symbols detected in extracted text.`,
      recommendation: 'Replace decorative bullets with standard dashes (-) or asterisks (*). Remove ornamental characters.',
      rationale: 'Special characters may not render correctly in ATS plain-text conversion.',
      actionability: 'quick_fix',
      confidence: 'medium',
    });
  }

  // Check for headers/footers (repeated content at page boundaries)
  const pages = text.split(/\f|\n\s*\n\s*\n/);
  if (pages.length > 1) {
    const firstLines = pages[0].split('\n').slice(0, 3).join(' ').trim().toLowerCase();
    const lastLines = pages[pages.length - 1].split('\n').slice(-3).join(' ').trim().toLowerCase();
    if (firstLines && firstLines === lastLines && firstLines.length > 20) {
      issues.push({
        id: 'repeated-header-footer',
        severity: 'low',
        category: 'parsing_safety',
        title: 'Repeated Header/Footer Content',
        evidence: 'Similar text appears at top and bottom of pages, suggesting headers/footers.',
        recommendation: 'Remove page headers, footers, and page numbers from the resume body.',
        rationale: 'Repeated header/footer text dilutes keyword density and confuses section detection.',
        actionability: 'quick_fix',
        confidence: 'medium',
      });
    }
  }

  return issues;
}

function checkContentStructure(text: string): TemplateAuditIssue[] {
  const issues: TemplateAuditIssue[] = [];
  const normalized = normalizeText(text);
  const lines = text.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);

  // Check for section ordering
  const { detected } = detectSections(text);
  const sectionOrder = ['summary', 'experience', 'education', 'skills', 'projects'];
  let lastIndex = -1;
  let orderIssues = 0;

  detected.forEach((section) => {
    const idx = sectionOrder.indexOf(section.toLowerCase());
    if (idx !== -1) {
      if (idx < lastIndex) orderIssues++;
      lastIndex = Math.max(lastIndex, idx);
    }
  });

  if (orderIssues > 0) {
    issues.push({
      id: 'section-order',
      severity: 'medium',
      category: 'content_structure',
      title: 'Non-Standard Section Ordering',
      evidence: `Sections appear in an order that may not match recruiter expectations (e.g., Skills before Experience).`,
      recommendation: 'Reorder to: Summary → Experience → Education → Skills → Projects/Certifications.',
      rationale: 'Recruiters scan in a predictable order. Non-standard ordering increases cognitive load and missed content.',
      actionability: 'quick_fix',
      confidence: 'high',
    });
  }

  // Check for missing critical sections
  const criticalSections = ['experience', 'skills', 'education'];
  const missingCritical = criticalSections.filter((s) => !detected.some((d) => d.toLowerCase().includes(s)));

  if (missingCritical.length > 0) {
    issues.push({
      id: 'missing-critical-sections',
      severity: 'high',
      category: 'content_structure',
      title: 'Missing Critical Resume Sections',
      evidence: `The following standard sections were not detected: ${missingCritical.join(', ')}.`,
      recommendation: `Add ${missingCritical.join(', ')} sections with clear headings (## Experience, ## Skills, ## Education).`,
      rationale: 'ATS parsers and recruiters expect these core sections. Missing sections can cause parsing failures.',
      actionability: 'quick_fix',
      confidence: 'high',
    });
  }

  // Check for weak bullet formatting
  const bulletLines = lines.filter(
    (l) => /^[\s]*[-*•]\s+/.test(l) || /^[\s]*\d+[.)]\s+/.test(l)
  );
  const bulletCount = bulletLines.length;
  const weakBullets = bulletLines.filter(
    (l) => !/\b(architected|engineered|spearheaded|developed|built|implemented|optimized|accelerated|slashed|scaled|orchestrated|automated|designed|deployed|streamlined|overhauled|championed|formulated|revamped|integrated|transformed|directed|authored|led|managed|created|delivered|achieved|improved|reduced|increased|decreased)\b/i.test(l)
  );

  if (bulletCount > 0 && weakBullets.length > bulletCount * 0.5) {
    issues.push({
      id: 'weak-bullets',
      severity: 'medium',
      category: 'content_structure',
      title: 'Weak Bullet Point Formatting',
      evidence: `${weakBullets.length} of ${bulletCount} bullets lack strong action verbs at the start.`,
      recommendation: 'Start each bullet with a power action verb (e.g., Engineered, Optimized, Architected, Delivered).',
      rationale: 'Action verbs immediately signal ownership and impact. Weak openings dilute perceived contribution.',
      actionability: 'manual_review',
      confidence: 'high',
    });
  }

  // Check for missing dates/employers in experience
  const expSection = text.toLowerCase().split(/\b(experience|employment|work history)\b/i)[1];
  if (expSection) {
    const datePattern = /\b(19|20)\d{2}\b/;
    const hasDates = datePattern.test(expSection);
    const hasEmployer = /\b(inc|llc|ltd|corp|corporation|company|technologies|systems|solutions|group|labs)\b/i.test(expSection);

    if (!hasDates) {
      issues.push({
        id: 'missing-dates',
        severity: 'high',
        category: 'content_structure',
        title: 'Missing Employment Dates',
        evidence: 'No year patterns (e.g., 2020, 2023) detected in the Experience section.',
        recommendation: 'Add start/end dates (Month Year – Month Year) for each role.',
        rationale: 'Dates establish chronology, tenure, and career progression. ATS filters often require them.',
        actionability: 'quick_fix',
        confidence: 'high',
      });
    }

    if (!hasEmployer && expSection.length > 100) {
      issues.push({
        id: 'missing-employers',
        severity: 'medium',
        category: 'content_structure',
        title: 'Company Names May Be Missing',
        evidence: 'Experience section lacks common company suffixes (Inc, LLC, Corp, Technologies, etc.).',
        recommendation: 'Explicitly list company name for each role.',
        rationale: 'Company names provide context for scale and domain. Recruiters scan for recognizable employers.',
        actionability: 'quick_fix',
        confidence: 'medium',
      });
    }
  }

  // Check for dense text blocks
  const maxParagraphLength = Math.max(...lines.map((l) => l.length));
  if (maxParagraphLength > 200 && bulletCount < 3) {
    issues.push({
      id: 'dense-blocks',
      severity: 'medium',
      category: 'content_structure',
      title: 'Overly Dense Text Blocks',
      evidence: `Longest paragraph is ${maxParagraphLength} characters with few bullet points.`,
      recommendation: 'Break dense paragraphs into concise bullet points (1-2 lines each).',
      rationale: 'Recruiters spend ~6-8 seconds scanning. Dense blocks reduce scannability and key info visibility.',
      actionability: 'manual_review',
      confidence: 'high',
    });
  }

  return issues;
}

function checkRoleAlignment(
  resumeText: string,
  jobDescription: string,
  targetRole: string
): { issues: TemplateAuditIssue[]; score: number; explanation: string } {
  const issues: TemplateAuditIssue[] = [];

  if (!jobDescription.trim()) {
    return {
      issues: [
        {
          id: 'no-jd-role-alignment',
          severity: 'low',
          category: 'role_alignment',
          title: 'No Job Description Provided',
          evidence: 'Role alignment analysis requires a job description to compare against.',
          recommendation: 'Paste a target job description to enable role-specific keyword and requirement analysis.',
          rationale: 'Without a job description, only general best practices can be evaluated.',
          actionability: 'needs_user_input',
          confidence: 'high',
        },
      ],
      score: 50,
      explanation: 'General analysis only. Provide a job description for role-specific recommendations.',
    };
  }

  // Extract JD keywords
  const jdKeywords = extractJobKeywords(jobDescription);
  const resumeNormalized = normalizeText(resumeText);

  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  jdKeywords.forEach((kw) => {
    const normKw = normalizeText(kw);
    if (resumeNormalized.includes(normKw)) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  });

  // High-priority missing keywords
  const highPriorityMissing = missingKeywords.filter(
    (kw) =>
      ['distributed systems', 'microservices', 'sql', 'python', 'kubernetes', 'react', 'golang', 'go', 'pytorch', 'aws'].includes(
        normalizeText(kw)
      )
  );

  if (highPriorityMissing.length > 0) {
    issues.push({
      id: 'missing-high-priority-keywords',
      severity: 'high',
      category: 'role_alignment',
      title: 'Missing High-Priority Job Keywords',
      evidence: `Job description emphasizes: ${highPriorityMissing.slice(0, 5).join(', ')}. These are absent from the uploaded resume.`,
      recommendation: 'Add these keywords only when truthfully supported by your experience. Do not stuff keywords.',
      rationale: 'ATS filters prioritize exact matches from job requirements. Missing core requirements reduces match scores.',
      actionability: 'needs_user_input',
      confidence: 'high',
    });
  }

  // Overall role alignment score
  const totalTerms = Math.max(1, jdKeywords.length);
  const matchRatio = matchedKeywords.length / totalTerms;
  const score = Math.min(100, Math.round(matchRatio * 100));

  let explanation = '';
  if (score >= 80) {
    explanation = 'Strong alignment with job requirements. Most core keywords present.';
  } else if (score >= 60) {
    explanation = 'Moderate alignment. Several key requirements are missing from the resume.';
  } else {
    explanation = 'Low alignment. The resume lacks many core requirements from the job description.';
  }

  return { issues, score, explanation };
}

function checkMarketReadiness(
  text: string,
  jobDescription: string,
  targetRole: string
): { issues: TemplateAuditIssue[]; score: number } {
  const issues: TemplateAuditIssue[] = [];
  const wordCount = text.trim().split(/\s+/).length;

  // General length check
  if (wordCount < 200) {
    issues.push({
      id: 'too-short',
      severity: 'medium',
      category: 'market_readiness',
      title: 'Resume May Be Too Concise',
      evidence: `Only ${wordCount} words detected. Typical professional resumes range 300-600 words.`,
      recommendation: 'Expand experience descriptions with specific technologies, scope, and outcomes.',
      rationale: 'Too-short resumes may signal insufficient experience or fail to provide enough keyword surface area.',
      actionability: 'manual_review',
      confidence: 'medium',
    });
  } else if (wordCount > 900) {
    issues.push({
      id: 'too-long',
      severity: 'low',
      category: 'market_readiness',
      title: 'Resume May Be Too Long',
      evidence: `${wordCount} words detected. Consider condensing to 1-2 pages (300-600 words).`,
      recommendation: 'Prioritize recent/relevant roles. Summarize older positions.',
      rationale: 'Recruiters scan quickly. Excessive length dilutes key achievements and may trigger ATS truncation.',
      actionability: 'manual_review',
      confidence: 'medium',
    });
  }

  // Check for quantified impact
  const metricsPattern = /\b\d+(?:[\d,.]*\s?(?:%|k\b|m\b|x\b|ms\b|sec\b|hours?|users?|records?|requests?|\+|\$|usd)?)\b/gi;
  const metricsFound = text.match(metricsPattern) || [];
  if (metricsFound.length < 3) {
    issues.push({
      id: 'insufficient-metrics',
      severity: 'medium',
      category: 'market_readiness',
      title: 'Insufficient Quantified Impact',
      evidence: `Only ${metricsFound.length} metrics/numbers detected. Market standard: 3+ quantified achievements.`,
      recommendation: 'Add measurable outcomes to bullets (e.g., "reduced latency 40%", "managed $2M budget", "scaled to 100k users").',
      rationale: 'Quantified achievements are the strongest differentiator in technical hiring. They validate scope and impact.',
      actionability: 'manual_review',
      confidence: 'high',
    });
  }

  // Check for modern tech stack signals
  const modernKeywords = ['kubernetes', 'docker', 'aws', 'gcp', 'azure', 'ci/cd', 'terraform', 'react', 'typescript', 'graphql', 'grpc'];
  const foundModern = modernKeywords.filter((kw) => normalizeText(text).includes(normalizeText(kw))).length;

  if (foundModern < 2 && targetRole.toLowerCase().includes('engineer')) {
    issues.push({
      id: 'missing-modern-stack',
      severity: 'low',
      category: 'market_readiness',
      title: 'Limited Modern Stack Signals',
      evidence: `Only ${foundModern} modern infrastructure/development keywords detected for an engineering role.`,
      recommendation: 'Include relevant cloud, containerization, and CI/CD tools you have used, even in supporting roles.',
      rationale: 'Modern engineering roles expect familiarity with cloud-native tooling. Absence may suggest outdated skillset.',
      actionability: 'needs_user_input',
      confidence: 'medium',
    });
  }

  const score = Math.min(100, Math.max(0, 70 + (wordCount >= 300 && wordCount <= 600 ? 10 : 0) + (metricsFound.length >= 3 ? 10 : 0) + (foundModern >= 2 ? 10 : 0)));

  return { issues, score };
}

function checkFormattingQuality(text: string): TemplateAuditIssue[] {
  const issues: TemplateAuditIssue[] = [];
  const lines = text.split('\n');

  // Check for markdown headings
  const hasMarkdownHeadings = lines.some((l) => /^#{1,3}\s+/.test(l.trim()));
  if (!hasMarkdownHeadings) {
    issues.push({
      id: 'no-markdown-headings',
      severity: 'medium',
      category: 'formatting_quality',
      title: 'Missing Markdown Section Headers',
      evidence: 'No standard markdown headings (## Section) detected in extracted text.',
      recommendation: 'Use ## Summary, ## Experience, ## Skills, ## Education, ## Projects as section headers.',
      rationale: 'Markdown headers provide semantic structure that ATS parsers and screen readers can reliably interpret.',
      actionability: 'quick_fix',
      confidence: 'high',
    });
  }

  // Check for consistent bullet style
  const bulletStyles = new Set<string>();
  lines.forEach((l) => {
    const trimmed = l.trim();
    if (/^[-*•]\s+/.test(trimmed)) bulletStyles.add('dash');
    if (/^\d+[.)]\s+/.test(trimmed)) bulletStyles.add('numbered');
  });

  if (bulletStyles.size > 1) {
    issues.push({
      id: 'mixed-bullet-styles',
      severity: 'low',
      category: 'formatting_quality',
      title: 'Mixed Bullet Point Styles',
      evidence: `Detected multiple bullet styles: ${Array.from(bulletStyles).join(', ')}.`,
      recommendation: 'Standardize on one bullet style (dashes or asterisks preferred) throughout.',
      rationale: 'Consistent formatting signals attention to detail and renders predictably across viewers.',
      actionability: 'quick_fix',
      confidence: 'high',
    });
  }

  return issues;
}

function extractJobKeywords(jobDescription: string): string[] {
  const TECH_KEYWORDS_DICTIONARY = [
    'Go',
    'Golang',
    'C++',
    'C#',
    'Java',
    'Python',
    'TypeScript',
    'JavaScript',
    'Rust',
    'Ruby',
    'PHP',
    'Swift',
    'Kotlin',
    'Scala',
    'SQL',
    'HTML5',
    'CSS3',
    'Bash',
    'Shell',
    'React',
    'Next.js',
    'Vue',
    'Angular',
    'Svelte',
    'Node.js',
    'Express',
    'NestJS',
    'FastAPI',
    'Django',
    'Flask',
    'Spring Boot',
    'PyTorch',
    'TensorFlow',
    'Hugging Face',
    'LangChain',
    'LlamaIndex',
    'Pandas',
    'NumPy',
    'Scikit-Learn',
    'Tailwind CSS',
    'GraphQL',
    'Redux',
    'Zustand',
    'PostgreSQL',
    'MySQL',
    'MongoDB',
    'Redis',
    'Kafka',
    'Elasticsearch',
    'ChromaDB',
    'Pinecone',
    'Qdrant',
    'DynamoDB',
    'Cassandra',
    'BigQuery',
    'Snowflake',
    'Supabase',
    'Prisma',
    'Docker',
    'Kubernetes',
    'AWS',
    'GCP',
    'Azure',
    'Terraform',
    'CI/CD',
    'GitHub Actions',
    'GitLab CI',
    'ArgoCD',
    'Helm',
    'Prometheus',
    'Grafana',
    'Datadog',
    'Linux',
    'Git',
    'Nginx',
    'Microservices',
    'REST APIs',
    'gRPC',
    'WebSockets',
    'Serverless',
    'Distributed Systems',
    'System Design',
    'ACID',
    'Concurrency',
    'RAG',
    'LLMs',
    'A/B Testing',
    'Agile',
    'Scrum',
    'TDD',
    'Unit Testing',
    'Observability',
    'Telemetry',
    'Caching',
    'Performance Tuning',
    'Vector Search',
    'Data Warehousing',
    'Window Functions',
  ];

  const normalizedJd = normalizeText(jobDescription);
  const foundKeywords: string[] = [];

  TECH_KEYWORDS_DICTIONARY.forEach((kw) => {
    const normKw = normalizeText(kw);
    const regex = new RegExp(`\\b${normKw}\\b`, 'i');
    if (regex.test(normalizedJd) || normalizedJd.includes(normKw)) {
      foundKeywords.push(kw);
    }
  });

  // Also extract prominent capitalized terms
  const customMatches = jobDescription.match(
    /(?:experience with|proficiency in|knowledge of|familiarity with|strong in)\s+([A-Za-z0-9+#.\s]{2,40})/gi
  ) || [];

  customMatches.forEach((m) => {
    const clean = m
      .replace(/^(?:experience with|proficiency in|knowledge of|familiarity with|strong in)\s+/i, '')
      .trim();
    if (clean.length > 2 && clean.length < 30 && !foundKeywords.includes(clean)) {
      foundKeywords.push(clean.charAt(0).toUpperCase() + clean.slice(1));
    }
  });

  return Array.from(new Set(foundKeywords));
}

export async function runTemplateAudit(
  template: UploadedResumeTemplate,
  jobDescription: string,
  targetRole: string
): Promise<TemplateAuditResult> {
  // Extract text from file
  const extraction = await extractTextFromFile(template.file);

  const fullText = extraction.text;
  const wordCount = fullText.trim() ? fullText.trim().split(/\s+/).length : 0;
  const characterCount = fullText.length;

  // Detect sections
  const { detected: detectedSections, missing: missingSections } = detectSections(fullText);

  // Check contact info
  const { found: contactFound, missing: contactMissing } = checkContactInfo(fullText);

  // Run all checks
  const parsingSafetyIssues = checkParsingSafety(fullText, extraction.method);
  const contentStructureIssues = checkContentStructure(fullText);
  const { issues: roleAlignmentIssues, score: roleAlignmentScore, explanation: roleAlignmentExplanation } =
    checkRoleAlignment(fullText, jobDescription, targetRole);
  const { issues: marketReadinessIssues, score: marketReadinessScore } = checkMarketReadiness(
    fullText,
    jobDescription,
    targetRole
  );
  const formattingQualityIssues = checkFormattingQuality(fullText);

  // Contact info issues
  const contactInfoIssues: TemplateAuditIssue[] = [];
  if (contactMissing.includes('email')) {
    contactInfoIssues.push({
      id: 'missing-email',
      severity: 'high',
      category: 'contact_info',
      title: 'Missing Email Address',
      evidence: 'No email pattern detected in extracted text.',
      recommendation: 'Add a professional email address at the top of the resume.',
      rationale: 'Email is the primary contact method for recruiters. Missing email prevents follow-up.',
      actionability: 'quick_fix',
      confidence: 'high',
    });
  }
  if (contactMissing.includes('phone')) {
    contactInfoIssues.push({
      id: 'missing-phone',
      severity: 'medium',
      category: 'contact_info',
      title: 'Missing Phone Number',
      evidence: 'No phone number pattern detected.',
      recommendation: 'Add a phone number for recruiter contact.',
      rationale: 'Phone is the second most common contact method. Some ATS require it for candidate records.',
      actionability: 'quick_fix',
      confidence: 'high',
    });
  }
  if (contactMissing.includes('linkedin')) {
    contactInfoIssues.push({
      id: 'missing-linkedin',
      severity: 'low',
      category: 'contact_info',
      title: 'Missing LinkedIn Profile',
      evidence: 'No LinkedIn URL detected.',
      recommendation: 'Add your LinkedIn profile URL (linkedin.com/in/yourname).',
      rationale: 'LinkedIn profiles provide verification and additional context. 90%+ of recruiters check them.',
      actionability: 'quick_fix',
      confidence: 'medium',
    });
  }

  // Combine all issues
  const allIssues = [
    ...parsingSafetyIssues,
    ...contentStructureIssues,
    ...roleAlignmentIssues,
    ...marketReadinessIssues,
    ...formattingQualityIssues,
    ...contactInfoIssues,
  ];

  // Sort by severity
  const severityOrder: Record<TemplateAuditSeverity, number> = { high: 0, medium: 1, low: 2 };
  allIssues.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  // Calculate category scores
  const categories: TemplateAuditCategory[] = [
    'parsing_safety',
    'content_structure',
    'section_detection',
    'role_alignment',
    'market_readiness',
    'contact_info',
    'formatting_quality',
  ];

  const categoryScores: TemplateAuditCategoryScore[] = categories.map((cat) => {
    const catIssues = allIssues.filter((i) => i.category === cat);
    const highCount = catIssues.filter((i) => i.severity === 'high').length;
    const medCount = catIssues.filter((i) => i.severity === 'medium').length;
    const lowCount = catIssues.filter((i) => i.severity === 'low').length;

    let score = 100;
    score -= highCount * 20;
    score -= medCount * 10;
    score -= lowCount * 3;
    score = Math.max(0, score);

    const labels: Record<TemplateAuditCategory, string> = {
      parsing_safety: 'ATS Parsing Safety',
      content_structure: 'Content Structure',
      section_detection: 'Section Detection',
      role_alignment: 'Role Alignment',
      market_readiness: 'Market Readiness',
      contact_info: 'Contact Information',
      formatting_quality: 'Formatting Quality',
    };

    const explanations: Record<TemplateAuditCategory, string> = {
      parsing_safety: catIssues.length === 0 ? 'File extracts cleanly with no parsing risks.' : `${catIssues.length} parsing risk(s) detected.`,
      content_structure: catIssues.length === 0 ? 'Content structure follows best practices.' : `${catIssues.length} structural issue(s) found.`,
      section_detection: detectedSections.length >= 4 ? 'Core sections detected.' : `Only ${detectedSections.length} of 6+ core sections detected.`,
      role_alignment: roleAlignmentExplanation,
      market_readiness: marketReadinessScore >= 80 ? 'Strong market signals.' : marketReadinessScore >= 60 ? 'Moderate market readiness.' : 'Needs improvement for competitive roles.',
      contact_info: contactMissing.length === 0 ? 'All key contact methods present.' : `Missing: ${contactMissing.join(', ')}.`,
      formatting_quality: catIssues.length === 0 ? 'Clean, consistent formatting.' : `${catIssues.length} formatting issue(s).`,
    };

    return {
      category: cat,
      score,
      maxScore: 100,
      label: labels[cat],
      explanation: explanations[cat],
    };
  });

  // Overall readiness score (weighted average)
  const weights: Record<TemplateAuditCategory, number> = {
    parsing_safety: 0.25,
    content_structure: 0.20,
    section_detection: 0.10,
    role_alignment: 0.20,
    market_readiness: 0.10,
    contact_info: 0.10,
    formatting_quality: 0.05,
  };

  const overallReadiness = Math.round(
    Object.entries(weights).reduce((sum, [cat, weight]) => {
      const catScore = categoryScores.find((c) => c.category === cat)?.score ?? 0;
      return sum + catScore * weight;
    }, 0)
  );

  return {
    overallReadiness,
    categoryScores,
    issues: allIssues,
    extractedText: fullText,
    wordCount,
    characterCount,
    detectedSections,
    missingSections,
    roleAlignmentScore,
    roleAlignmentExplanation,
  };
}