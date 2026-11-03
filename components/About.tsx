'use client';

import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, ExternalLink, BookOpen } from 'lucide-react';
import { usePortfolioStore } from '@/store/portfolioStore';
import { Badge } from '@/components/ui/badge';

export const About = () => {
  const { developerInfo } = usePortfolioStore();

  const socialLinks = [
    {
      name: 'GitHub',
      url: developerInfo?.github,
      icon: Github,
      color: 'hover:text-gray-400',
    },
    {
      name: 'Twitter',
      url: developerInfo?.twitter,
      icon: Twitter,
      color: 'hover:text-blue-400',
    },
    {
      name: 'LinkedIn',
      url: developerInfo?.linkedin,
      icon: Linkedin,
      color: 'hover:text-blue-600',
    },
  ];

  const blogLinks = [
    {
      name: 'Medium',
      url: developerInfo?.medium,
      description: 'Technical articles and insights',
    },
  ];

  const skills = [
    'React',
    'TypeScript',
    'JavaScript (ES6+)',
    'Redux',
    'Angular',
    'HTML5',
    'CSS3',
    'Design Systems',
    'Frontend Performance',
    'Node.js',
    'REST APIs',
    'GraphQL',
    'Ruby on Rails',
    'Redis',
    'AWS (EC2, S3, CloudFront, Serverless)',
    'Vitest',
    'Playwright',
    'Vite',
    'Webpack',
    'Highcharts',
    'Recharts',
    'IoT',
    'LLM APIs',
    'Claude / Cursor',
    'Mentorship',
  ];

  return (
    <section id="about" className="py-20 bg-slate-800/50">
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
              About <span className="text-blue-400">Me</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Lead Software Engineer with 9.5+ years of experience building scalable web applications and leading high-performing teams.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-semibold text-white mb-6">
                Hello! I'm {developerInfo?.name || 'a Developer'}
              </h3>
              <div className="text-gray-300 space-y-4 mb-8">
                <p>
                  I'm a Lead Software Engineer at GoGroup (Noida, India) with over 9.5 years of experience
                  building scalable web applications. I specialise in React and TypeScript, backed by Ruby on Rails,
                  GraphQL and AWS, with a strong focus on design systems, mentorship and team leadership.
                </p>
                <p>
                  I architected and led heyport, a customer-facing platform supporting 10,000+ port calls, and built
                  an LLM-powered email ingestion workflow. I also championed AI-assisted development (Claude Code,
                  Cursor) across the engineering team. Earlier, I scaled a frontend team from 1 to 6 engineers and
                  built real-time IoT energy dashboards at Smart Joules.
                </p>
              </div>

              <div className="mb-8">
                <h4 className="text-xl font-semibold text-white mb-4">Skills & Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <motion.div
                      key={skill}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      viewport={{ once: true }}
                    >
                      <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border border-blue-500/30">
                        {skill}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h4 className="text-xl font-semibold text-white mb-4">Connect With Me</h4>
                <div className="flex flex-wrap gap-4">
                  {socialLinks.map((link) => {
                    if (!link.url) return null;
                    const Icon = link.icon;
                    return (
                      <motion.a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex items-center gap-2 px-4 py-2 bg-slate-700 text-gray-300 rounded-lg transition-all duration-300 ${link.color}`}
                      >
                        <Icon size={20} />
                        {link.name}
                      </motion.a>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="text-xl font-semibold text-white mb-4">My Writing</h4>
                <div className="space-y-3">
                  {blogLinks.map((blog) => {
                    if (!blog.url) return null;
                    return (
                      <motion.a
                        key={blog.name}
                        href={blog.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02 }}
                        className="block p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-all duration-300 group"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="text-white font-medium flex items-center gap-2">
                              <BookOpen size={16} />
                              {blog.name}
                            </h5>
                            <p className="text-gray-400 text-sm">{blog.description}</p>
                          </div>
                          <ExternalLink 
                            size={16} 
                            className="text-gray-400 group-hover:text-white transition-colors duration-300" 
                          />
                        </div>
                      </motion.a>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-700 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-400">9.5+</div>
                  <div className="text-gray-400 text-sm">Years Experience</div>
                </div>
                <div className="bg-slate-700 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-400">10,000+</div>
                  <div className="text-gray-400 text-sm">Port Calls on heyport</div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}; 