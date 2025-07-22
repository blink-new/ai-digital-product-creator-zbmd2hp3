import { ProductGenerationRequest } from '../types/product'

export interface QuickIdea {
  id: string
  title: string
  description: string
  category: string
  productType: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  estimatedTime: string
  monetizationPotential: 'Low' | 'Medium' | 'High' | 'Very High'
  trendingScore: number
  tags: string[]
  formData: ProductGenerationRequest
  icon: string
  popularityRank: number
}

export class QuickIdeasService {
  private static quickIdeas: QuickIdea[] = [
    // AI & Technology
    {
      id: 'ai-productivity-guide',
      title: 'AI Productivity Mastery Guide',
      description: 'Complete guide to using AI tools for maximum productivity and efficiency',
      category: 'Technology',
      productType: 'ebook',
      difficulty: 'Intermediate',
      estimatedTime: '45-60 min',
      monetizationPotential: 'Very High',
      trendingScore: 95,
      tags: ['AI', 'Productivity', 'Tools', 'Automation'],
      icon: '🤖',
      popularityRank: 1,
      formData: {
        productType: 'ebook',
        niche: 'AI-Powered Productivity Tools and Workflows',
        targetAudience: 'Busy professionals, entrepreneurs, and content creators who want to leverage AI to boost their productivity and streamline their workflows',
        tone: 'Professional',
        length: 'Medium (15-25 pages)',
        additionalRequirements: 'Include specific AI tool recommendations, step-by-step workflows, productivity templates, and real-world case studies. Add screenshots and practical examples.',
        selectedModels: ['kimi', 'gemma', 'qwen3']
      }
    },
    {
      id: 'chatgpt-prompts-library',
      title: 'ChatGPT Prompts Library',
      description: '500+ proven ChatGPT prompts for business, marketing, and creativity',
      category: 'Technology',
      productType: 'prompt-library',
      difficulty: 'Beginner',
      estimatedTime: '30-45 min',
      monetizationPotential: 'Very High',
      trendingScore: 92,
      tags: ['ChatGPT', 'Prompts', 'AI', 'Business'],
      icon: '🔮',
      popularityRank: 2,
      formData: {
        productType: 'prompt-library',
        niche: 'ChatGPT Prompts for Business and Marketing',
        targetAudience: 'Marketers, business owners, content creators, and professionals who want to maximize their ChatGPT usage for business growth',
        tone: 'Professional',
        length: 'Long (30-50 pages)',
        additionalRequirements: 'Organize prompts by category (marketing, sales, content creation, analysis, etc.). Include prompt templates, examples of outputs, and customization tips.',
        selectedModels: ['kimi', 'gemma', 'qwen3']
      }
    },

    // Business & Entrepreneurship
    {
      id: 'side-hustle-starter',
      title: 'Side Hustle Starter Kit',
      description: '30 profitable side hustle ideas with step-by-step launch guides',
      category: 'Business',
      productType: 'startup-kit',
      difficulty: 'Intermediate',
      estimatedTime: '60-90 min',
      monetizationPotential: 'Very High',
      trendingScore: 88,
      tags: ['Side Hustle', 'Entrepreneurship', 'Passive Income', 'Business'],
      icon: '🚀',
      popularityRank: 3,
      formData: {
        productType: 'startup-kit',
        niche: 'Profitable Side Hustles for 2024',
        targetAudience: 'Working professionals, students, and stay-at-home parents looking to create additional income streams without quitting their day job',
        tone: 'Inspirational',
        length: 'Comprehensive (50+ pages)',
        additionalRequirements: 'Include 30 different side hustle ideas, startup costs, time requirements, profit potential, and step-by-step launch guides for each. Add templates and checklists.',
        selectedModels: ['kimi', 'mai', 'qwen3']
      }
    },
    {
      id: 'freelance-proposal-kit',
      title: 'Freelance Proposal Mastery Kit',
      description: 'Winning proposal templates and strategies for freelancers',
      category: 'Business',
      productType: 'freelance-kit',
      difficulty: 'Intermediate',
      estimatedTime: '40-60 min',
      monetizationPotential: 'High',
      trendingScore: 85,
      tags: ['Freelancing', 'Proposals', 'Templates', 'Business'],
      icon: '💼',
      popularityRank: 4,
      formData: {
        productType: 'freelance-kit',
        niche: 'High-Converting Freelance Proposals',
        targetAudience: 'Freelancers, consultants, and service providers who want to win more clients and charge higher rates through better proposals',
        tone: 'Professional',
        length: 'Medium (15-25 pages)',
        additionalRequirements: 'Include 10+ proposal templates for different industries, pricing strategies, follow-up sequences, and negotiation tactics. Add real examples and case studies.',
        selectedModels: ['kimi', 'mai', 'gemma']
      }
    },

    // Health & Wellness
    {
      id: 'mindfulness-journal',
      title: '30-Day Mindfulness Journal',
      description: 'Guided mindfulness practice with daily prompts and exercises',
      category: 'Wellness',
      productType: 'journal',
      difficulty: 'Beginner',
      estimatedTime: '30-45 min',
      monetizationPotential: 'High',
      trendingScore: 82,
      tags: ['Mindfulness', 'Mental Health', 'Wellness', 'Self-Care'],
      icon: '🧘',
      popularityRank: 5,
      formData: {
        productType: 'journal',
        niche: 'Mindfulness and Mental Wellness',
        targetAudience: 'Stressed professionals, students, and anyone looking to improve their mental health and develop a consistent mindfulness practice',
        tone: 'Friendly',
        length: 'Long (30-50 pages)',
        additionalRequirements: 'Include 30 days of guided prompts, mindfulness exercises, reflection questions, progress tracking, and bonus meditation guides. Make it printable and interactive.',
        selectedModels: ['gemma', 'qwen3', 'kimi']
      }
    },
    {
      id: 'productivity-planner',
      title: 'Ultimate Productivity Planner',
      description: 'Complete planning system for maximum productivity and goal achievement',
      category: 'Productivity',
      productType: 'planner',
      difficulty: 'Beginner',
      estimatedTime: '35-50 min',
      monetizationPotential: 'Very High',
      trendingScore: 90,
      tags: ['Productivity', 'Planning', 'Goals', 'Time Management'],
      icon: '📅',
      popularityRank: 6,
      formData: {
        productType: 'planner',
        niche: 'Productivity and Goal Achievement System',
        targetAudience: 'Ambitious professionals, entrepreneurs, and students who want to maximize their productivity and achieve their goals faster',
        tone: 'Professional',
        length: 'Comprehensive (50+ pages)',
        additionalRequirements: 'Include daily, weekly, monthly, and yearly planning pages, goal-setting frameworks, habit trackers, time-blocking templates, and productivity tips. Make it printable.',
        selectedModels: ['kimi', 'nemotron', 'gemma']
      }
    },

    // Finance & Investment
    {
      id: 'budget-mastery-kit',
      title: 'Budget Mastery Kit',
      description: 'Complete budgeting system with templates and strategies',
      category: 'Finance',
      productType: 'budget-sheet',
      difficulty: 'Beginner',
      estimatedTime: '25-40 min',
      monetizationPotential: 'High',
      trendingScore: 78,
      tags: ['Budgeting', 'Finance', 'Money Management', 'Savings'],
      icon: '💰',
      popularityRank: 7,
      formData: {
        productType: 'budget-sheet',
        niche: 'Personal Finance and Budgeting Mastery',
        targetAudience: 'Young professionals, families, and anyone struggling with money management who wants to take control of their finances and build wealth',
        tone: 'Educational',
        length: 'Medium (15-25 pages)',
        additionalRequirements: 'Include multiple budgeting templates, debt payoff strategies, savings challenges, expense tracking sheets, and financial goal-setting worksheets. Add tips for different income levels.',
        selectedModels: ['kimi', 'mai', 'gemma']
      }
    },

    // Marketing & Social Media
    {
      id: 'instagram-growth-guide',
      title: 'Instagram Growth Blueprint',
      description: 'Complete strategy to grow Instagram followers and engagement organically',
      category: 'Marketing',
      productType: 'ebook',
      difficulty: 'Intermediate',
      estimatedTime: '40-55 min',
      monetizationPotential: 'Very High',
      trendingScore: 87,
      tags: ['Instagram', 'Social Media', 'Growth', 'Marketing'],
      icon: '📱',
      popularityRank: 8,
      formData: {
        productType: 'ebook',
        niche: 'Instagram Growth and Engagement Strategies',
        targetAudience: 'Content creators, small business owners, influencers, and marketers who want to grow their Instagram presence organically and monetize their following',
        tone: 'Conversational',
        length: 'Medium (15-25 pages)',
        additionalRequirements: 'Include content strategy templates, hashtag research methods, engagement tactics, story templates, and monetization strategies. Add real examples and case studies.',
        selectedModels: ['gemma', 'qwen3', 'kimi']
      }
    },
    {
      id: 'email-marketing-templates',
      title: 'Email Marketing Template Collection',
      description: '50+ high-converting email templates for every business need',
      category: 'Marketing',
      productType: 'email-templates',
      difficulty: 'Beginner',
      estimatedTime: '30-45 min',
      monetizationPotential: 'High',
      trendingScore: 83,
      tags: ['Email Marketing', 'Templates', 'Conversion', 'Business'],
      icon: '📧',
      popularityRank: 9,
      formData: {
        productType: 'email-templates',
        niche: 'High-Converting Email Marketing Templates',
        targetAudience: 'Small business owners, marketers, and entrepreneurs who want to improve their email marketing results and save time on copywriting',
        tone: 'Professional',
        length: 'Long (30-50 pages)',
        additionalRequirements: 'Include welcome sequences, sales emails, newsletter templates, abandoned cart emails, and follow-up sequences. Add subject line formulas and A/B testing tips.',
        selectedModels: ['kimi', 'gemma', 'mai']
      }
    },

    // Content Creation
    {
      id: 'content-calendar-system',
      title: 'Content Calendar Mastery System',
      description: '90-day content calendar with ideas, templates, and scheduling strategies',
      category: 'Content',
      productType: 'social-media-calendar',
      difficulty: 'Intermediate',
      estimatedTime: '50-70 min',
      monetizationPotential: 'High',
      trendingScore: 80,
      tags: ['Content Creation', 'Social Media', 'Planning', 'Marketing'],
      icon: '📅',
      popularityRank: 10,
      formData: {
        productType: 'social-media-calendar',
        niche: 'Content Planning and Social Media Strategy',
        targetAudience: 'Content creators, social media managers, and business owners who want to plan and create consistent, engaging content across all platforms',
        tone: 'Professional',
        length: 'Comprehensive (50+ pages)',
        additionalRequirements: 'Include 90 days of content ideas, posting schedules for all major platforms, content templates, hashtag strategies, and analytics tracking sheets.',
        selectedModels: ['kimi', 'gemma', 'qwen3']
      }
    },

    // Education & Skills
    {
      id: 'online-course-blueprint',
      title: 'Online Course Creation Blueprint',
      description: 'Step-by-step guide to creating and launching profitable online courses',
      category: 'Education',
      productType: 'course-planner',
      difficulty: 'Advanced',
      estimatedTime: '90-120 min',
      monetizationPotential: 'Very High',
      trendingScore: 86,
      tags: ['Online Courses', 'Education', 'Business', 'Teaching'],
      icon: '🎓',
      popularityRank: 11,
      formData: {
        productType: 'course-planner',
        niche: 'Online Course Creation and Launch Strategy',
        targetAudience: 'Experts, coaches, consultants, and professionals who want to monetize their knowledge by creating and selling online courses',
        tone: 'Professional',
        length: 'Comprehensive (50+ pages)',
        additionalRequirements: 'Include course planning templates, content creation workflows, marketing strategies, pricing models, and launch sequences. Add platform comparisons and technical setup guides.',
        selectedModels: ['kimi', 'mai', 'nemotron']
      }
    },

    // Lifestyle & Personal Development
    {
      id: 'morning-routine-guide',
      title: 'Perfect Morning Routine Guide',
      description: 'Science-backed morning routines for productivity and wellness',
      category: 'Lifestyle',
      productType: 'ebook',
      difficulty: 'Beginner',
      estimatedTime: '25-35 min',
      monetizationPotential: 'Medium',
      trendingScore: 75,
      tags: ['Morning Routine', 'Productivity', 'Wellness', 'Habits'],
      icon: '🌅',
      popularityRank: 12,
      formData: {
        productType: 'ebook',
        niche: 'Morning Routines for Success and Wellness',
        targetAudience: 'Busy professionals, students, and anyone who wants to start their day with intention and boost their productivity and well-being',
        tone: 'Inspirational',
        length: 'Short (5-10 pages)',
        additionalRequirements: 'Include different routine options for various lifestyles, scientific backing, habit-building strategies, and customizable templates. Add troubleshooting tips.',
        selectedModels: ['gemma', 'qwen3', 'kimi']
      }
    },

    // Trending & Seasonal
    {
      id: 'new-year-goals-planner',
      title: 'New Year Goals Achievement Planner',
      description: 'Complete system for setting and achieving your New Year goals',
      category: 'Productivity',
      productType: 'planner',
      difficulty: 'Beginner',
      estimatedTime: '40-55 min',
      monetizationPotential: 'High',
      trendingScore: 89,
      tags: ['Goals', 'New Year', 'Planning', 'Achievement'],
      icon: '🎯',
      popularityRank: 13,
      formData: {
        productType: 'planner',
        niche: 'Goal Setting and Achievement for the New Year',
        targetAudience: 'Anyone looking to make meaningful changes in their life and achieve their goals in the new year, especially those who have struggled with goal achievement in the past',
        tone: 'Inspirational',
        length: 'Medium (15-25 pages)',
        additionalRequirements: 'Include goal-setting frameworks, monthly and quarterly reviews, habit trackers, vision board templates, and accountability systems. Make it motivational and actionable.',
        selectedModels: ['gemma', 'kimi', 'qwen3']
      }
    },

    // Niche & Specialized
    {
      id: 'remote-work-setup',
      title: 'Remote Work Setup Guide',
      description: 'Complete guide to creating the perfect remote work environment',
      category: 'Business',
      productType: 'ebook',
      difficulty: 'Beginner',
      estimatedTime: '30-45 min',
      monetizationPotential: 'High',
      trendingScore: 84,
      tags: ['Remote Work', 'Productivity', 'Home Office', 'Technology'],
      icon: '🏠',
      popularityRank: 14,
      formData: {
        productType: 'ebook',
        niche: 'Remote Work Optimization and Home Office Setup',
        targetAudience: 'Remote workers, digital nomads, and professionals transitioning to work-from-home who want to optimize their productivity and work environment',
        tone: 'Professional',
        length: 'Medium (15-25 pages)',
        additionalRequirements: 'Include equipment recommendations, ergonomic setup guides, productivity tips, communication strategies, and work-life balance techniques. Add budget-friendly options.',
        selectedModels: ['kimi', 'gemma', 'qwen3']
      }
    },

    {
      id: 'digital-detox-challenge',
      title: '7-Day Digital Detox Challenge',
      description: 'Guided challenge to reduce screen time and improve digital wellness',
      category: 'Wellness',
      productType: 'digital-detox',
      difficulty: 'Beginner',
      estimatedTime: '20-30 min',
      monetizationPotential: 'Medium',
      trendingScore: 77,
      tags: ['Digital Detox', 'Wellness', 'Mindfulness', 'Balance'],
      icon: '📵',
      popularityRank: 15,
      formData: {
        productType: 'digital-detox',
        niche: 'Digital Wellness and Screen Time Management',
        targetAudience: 'People feeling overwhelmed by technology, parents concerned about family screen time, and anyone wanting to improve their relationship with digital devices',
        tone: 'Friendly',
        length: 'Short (5-10 pages)',
        additionalRequirements: 'Include daily challenges, alternative activities, tracking sheets, tips for maintaining balance, and strategies for different age groups. Make it family-friendly.',
        selectedModels: ['gemma', 'qwen3', 'kimi']
      }
    }
  ]

