import { AnalysisResult, KeywordSignal, MissingKeyword, QualityIssue, InterviewQuestion, TailorMode } from '../types';

export const TECH_KEYWORDS_DICTIONARY = [
  // Languages
  "Go", "Golang", "C++", "C#", "Java", "Python", "TypeScript", "JavaScript", "Rust", "Ruby", "PHP", "Swift", "Kotlin", "Scala", "SQL", "HTML5", "CSS3", "Bash", "Shell",
  // Frameworks & Libraries
  "React", "Next.js", "Vue", "Angular", "Svelte", "Node.js", "Express", "NestJS", "FastAPI", "Django", "Flask", "Spring Boot", "PyTorch", "TensorFlow", "Hugging Face", "LangChain", "LlamaIndex", "Pandas", "NumPy", "Scikit-Learn", "Tailwind CSS", "GraphQL", "Redux", "Zustand",
  // Databases & Storage
  "PostgreSQL", "MySQL", "MongoDB", "Redis", "Kafka", "Elasticsearch", "ChromaDB", "Pinecone", "Qdrant", "DynamoDB", "Cassandra", "BigQuery", "Snowflake", "Supabase", "Prisma",
  // DevOps & Cloud
  "Docker", "Kubernetes", "AWS", "GCP", "Azure", "Terraform", "CI/CD", "GitHub Actions", "GitLab CI", "ArgoCD", "Helm", "Prometheus", "Grafana", "Datadog", "Linux", "Git", "Nginx", "Microservices", "REST APIs", "gRPC", "WebSockets", "Serverless",
  // Architecture & Methodologies
  "Distributed Systems", "System Design", "ACID", "Concurrency", "RAG", "LLMs", "A/B Testing", "Agile", "Scrum", "TDD", "Unit Testing", "Observability", "Telemetry", "Caching", "Performance Tuning", "Vector Search", "Data Warehousing", "Window Functions"
];

export const POWER_ACTION_VERBS = [
  "architected", "engineered", "spearheaded", "developed", "built", "implemented", "optimized", "accelerated", "slashed", "scaled", "orchestrated", "automated", "designed", "deployed", "streamlined", "overhauled", "championed", "formulated", "revamped", "integrated", "transformed", "directed", "authored"
];

export const WEAK_VERBS_MAP: Record<string, string> = {
  "worked on": "Engineered",
  "helped with": "Collaborated to build",
  "responsible for": "Spearheaded",
  "did": "Executed",
  "made": "Constructed",
  "used": "Leveraged",
  "participated in": "Contributed to",
  "assisted in": "Co-engineered",
  "handled": "Orchestrated",
  "was part of": "Co-developed"
};

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[+/#.-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function countWords(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

export function countBullets(text: string): number {
  return text.match(/(^|\n)\s*(?:[*•-]|\d+[.)])\s+/g)?.length ?? (text.trim() ? 1 : 0);
}

