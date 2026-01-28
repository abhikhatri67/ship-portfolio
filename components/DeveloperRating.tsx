'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, TrendingUp, Activity, Award, Code, GitBranch } from 'lucide-react';
import { usePortfolioStore } from '@/store/portfolioStore';

export const DeveloperRating = () => {
  const { developerRating, setDeveloperRating } = usePortfolioStore();
  const [animatedRatings, setAnimatedRatings] = useState({
    overall: 0,
    codeQuality: 0,
    activity: 0,
    popularity: 0,
  });

  // Sample rating data (replace with actual AI analysis)
  const sampleRating = {
    overall: 8.7,
    codeQuality: 9.2,
    activity: 8.1,
    popularity: 8.9,
    lastUpdated: new Date().toISOString(),
  };

  useEffect(() => {
    // Initialize with sample data
    setDeveloperRating(sampleRating);
  }, [setDeveloperRating]);

  useEffect(() => {
    if (developerRating) {
      // Animate the ratings
      const timer = setTimeout(() => {
        setAnimatedRatings({
          overall: developerRating.overall,
          codeQuality: developerRating.codeQuality,
          activity: developerRating.activity,
          popularity: developerRating.popularity,
        });
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [developerRating]);

  const getRatingColor = (rating: number) => {
    if (rating >= 9) return 'text-green-400';
    if (rating >= 7) return 'text-blue-400';
    if (rating >= 5) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRatingBgColor = (rating: number) => {
    if (rating >= 9) return 'from-green-500 to-emerald-500';
    if (rating >= 7) return 'from-blue-500 to-cyan-500';
    if (rating >= 5) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const CircularProgress = ({ value, size = 120, strokeWidth = 8 }: { value: number; size?: number; strokeWidth?: number }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (value / 10) * circumference;

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-slate-700"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#gradient)"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {value.toFixed(1)}
            </div>
            <div className="text-xs text-gray-400">/ 10</div>
          </div>
        </div>
      </div>
    );
  };

  const metrics = [
    {
      title: 'Code Quality',
      value: animatedRatings.codeQuality,
      icon: Code,
      description: 'Based on code structure, documentation, and best practices',
    },
    {
      title: 'GitHub Activity',
      value: animatedRatings.activity,
      icon: Activity,
      description: 'Commit frequency, contribution consistency, and engagement',
    },
    {
      title: 'Project Popularity',
      value: animatedRatings.popularity,
      icon: Star,
      description: 'Stars, forks, and community engagement across repositories',
    },
  ];

  if (!developerRating) {
    return (
      <section id="rating" className="py-20 bg-slate-800/50">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Calculating developer rating...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="rating" className="py-20 bg-slate-800/50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          {/* Section Title */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Developer <span className="text-green-400">Rating</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              AI-powered analysis of code quality, GitHub activity, and project popularity
            </p>
          </div>

          {/* Overall Rating */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-block relative">
              <CircularProgress value={animatedRatings.overall} size={200} strokeWidth={12} />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute -top-4 -right-4"
              >
                <Award className="text-yellow-400" size={32} />
              </motion.div>
            </div>
            <h3 className="text-3xl font-bold text-white mt-6 mb-2">Overall Rating</h3>
            <p className="text-gray-400">
              Last updated: {new Date(developerRating.lastUpdated).toLocaleDateString()}
            </p>
          </motion.div>

          {/* Detailed Metrics */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <motion.div
                  key={metric.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-blue-500 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Icon className="text-blue-400" size={24} />
                    <span className={`text-2xl font-bold ${getRatingColor(metric.value)}`}>
                      {metric.value.toFixed(1)}
                    </span>
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-2">{metric.title}</h4>
                  <p className="text-gray-400 text-sm mb-4">{metric.description}</p>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <motion.div
                      className={`h-2 rounded-full bg-gradient-to-r ${getRatingBgColor(metric.value)}`}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(metric.value / 10) * 100}%` }}
                      transition={{ duration: 1.5, delay: 0.5 + index * 0.1 }}
                      viewport={{ once: true }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Rating Explanation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="bg-slate-800 rounded-xl p-8 border border-slate-700"
          >
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="text-blue-400" size={24} />
              <h3 className="text-xl font-semibold text-white">How is this calculated?</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6 text-gray-300">
              <div>
                <h4 className="font-medium text-white mb-2">Code Quality Analysis</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Code structure and organization</li>
                  <li>• Documentation quality</li>
                  <li>• Best practices adherence</li>
                  <li>• Test coverage</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-white mb-2">Activity & Engagement</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Commit frequency and consistency</li>
                  <li>• Repository maintenance</li>
                  <li>• Community contributions</li>
                  <li>• Project popularity metrics</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};