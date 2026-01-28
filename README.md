# Developer Portfolio

A modern, responsive developer portfolio website built with Next.js, Tailwind CSS, and other cutting-edge technologies. This portfolio showcases your skills, projects, and achievements with an AI-powered developer rating system.

## ✨ Features

- **Modern Design**: Clean, professional, and visually appealing interface
- **Responsive Layout**: Optimized for all devices (desktop, tablet, mobile)
- **Interactive Animations**: Smooth animations using Framer Motion
- **GitHub Integration**: Automatically fetch and display your repositories
- **AI-Powered Rating**: Calculate developer rating based on code quality, activity, and popularity
- **Contact Form**: Functional contact form with validation
- **Social Links**: Showcase your social media and blog profiles
- **Dark Theme**: Modern dark theme with gradient accents
- **SEO Optimized**: Built-in SEO optimization for better search visibility

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Data Fetching**: React Query (TanStack Query)
- **Database**: Supabase (ready for integration)
- **Icons**: Lucide React
- **Language**: TypeScript
- **Deployment**: Vercel (recommended)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/developer-portfolio.git
   cd developer-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the portfolio.

## ⚙️ Configuration

### 1. Update Developer Information

Edit the `sampleDeveloperInfo` object in `app/page.tsx`:

```typescript
const sampleDeveloperInfo = {
  name: 'Your Name',
  email: 'your.email@example.com',
  phone: '+1 (555) 123-4567',
  github: 'https://github.com/yourusername',
  twitter: 'https://twitter.com/yourusername',
  linkedin: 'https://linkedin.com/in/yourusername',
  medium: 'https://medium.com/@yourusername',
  hashnode: 'https://yourusername.hashnode.dev',
};
```

### 2. Update Projects

Replace the sample repositories in `components/Projects.tsx` with your actual GitHub repositories, or integrate with the GitHub API by updating the `fetchGitHubRepos` function.

### 3. Customize Styling

- **Colors**: Update the color scheme in `tailwind.config.js`
- **Fonts**: Modify font imports in `app/globals.css`
- **Animations**: Customize animations in individual components

### 4. GitHub API Integration (Optional)

To fetch real GitHub data:

1. Get a GitHub Personal Access Token
2. Add it to your environment variables:
   ```bash
   NEXT_PUBLIC_GITHUB_TOKEN=your_github_token
   ```
3. Update the GitHub utility functions to use the token

## 📁 Project Structure

```
developer-portfolio/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── providers/         # Context providers
│   ├── About.tsx          # About section
│   ├── Contact.tsx        # Contact section
│   ├── DeveloperRating.tsx # AI rating widget
│   ├── Footer.tsx         # Footer component
│   ├── Header.tsx         # Navigation header
│   ├── Hero.tsx           # Hero section
│   └── Projects.tsx       # Projects showcase
├── store/                 # Zustand store
│   └── portfolioStore.ts  # Portfolio state management
├── utils/                 # Utility functions
│   └── github.ts          # GitHub API utilities
├── public/                # Static assets
└── ...config files
```

## 🎨 Customization

### Adding New Sections

1. Create a new component in the `components/` directory
2. Import and add it to `app/page.tsx`
3. Update the navigation in `components/Header.tsx`

### Modifying the Rating Algorithm

The developer rating is calculated in `utils/github.ts`. You can modify the `calculateDeveloperRating` function to use different metrics or weights.

### Styling Changes

- **Global styles**: Edit `app/globals.css`
- **Component styles**: Update Tailwind classes in individual components
- **Theme colors**: Modify `tailwind.config.js`

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with one click

### Other Platforms

The portfolio can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## 🔧 Environment Variables

Create a `.env.local` file for environment variables:

```bash
# GitHub API (optional)
NEXT_PUBLIC_GITHUB_TOKEN=your_github_token

# Supabase (if using database features)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Contact form (if using external service)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_emailjs_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

## 📱 Features Overview

### Hero Section
- Animated introduction with gradient text
- Call-to-action buttons
- Smooth scroll indicators

### About Section
- Personal introduction
- Skills showcase with animated tags
- Social media links
- Blog profile links
- Quick stats

### Projects Section
- GitHub repository cards
- Project descriptions and tech stacks
- Star and fork counts
- Language indicators
- Live demo links

### Developer Rating
- AI-powered rating calculation
- Animated circular progress indicators
- Detailed metrics breakdown
- Rating explanation

### Contact Section
- Contact information display
- Interactive contact form
- Availability status
- Form validation and submission

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [Lucide React](https://lucide.dev/) for beautiful icons
- [Vercel](https://vercel.com/) for seamless deployment

## 📞 Support

If you have any questions or need help with setup, feel free to:
- Open an issue on GitHub
- Contact me via the portfolio contact form
- Reach out on social media

---

**Happy coding!** 🚀 