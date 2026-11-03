'use client';

import { motion } from 'framer-motion';
import { Ship, Zap, Bot } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const work = [
  {
    icon: Ship,
    color: 'text-blue-400',
    name: 'heyport',
    org: 'GoGroup',
    blurb: 'Customer-facing React platform for port-call coordination, architected and led from inception to production.',
    stats: ['10,000+ port calls', '90% less manual communication', '14% lower CO₂'],
    tech: ['React', 'TypeScript', 'Ruby on Rails', 'AWS', 'Vitest'],
  },
  {
    icon: Bot,
    color: 'text-purple-400',
    name: 'LLM email ingestion',
    org: 'GoGroup',
    blurb: 'Workflow that extracts structured data from unstructured emails with LLMs, validates fields and stores normalised records.',
    stats: ['Structured outputs', 'Validation before persistence', 'AI-assisted team workflow'],
    tech: ['LLM APIs', 'Structured Outputs', 'Claude Code', 'Cursor'],
  },
  {
    icon: Zap,
    color: 'text-cyan-400',
    name: 'JouleTrack',
    org: 'Smart Joules',
    blurb: 'Progressive Web App for energy management with real-time IoT connectivity and data-dense monitoring dashboards.',
    stats: ['Real-time IoT telemetry', 'Team scaled 1 → 6', '25% lower infra cost'],
    tech: ['Angular', 'Node.js', 'GraphQL', 'Redis', 'Highcharts', 'Serverless'],
  },
];

export const FeaturedWork = () => (
  <section id="featured" className="py-20 bg-slate-900">
    <div className="container mx-auto px-6">
      <div className="mx-auto mb-12 max-w-6xl text-center">
        <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
          Featured <span className="text-blue-400">Work</span>
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-gray-400">Products I architected and shipped</p>
      </div>
      <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
        {work.map((w, i) => (
          <motion.article
            key={w.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.12 }}
            viewport={{ once: true }}
            className="flex flex-col rounded-2xl border border-slate-700 bg-slate-800 p-6 transition-colors hover:border-blue-500/50"
          >
            <w.icon className={w.color} size={32} />
            <h3 className="mt-4 text-2xl font-bold text-white">{w.name}</h3>
            <p className="mb-3 text-sm text-purple-300">{w.org}</p>
            <p className="mb-4 text-gray-300">{w.blurb}</p>
            <ul className="mb-5 space-y-1 text-sm text-gray-400">
              {w.stats.map((s) => (
                <li key={s}>• {s}</li>
              ))}
            </ul>
            <div className="mt-auto flex flex-wrap gap-2">
              {w.tech.map((t) => (
                <Badge key={t} variant="secondary" className="border border-blue-500/20 bg-blue-500/10 text-blue-300">
                  {t}
                </Badge>
              ))}
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  </section>
);
