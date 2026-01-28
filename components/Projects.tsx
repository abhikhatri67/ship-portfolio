'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink, Star, GitFork, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { usePortfolioStore } from '@/store/portfolioStore';
import { fetchGitHubRepos, getTopRepositories } from '@/utils/github';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const Projects = () => {
  const { selectedRepos, setSelectedRepos, setRepositories, developerInfo } = usePortfolioStore();

  // Fetch real GitHub repositories
  const GITHUB_USERNAME = 'abhikhatri67';

  const { data: repos, isLoading, error } = useQuery({
    queryKey: ['github-repos', GITHUB_USERNAME],
    queryFn: () => fetchGitHubRepos(GITHUB_USERNAME),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    if (repos) {
      setRepositories(repos);
      // Get top 6 repositories
      const topRepos = getTopRepositories(repos, 6);
      setSelectedRepos(topRepos);
    }
  }, [repos, setRepositories, setSelectedRepos]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getLanguageColor = (language: string) => {
    const colors: { [key: string]: string } = {
      JavaScript: 'bg-yellow-500',
      TypeScript: 'bg-blue-500',
      Python: 'bg-green-500',
      Java: 'bg-orange-500',
      'C++': 'bg-purple-500',
      React: 'bg-cyan-500',
    };
    return colors[language] || 'bg-gray-500';
  };

  return (
    <section id="projects" className="py-20">
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
              Featured <span className="text-purple-400">Projects</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Here are some of my best projects that showcase my skills and passion for development.
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center text-gray-400">
              <p>Loading projects from GitHub...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center text-red-400">
              <p>Failed to load projects. Please try again later.</p>
            </div>
          )}

          {/* Projects Grid */}
          {!isLoading && !error && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {selectedRepos.map((repo, index) => (
                <motion.div
                  key={repo.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                >
                  <Card className="bg-slate-800 border-slate-700 hover:border-purple-500 transition-all duration-300 h-full group">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <Github size={20} className="text-gray-400 flex-shrink-0" />
                          <CardTitle className="text-lg text-white group-hover:text-purple-400 transition-colors duration-300 truncate">
                            {repo.name}
                          </CardTitle>
                        </div>
                        <motion.a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="text-gray-400 hover:text-white transition-colors duration-300 flex-shrink-0"
                        >
                          <ExternalLink size={18} />
                        </motion.a>
                      </div>
                      <CardDescription className="line-clamp-3 text-gray-300">
                        {repo.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Topics */}
                      {repo.topics.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {repo.topics.slice(0, 3).map((topic) => (
                            <Badge
                              key={topic}
                              variant="secondary"
                              className="bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-500/30 text-xs"
                            >
                              {topic}
                            </Badge>
                          ))}
                          {repo.topics.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{repo.topics.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Star size={14} />
                            <span>{repo.stargazers_count}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <GitFork size={14} />
                            <span>{repo.forks_count}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getLanguageColor(repo.language)}`}></div>
                          <span className="text-xs">{repo.language}</span>
                        </div>
                      </div>

                      {/* Last Updated */}
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar size={12} />
                        <span>Updated {formatDate(repo.updated_at)}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* View More Button */}
          {!isLoading && !error && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <motion.a
                href={developerInfo?.github || `https://github.com/${GITHUB_USERNAME}`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Github size={20} />
                View All Projects on GitHub
              </motion.a>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}; 