export function extractJobKeywords(jobDescription: string): string[] {
  const normalizedJd = normalizeText(jobDescription);
  const foundKeywords: string[] = [];

  // Match predefined keywords
  TECH_KEYWORDS_DICTIONARY.forEach(kw => {
    const normKw = normalizeText(kw);
    const regex = new RegExp(`\\b${normKw}\\b`, 'i');
    if (regex.test(normalizedJd) || normalizedJd.includes(normKw)) {
      foundKeywords.push(kw);
    }
  });

  // Also extract prominent capitalized terms and bullet items from JD
  const customMatches = jobDescription.match(/(?:experience with|proficiency in|knowledge of|familiarity with|strong in)\s+([A-Za-z0-9+#.\s]{2,40})/gi) || [];
  customMatches.forEach(m => {
    const clean = m.replace(/^(?:experience with|proficiency in|knowledge of|familiarity with|strong in)\s+/i, '').trim();
    if (clean.length > 2 && clean.length < 30 && !foundKeywords.includes(clean)) {
      foundKeywords.push(clean.charAt(0).toUpperCase() + clean.slice(1));
    }
  });

  return Array.from(new Set(foundKeywords));
}

export function runAtsAnalysis(
  jobDescription: string,
  resumeText: string,
  mode: TailorMode = 'Standard Tailor'
): AnalysisResult {
  const normJd = normalizeText(jobDescription);
  const normResume = normalizeText(resumeText);
  const words = countWords(resumeText);
  const bullets = countBullets(resumeText);

  if (!normJd || !normResume) {
    return {
      overall: 0,
      skills: { score: 0, found: 0, total: 0 },
      verbs: { score: 0, label: "No evidence", count: 0 },
      proof: { score: 0, count: 0, label: "No metrics" },
      format: { score: 0, label: "Incomplete" },
      seniority: { score: 0, label: "Not assessed" },
      readability: { score: 0, label: "Not assessed" },
      matched: [],
      missing: [],
      enhanced: "",
      improvement: "+0 pts",
      bulletsCount: bullets,
      wordCount: words
    };
  }

  // 1. Technical keywords match
  const jdKeywords = extractJobKeywords(jobDescription);
  const matchedKeywords: KeywordSignal[] = [];
  const missingKeywords: MissingKeyword[] = [];

  jdKeywords.forEach(kw => {
    const normKw = normalizeText(kw);
    const count = (normResume.split(normKw).length - 1);
    if (count > 0 || normResume.includes(normKw)) {
      matchedKeywords.push({
        term: kw,
        count: Math.max(1, count),
        category: 'technical'
      });
    } else {
      const isHighPriority = ["distributed systems", "microservices", "sql", "python", "kubernetes", "react", "golang", "go", "pytorch", "aws"].includes(normKw);
      missingKeywords.push({
        term: kw,
        priority: isHighPriority ? 'high' : 'medium',
        category: 'technical'
      });
    }
  });

  const totalJdTerms = Math.max(1, jdKeywords.length);
  const skillScore = Math.min(100, Math.round((matchedKeywords.length / totalJdTerms) * 100));

  // 2. Action Verbs analysis
  const powerVerbMatches = POWER_ACTION_VERBS.filter(v => {
    const reg = new RegExp(`\\b${v}\\b`, 'i');
    return reg.test(normResume);
  });
  const verbCount = powerVerbMatches.length;
  const verbScore = Math.min(100, Math.max(20, Math.round(40 + verbCount * 12)));
  const verbLabel = verbScore >= 80 ? "High impact density" : verbScore >= 60 ? "Moderate verbs" : "Needs stronger action verbs";

  // 3. Quantifiable Proof (Numbers, percentages, metrics)
  const numbersRegex = /\b\d+(?:[\d,.]*\s?(?:%|k\b|m\b|x\b|ms\b|sec\b|hours?|users?|students?|records?|requests?|\+|\$|usd)?)\b/gi;
  const metricsFound = resumeText.match(numbersRegex) || [];
  const metricCount = metricsFound.length;
  const proofScore = Math.min(100, Math.round(metricCount * 22 + (metricCount > 0 ? 15 : 0)));
  const proofLabel = metricCount >= 4 ? `${metricCount} metrics verified` : metricCount > 0 ? `${metricCount} metrics found (aim for 4+)` : "Missing quantifiable metrics";

  // 4. Format & ATS Hygiene
  const hasMarkdownHeadings = resumeText.includes("##") || resumeText.includes("#");
  const hasBulletStructure = bullets >= 3;
  const wordCountAppropriate = words >= 80 && words <= 800;
  let formatScore = 70;
  if (hasMarkdownHeadings) formatScore += 15;
  if (hasBulletStructure) formatScore += 10;
  if (wordCountAppropriate) formatScore += 5;
  formatScore = Math.min(100, formatScore);
  const formatLabel = formatScore >= 90 ? "Clean ATS Markdown" : formatScore >= 75 ? "Good Structure" : "Needs cleaner formatting";

  // 5. Seniority & Readability
  const seniorityScore = Math.min(100, Math.max(50, Math.round(skillScore * 0.5 + verbScore * 0.3 + proofScore * 0.2)));
  const readabilityScore = Math.min(100, Math.max(60, Math.round(formatScore * 0.6 + (words > 100 ? 35 : 20))));

  // Weight adjustments based on Tailor Mode
  let weightSkill = 0.45;
  let weightVerbs = 0.20;
  let weightProof = 0.20;
  let weightFormat = 0.15;

  if (mode === 'Technical Role') {
    weightSkill = 0.55;
    weightVerbs = 0.15;
    weightProof = 0.20;
    weightFormat = 0.10;
  } else if (mode === 'Fresher / Campus') {
    weightSkill = 0.35;
    weightVerbs = 0.25;
    weightProof = 0.15;
    weightFormat = 0.25;
  } else if (mode === 'Data / AI Role') {
    weightSkill = 0.50;
    weightVerbs = 0.15;
    weightProof = 0.25;
    weightFormat = 0.10;
  } else if (mode === 'Management / Lead') {
    weightSkill = 0.30;
    weightVerbs = 0.30;
    weightProof = 0.30;
    weightFormat = 0.10;
  }

  const rawOverall = (
    skillScore * weightSkill +
    verbScore * weightVerbs +
    proofScore * weightProof +
    formatScore * weightFormat
  );

  const overall = Math.min(99, Math.max(15, Math.round(rawOverall)));

  // Generate STAR Bullet suggestion
  const firstBullet = resumeText
    .split(/\n(?=\s*(?:[*•-]|\d+[.)])\s+)/)
    .find(b => b.trim().length > 20)
    ?.replace(/^\s*[*•-]\s*/, "") || "Developed project modules using relevant stack.";

  const topSkillsStr = matchedKeywords.slice(0, 2).map(m => m.term).join(" and ") || "industry-standard tools";
  const enhancedBullet = `Architected modular services leveraging ${topSkillsStr}, optimizing throughput and cutting execution latency by 35% across simulated production load.`;
  const potentialBoost = Math.max(8, Math.round((100 - overall) * 0.45));

  return {
    overall,
    skills: {
      score: skillScore,
      found: matchedKeywords.length,
      total: totalJdTerms
    },
    verbs: {
      score: verbScore,
      label: verbLabel,
      count: verbCount
    },
    proof: {
      score: proofScore,
      count: metricCount,
      label: proofLabel
    },
    format: {
      score: formatScore,
      label: formatLabel
    },
    seniority: {
      score: seniorityScore,
      label: seniorityScore >= 80 ? "Well Aligned" : "Moderate Alignment"
    },
    readability: {
      score: readabilityScore,
      label: readabilityScore >= 85 ? "Optimal Scannability" : "Fair"
    },
    matched: matchedKeywords,
    missing: missingKeywords,
    enhanced: enhancedBullet,
    improvement: `+${potentialBoost} pts potential`,
    bulletsCount: bullets,
    wordCount: words
  };
}

export function detectQualityIssues(
  resumeText: string,
  analysis: AnalysisResult,
  jobDescription: string
): QualityIssue[] {
  const issues: QualityIssue[] = [];

  // 1. Weak verbs detection
  for (const [weak, strong] of Object.entries(WEAK_VERBS_MAP)) {
    const reg = new RegExp(`\\b${weak}\\b[^.\\n]*`, 'i');
    const match = resumeText.match(reg);
    if (match) {
      const sentence = match[0];
      issues.push({
        id: `weak-verb-${weak}`,
        severity: 'high',
        category: 'verb',
        title: `Weak action verb: "${weak}"`,
        current: sentence,
        suggested: sentence.replace(new RegExp(`^${weak}`, 'i'), strong),
        why: `Replacing passive phrasing with active verbs like "${strong}" signals direct ownership and leadership.`
      });
      break; // Return highest priority verb issue
    }
  }

  // 2. Missing metrics in bullets
  if (analysis.proof.count < Math.max(1, Math.ceil(analysis.bulletsCount / 2))) {
    issues.push({
      id: 'missing-metrics',
      severity: 'medium',
      category: 'metric',
      title: 'Missing Quantifiable Impact',
      current: 'Several bullets describe tasks without measurable outcomes or scale.',
      suggested: 'Add metrics (e.g., "reduced latency by 40%", "supporting 10k users", "saved 6 hrs/week").',
      why: 'Recruiters and hiring managers look for numbers to validate the scale and real-world value of your contributions.'
    });
  }

  // 3. Top Missing Job Keyword
  if (jobDescription.trim() && analysis.missing.length > 0) {
    const topMissing = analysis.missing[0];
    issues.push({
      id: `missing-kw-${topMissing.term}`,
      severity: topMissing.priority === 'high' ? 'high' : 'medium',
      category: 'keyword',
      title: `Missing High-Priority Keyword: "${topMissing.term}"`,
      current: `Resume lacks evidence or mention of "${topMissing.term}".`,
      suggested: `Include a truthful bullet or coursework project where you applied "${topMissing.term}".`,
      why: 'ATS filters prioritize exact matches found in the core requirements section of the job posting.'
    });
  }

  // 4. Formatting checks
  if (analysis.format.score < 90) {
    issues.push({
      id: 'formatting-hygiene',
      severity: 'low',
      category: 'format',
      title: 'Formatting & Heading Consistency',
      current: 'Missing standard Markdown section headers (e.g., ## Technical Skills, ## Experience).',
      suggested: 'Structure resume with clear markdown headers (## Summary, ## Skills, ## Experience, ## Projects).',
      why: 'ATS parsers rely on recognized standard headers to segment contact details, skills, and work history correctly.'
    });
  }

  return issues;
}

export function generateInterviewQuestions(
  analysis: AnalysisResult,
  roleTitle: string
): InterviewQuestion[] {
  const topMatched = analysis.matched[0]?.term ?? "your primary technical project";
  const secondMatched = analysis.matched[1]?.term ?? "core framework in your resume";
  const topMissing = analysis.missing[0]?.term ?? "a key job requirement";

  return [
    {
      id: 'deep-dive',
      type: 'Deep Dive',
      category: 'Technical',
      question: `Walk me through how you engineered the system using ${topMatched}. What was your specific architectural contribution?`,
      why: 'Tests depth of understanding and separates real hands-on experience from passive resume claims.',
      answer: `Structure with STAR:\n1. Situation: Set the business problem and constraints.\n2. Task: Explain what you were individually accountable for.\n3. Action: Detail one non-obvious engineering decision using ${topMatched}.\n4. Result: Conclude with a verified outcome (e.g. latency, scale, time saved).`,
      keyPoints: [
        `Clarify your individual scope vs team effort`,
        `Name a technical trade-off with ${topMatched}`,
        `Share a concrete metric or deployment outcome`
      ]
    },
    {
      id: 'trade-offs',
      type: 'Architecture & Trade-offs',
      category: 'System Design',
      question: `Why did you select ${secondMatched} over alternative tools, and how would your architecture adapt if traffic scaled 10x?`,
      why: 'Tests engineering judgment, scalability mindset, and awareness of tool limitations.',
      answer: `Explain the initial rationale for ${secondMatched} (e.g. developer velocity, low latency, team familiarity). Then outline the exact bottleneck that would emerge at 10x scale (e.g. connection pool saturation, cache invalidation, network I/O) and how you would migrate or shard.`,
      keyPoints: [
        `State 2 specific technical reasons why ${secondMatched} was chosen`,
        `Identify the primary bottleneck under 10x load`,
        `Propose a concrete caching, indexing, or partitioning fix`
      ]
    },
    {
      id: 'quant-impact',
      type: 'Impact & Measurement',
      category: 'Project Impact',
      question: `Which bullet achievement on your resume are you most proud of, and how did you rigorously measure the result?`,
      why: 'Validates authenticity of numbers and tests whether you understand business/technical metrics.',
      answer: `Pick your strongest quantified bullet. Explain the baseline before your change, the monitoring/telemetry tool used to measure it (e.g. Grafana, Datadog, SQL query, user surveys), and how the improvement impacted end users or teammates.`,
      keyPoints: [
        `State the baseline before the intervention`,
        `Mention the measurement tooling used`,
        `Highlight personal problem-solving autonomy`
      ]
    },
    {
      id: 'gap-mitigation',
      type: 'Gap Strategy',
      category: 'Behavioral',
      question: `This position heavily emphasizes ${topMissing}. How would you ramp up and apply it quickly on the job?`,
      why: 'Evaluates intellectual honesty, rapid learning ability, and problem solving when encountering unfamiliar tech.',
      answer: `Be direct and honest: "I have not worked with ${topMissing} in a high-scale production setting yet, but I have extensive experience with [Adjacent Tool]." Detail your 30-day learning plan: building a proof-of-concept, studying docs, and pairing with teammates.`,
      keyPoints: [
        `Acknowledge the gap with confidence rather than bluffing`,
        `Bridge with an adjacent skill you already mastered`,
        `Provide a rapid 2-week hands-on learning roadmap`
      ]
    }
  ];
}
