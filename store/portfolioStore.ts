import { create } from 'zustand';

export interface Repository {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  topics: string[];
  updated_at: string;
}

export interface DeveloperInfo {
  name: string;
  email: string;
  phone: string;
  github: string;
  twitter?: string;
  linkedin?: string;
  medium?: string;
  hashnode?: string;
}

export interface DeveloperRating {
  overall: number;
  codeQuality: number;
  activity: number;
  popularity: number;
  lastUpdated: string;
}

interface PortfolioState {
  developerInfo: DeveloperInfo | null;
  repositories: Repository[];
  selectedRepos: Repository[];
  developerRating: DeveloperRating | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setDeveloperInfo: (info: DeveloperInfo) => void;
  setRepositories: (repos: Repository[]) => void;
  setSelectedRepos: (repos: Repository[]) => void;
  setDeveloperRating: (rating: DeveloperRating) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  developerInfo: null,
  repositories: [],
  selectedRepos: [],
  developerRating: null,
  isLoading: false,
  error: null,

  setDeveloperInfo: (info) => set({ developerInfo: info }),
  setRepositories: (repos) => set({ repositories: repos }),
  setSelectedRepos: (repos) => set({ selectedRepos: repos }),
  setDeveloperRating: (rating) => set({ developerRating: rating }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
})); 