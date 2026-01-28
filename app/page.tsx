'use client';

import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { Experience } from '@/components/Experience';
import { Education } from '@/components/Education';
import { Projects } from '@/components/Projects';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { usePortfolioStore } from '@/store/portfolioStore';

// Developer information
const developerInfo = {
  name: 'Abhishek Khatri',
  email: 'abhikhatri67@gmail.com',
  phone: '+91-7983142392',
  github: 'https://github.com/abhikhatri67',
  twitter: 'https://twitter.com/abhikhatri67',
  linkedin: 'https://www.linkedin.com/in/abhikhatri67/',
  medium: 'https://medium.com/@abhikhatri67',
  portfolio: 'https://abhikhatri67.github.io/',
};

export default function Home() {
  const { setDeveloperInfo } = usePortfolioStore();

  useEffect(() => {
    // Initialize with developer data
    setDeveloperInfo(developerInfo);
  }, [setDeveloperInfo]);

  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <About />
      <Experience />
      <Education />
      <Projects />
      <Contact />
      <Footer />
    </main>
  );
} 