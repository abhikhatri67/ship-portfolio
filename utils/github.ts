import axios from 'axios';
import { Repository } from '@/store/portfolioStore';

const GITHUB_API_BASE = 'https://api.github.com';

export interface GitHubUser {
  login: string;
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  avatar_url: string;
  html_url: string;
}

export const fetchGitHubUser = async (username: string): Promise<GitHubUser> => {
  try {
    const response = await axios.get(`${GITHUB_API_BASE}/users/${username}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching GitHub user:', error);
    throw new Error('Failed to fetch GitHub user data');
  }
};

export const fetchGitHubRepos = async (username: string): Promise<Repository[]> => {
  try {
    const response = await axios.get(
      `${GITHUB_API_BASE}/users/${username}/repos?sort=updated&per_page=100`
    );
    
    return response.data.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description || 'No description available',
      html_url: repo.html_url,
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      language: repo.language || 'Unknown',
      topics: repo.topics || [],
      updated_at: repo.updated_at,
    }));
  } catch (error) {
    console.error('Error fetching GitHub repositories:', error);
    throw new Error('Failed to fetch GitHub repositories');
  }
};

export const calculateDeveloperRating = (repos: Repository[], user: GitHubUser) => {
  // Simple algorithm to calculate developer rating
  const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
  const recentActivity = repos.filter(repo => {
    const lastUpdate = new Date(repo.updated_at);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    return lastUpdate > sixMonthsAgo;
  }).length;

  // Calculate individual metrics (0-10 scale)
  const codeQuality = Math.min(10, (totalStars / 10) + (repos.length / 5) + 5);
  const activity = Math.min(10, (recentActivity / repos.length) * 10);
  const popularity = Math.min(10, (totalStars / 50) + (totalForks / 20) + 3);
  
  // Calculate overall rating
  const overall = (codeQuality + activity + popularity) / 3;

  return {
    overall: Math.round(overall * 10) / 10,
    codeQuality: Math.round(codeQuality * 10) / 10,
    activity: Math.round(activity * 10) / 10,
    popularity: Math.round(popularity * 10) / 10,
    lastUpdated: new Date().toISOString(),
  };
};

export const getTopRepositories = (repos: Repository[], count: number = 3): Repository[] => {
  return repos
    .sort((a, b) => {
      // Sort by stars, then by forks, then by recent activity
      const scoreA = a.stargazers_count * 2 + a.forks_count + (new Date(a.updated_at).getTime() / 1000000000);
      const scoreB = b.stargazers_count * 2 + b.forks_count + (new Date(b.updated_at).getTime() / 1000000000);
      return scoreB - scoreA;
    })
    .slice(0, count);
}; 