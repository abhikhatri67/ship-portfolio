'use client';

import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Heart } from 'lucide-react';
import { usePortfolioStore } from '@/store/portfolioStore';

export const Footer = () => {
  const { developerInfo } = usePortfolioStore();

  const socialLinks = [
    {
      name: 'GitHub',
      url: developerInfo?.github,
      icon: Github,
    },
    {
      name: 'Twitter',
      url: developerInfo?.twitter,
      icon: Twitter,
    },
    {
      name: 'LinkedIn',
      url: developerInfo?.linkedin,
      icon: Linkedin,
    },
  ];

  return (
    <footer className="py-12 bg-slate-900 border-t border-slate-800">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          {/* Main Footer Content */}
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">
                <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  {developerInfo?.name || 'Developer'}
                </span>
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Lead Software Engineer with 9.5+ years of experience building
                scalable web applications and leading high-performing teams.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {['Home', 'About', 'Experience', 'Education', 'Projects', 'Contact'].map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => {
                        const element = document.querySelector(`#${item.toLowerCase()}`);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="text-gray-400 hover:text-white transition-colors duration-300"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Connect</h4>
              <div className="flex space-x-4">
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
                      className="p-3 bg-slate-800 text-gray-400 rounded-lg hover:text-white hover:bg-slate-700 transition-all duration-300"
                    >
                      <Icon size={20} />
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-slate-800">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm mb-4 md:mb-0">
                © {new Date().getFullYear()} {developerInfo?.name || 'Developer'}. All rights reserved.
              </p>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <span>Made with</span>
                <Heart className="text-red-400" size={16} />
                <span>using Next.js & Tailwind CSS</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}; 