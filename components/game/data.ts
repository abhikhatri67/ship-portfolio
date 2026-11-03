export interface Chapter {
  id: string;
  level: string;
  title: string;
  period: string;
  place: string;
  story: string;
  bullets: string[];
  achievement?: string;
  /** scroll progress range [0..1] in which this chapter is "active" */
  from: number;
  to: number;
  /** position of the landmark along the sailing path */
  at: number;
  skills: { name: string; color: string }[];
}

export const chapters: Chapter[] = [
  {
    id: 'start',
    level: 'PROLOGUE',
    title: 'Abhishek Khatri',
    period: '9.5+ years · Lead Software Engineer',
    place: 'Noida, India',
    story:
      'Every system I build starts as a small spark. Hop aboard, steer with your mouse or the ← → keys and scoop up the skills I picked up along the way.',
    bullets: [],
    from: 0,
    to: 0.1,
    at: 0.02,
    skills: [],
  },
  {
    id: 'dit',
    level: 'LEVEL 1',
    title: 'The Academy',
    period: '2013 – 2017',
    place: 'DIT University, Dehradun',
    story:
      'Where it began: a B.Tech in Computer Science (7.5/10). Algorithms, data structures and a stubborn love for the web.',
    bullets: ['Bachelor of Technology, Computer Science', 'Foundations: algorithms, systems, web'],
    achievement: 'Degree unlocked',
    from: 0.1,
    to: 0.28,
    at: 0.2,
    skills: [
      { name: 'HTML5', color: '#ff7a45' },
      { name: 'CSS3', color: '#4aa8ff' },
      { name: 'JavaScript (ES6+)', color: '#ffd84a' },
      { name: 'Git', color: '#ff5a3c' },
    ],
  },
  {
    id: 'joules',
    level: 'LEVEL 2',
    title: 'The Energy Grid',
    period: 'Mar 2017 – Jul 2021',
    place: 'Smart Joules · Front-End Team Lead',
    story:
      'I joined as an engineer and grew a team of 1 into 6. We built JouleTrack, a real-time IoT energy PWA, and cut infrastructure cost by 25% going serverless.',
    bullets: [
      'Team scaled 1 → 6 engineers · delivery capacity 5×',
      'JouleTrack PWA with real-time IoT connectivity',
      'Highcharts telemetry dashboards',
      'Prototyping early sped up product iteration by 40%',
    ],
    achievement: 'Team scaled 1 → 6',
    from: 0.28,
    to: 0.5,
    at: 0.39,
    skills: [
      { name: 'Angular', color: '#ff4d6d' },
      { name: 'Node.js', color: '#7ddc5b' },
      { name: 'Highcharts', color: '#6ea8ff' },
      { name: 'Redis', color: '#ff5a5a' },
      { name: 'Serverless', color: '#ffb347' },
      { name: 'IoT', color: '#4de8c2' },
      { name: 'GraphQL', color: '#f26bd0' },
    ],
  },
  {
    id: 'gogroup',
    level: 'LEVEL 3',
    title: 'The Harbour',
    period: 'Jul 2021 – Present',
    place: 'GoGroup · Senior → Principal → Lead',
    story:
      'I architected heyport, a React platform that now coordinates 10,000+ port calls. Less email, fewer emissions, and one green-energy portal shipped in a single month.',
    bullets: [
      '10,000+ port calls · 90% less manual communication',
      '14% lower CO₂ emissions',
      'Green-energy portal: idea → production in 1 month',
      'Vitest + React Testing Library practices for the team',
    ],
    achievement: 'heyport: 10,000+ port calls',
    from: 0.5,
    to: 0.72,
    at: 0.61,
    skills: [
      { name: 'React', color: '#61dafb' },
      { name: 'TypeScript', color: '#4b8bff' },
      { name: 'Redux', color: '#a77bff' },
      { name: 'Ruby on Rails', color: '#ff4d4d' },
      { name: 'AWS', color: '#ffb02e' },
      { name: 'Vitest', color: '#9be564' },
      { name: 'Playwright', color: '#5de08a' },
      { name: 'Design Systems', color: '#ff8ad8' },
    ],
  },
  {
    id: 'ai',
    level: 'LEVEL 4',
    title: 'The AI Frontier',
    period: 'Now',
    place: 'GoGroup · AI-assisted engineering',
    story:
      'LLMs turn messy inboxes into structured data. I built the email ingestion workflow that does it, and brought Claude Code and Cursor to the whole engineering team.',
    bullets: [
      'LLM email ingestion → validated, normalised records',
      'Championed AI-assisted development across the team',
      'Mentoring through architecture talks and code reviews',
    ],
    achievement: 'AI workflow shipped',
    from: 0.72,
    to: 0.88,
    at: 0.8,
    skills: [
      { name: 'LLM APIs', color: '#c084ff' },
      { name: 'Structured Outputs', color: '#7cf3ff' },
      { name: 'Claude Code', color: '#ff9a62' },
      { name: 'Cursor', color: '#e6e6e6' },
    ],
  },
  {
    id: 'finale',
    level: 'FINAL LEVEL',
    title: 'The Lighthouse',
    period: '2022 · 2023',
    place: 'Recognition',
    story:
      'The Most Inspirational Award (2022) and The Founder Award (2023), both from GoGroup, for leadership and for moving the company forward. The next level is yours to write.',
    bullets: ['The Founder Award · 2023', 'Most Inspirational Award · 2022'],
    achievement: 'Journey complete',
    from: 0.88,
    to: 1.01,
    at: 0.95,
    skills: [
      { name: 'Leadership', color: '#ffd84a' },
      { name: 'Mentorship', color: '#7cf3ff' },
    ],
  },
];

export const totalSkills = chapters.reduce((n, c) => n + c.skills.length, 0);

export function chapterIndexAt(p: number) {
  for (let i = chapters.length - 1; i >= 0; i--) {
    if (p >= chapters[i].from) return i;
  }
  return 0;
}