  static getAllQuickIdeas(): QuickIdea[] {
    return this.quickIdeas.sort((a, b) => b.trendingScore - a.trendingScore)
  }

  static getQuickIdeasByCategory(category: string): QuickIdea[] {
    if (category === 'All') {
      return this.getAllQuickIdeas()
    }
    return this.quickIdeas
      .filter(idea => idea.category === category)
      .sort((a, b) => b.trendingScore - a.trendingScore)
  }

  static getQuickIdeasByProductType(productType: string): QuickIdea[] {
    return this.quickIdeas
      .filter(idea => idea.productType === productType)
      .sort((a, b) => b.trendingScore - a.trendingScore)
  }

  static getTrendingQuickIdeas(limit: number = 10): QuickIdea[] {
    return this.quickIdeas
      .filter(idea => idea.trendingScore >= 80)
      .sort((a, b) => b.trendingScore - a.trendingScore)
      .slice(0, limit)
  }

  static getQuickIdeasByDifficulty(difficulty: 'Beginner' | 'Intermediate' | 'Advanced'): QuickIdea[] {
    return this.quickIdeas
      .filter(idea => idea.difficulty === difficulty)
      .sort((a, b) => b.trendingScore - a.trendingScore)
  }

  static getQuickIdeasByMonetization(potential: 'Low' | 'Medium' | 'High' | 'Very High'): QuickIdea[] {
    return this.quickIdeas
      .filter(idea => idea.monetizationPotential === potential)
      .sort((a, b) => b.trendingScore - a.trendingScore)
  }

  static searchQuickIdeas(query: string): QuickIdea[] {
    const searchTerm = query.toLowerCase()
    return this.quickIdeas
      .filter(idea => 
        idea.title.toLowerCase().includes(searchTerm) ||
        idea.description.toLowerCase().includes(searchTerm) ||
        idea.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        idea.category.toLowerCase().includes(searchTerm)
      )
      .sort((a, b) => b.trendingScore - a.trendingScore)
  }

  static getQuickIdeaById(id: string): QuickIdea | undefined {
    return this.quickIdeas.find(idea => idea.id === id)
  }

  static getRandomQuickIdeas(count: number = 5): QuickIdea[] {
    const shuffled = [...this.quickIdeas].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }

  static getQuickIdeasByTags(tags: string[]): QuickIdea[] {
    return this.quickIdeas
      .filter(idea => 
        tags.some(tag => 
          idea.tags.some(ideaTag => 
            ideaTag.toLowerCase().includes(tag.toLowerCase())
          )
        )
      )
      .sort((a, b) => b.trendingScore - a.trendingScore)
  }
}