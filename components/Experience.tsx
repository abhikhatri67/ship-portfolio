'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin, Briefcase } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const experiences = [
  {
    company: 'GoGroup',
    location: 'Noida, India',
    positions: [
      {
        title: 'Lead Software Engineer',
        period: '',
      },
      {
        title: 'Principal Software Engineer',
        period: '',
      },
      {
        title: 'Senior Software Engineer',
        period: '',
      },
    ],
    overallPeriod: 'Jul 2021 – Present',
    description: 'Leading frontend architecture, AI-assisted development and customer-facing platforms for maritime and green-energy products.',
    achievements: [
      'Architected and led development of heyport, a customer-facing React platform supporting 10,000+ port calls, reducing manual communication by 90% and associated CO₂ emissions by 14%',
      'Designed and established reusable frontend patterns and component-driven architectures, partnering with product, design, and backend teams',
      'Architected an AI-powered email ingestion workflow that extracts structured data from unstructured emails using LLMs, validates fields, and persists normalised records',
      'Initiated and championed adoption of AI-assisted development (Claude Code, Cursor) across the engineering team',
      'Integrated React applications with backend APIs and data services, handling complex state, async workflows, data visualisation and operational dashboards',
      'Architected and optimised AWS infrastructure (EC2, S3, CloudFront, serverless) for scalability, reliability, and performance',
      'Established unit and integration testing practices with Vitest and React Testing Library, improving regression coverage',
      'Mentored engineers through architecture discussions, code reviews, and hands-on collaboration',
      'Led development of a green-energy customer portal from inception to production in one month, reducing delivery timelines by 20%',
    ],
    technologies: ['ReactJS', 'TypeScript', 'Ruby on Rails', 'Vitest', 'React Testing Library', 'Playwright', 'GraphQL', 'Recharts', 'AWS'],
  },
  {
    company: 'Smart Joules Private Limited',
    location: 'Gurugram, India',
    positions: [
      {
        title: 'Front-End Team Lead',
        period: '',
      },
      {
        title: 'Software Development Engineer',
        period: '',
      },
    ],
    overallPeriod: 'Mar 2017 – Jul 2021',
    description: 'Led front-end and UI/UX for energy management products, scaling the team from 1 to 6 engineers.',
    achievements: [
      'Led and scaled the Frontend & UI/UX team from 1 → 6 engineers, establishing reusable patterns, code-review practices and standards that increased delivery capacity 5×',
      'Built JouleTrack, a Progressive Web App for energy management, from the ground up with Angular and real-time IoT connectivity',
      'Designed data-intensive monitoring dashboards with Highcharts for real-time energy telemetry',
      'Engineered real-time communication between IoT controllers, backend services, and frontend applications',
      'Collaborated on Node.js, GraphQL, Redis, and serverless AWS services, improving reliability, scalability, and API efficiency',
      'Reduced infrastructure costs by 25% through serverless architecture and accelerated product iteration by 40% through early frontend prototyping',
    ],
    technologies: ['Angular', 'NodeJS', 'Redis', 'GraphQL', 'Serverless', 'AWS', 'Highcharts'],
  },
];

export const Experience = () => {
  return (
    <section id="experience" className="py-20 bg-slate-900">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Work <span className="text-blue-400">Experience</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              9.5+ years of professional experience building scalable applications and leading teams
            </p>
          </div>

          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.company}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="bg-slate-800 border-slate-700 hover:border-blue-500/50 transition-all duration-300">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <CardTitle className="text-2xl text-white mb-2 flex items-center gap-2">
                          <Briefcase className="text-blue-400" size={24} />
                          {exp.company}
                        </CardTitle>
                        <CardDescription className="text-gray-400 flex items-center gap-2">
                          <MapPin size={16} />
                          {exp.location}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Calendar size={16} />
                        <span className="text-sm font-medium">{exp.overallPeriod}</span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      {exp.positions.map((position, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm"
                        >
                          <span className="text-blue-300 font-semibold">{position.title}</span>
                          {position.period && <span className="text-gray-500">{position.period}</span>}
                        </div>
                      ))}
                    </div>

                    <p className="text-gray-300">{exp.description}</p>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="text-white font-semibold mb-3">Key Achievements:</h4>
                      <ul className="space-y-2">
                        {exp.achievements.map((achievement, idx) => (
                          <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className="text-gray-400 flex gap-2"
                          >
                            <span className="text-blue-400 mt-1">•</span>
                            <span>{achievement}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-white font-semibold mb-3">Technologies:</h4>
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech, idx) => (
                          <Badge
                            key={tech}
                            variant="secondary"
                            className="bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 border border-blue-500/20"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
