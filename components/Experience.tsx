'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin, Briefcase } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const experiences = [
  {
    company: 'GoGroup',
    location: 'Remote',
    positions: [
      {
        title: 'Team Lead',
        period: 'Jul 2023 – Present',
      },
      {
        title: 'Principal Software Engineer',
        period: 'Jul 2022 – Jun 2023',
      },
      {
        title: 'Senior Software Engineer',
        period: 'Jul 2021 – Jun 2022',
      },
    ],
    overallPeriod: 'Jul 2021 – Present',
    description: 'Leading development teams and architecting scalable web applications for maritime and energy sectors.',
    achievements: [
      'Integrated GraphQL into existing React application, reducing load times by 75% and improving data flow efficiency',
      'Developed "heyport" - a comprehensive port call coordination tool for ships, vendors, agents, terminals, and authorities',
      'Built Green Energy Provider Portal MVP with CRUD operations, user access control, and complex authorization',
      'Led team of engineers, conducted code reviews, and mentored junior developers',
      'Collaborated with cross-functional teams to design and implement new features',
      'Established best practices for remote collaboration and code quality',
    ],
    technologies: ['ReactJS', 'Ruby on Rails', 'GraphQL', 'AWS (EC2, S3, CloudFront)', 'Redux', 'JavaScript (ES6+)', 'HTML5', 'CSS3'],
  },
  {
    company: 'Smart Joules Private Limited',
    location: 'Gurugram, India',
    positions: [
      {
        title: 'Front-End Team Lead',
        period: 'Jul 2019 – Jul 2021',
      },
      {
        title: 'Software Development Engineer',
        period: 'Mar 2017 – Jun 2019',
      },
    ],
    overallPeriod: 'Mar 2017 – Jul 2021',
    description: 'Led front-end development for energy management systems, growing team from 1 to 6 members.',
    achievements: [
      'Built JouleTrack (Building Management System) from scratch with real-time monitoring and analytics',
      'Developed DeJoule Energy Management System with comprehensive dashboards and reporting',
      'Grew and mentored front-end team from 1 to 6 members',
      'Implemented data visualization using Highcharts for complex energy consumption patterns',
      'Architected serverless solutions on AWS for scalable deployment',
      'Integrated Redis for caching and improved application performance',
    ],
    technologies: ['Angular', 'NodeJS', 'Redis', 'GraphQL', 'Serverless', 'AWS', 'Highcharts', 'TypeScript'],
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
              8.5+ years of professional experience building scalable applications and leading teams
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
                          <span className="text-gray-500">{position.period}</span>
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
