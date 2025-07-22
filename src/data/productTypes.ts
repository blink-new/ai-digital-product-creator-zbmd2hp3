import { ProductType } from '../types/product'

export const productTypes: ProductType[] = [
  {
    id: 'ebook',
    name: 'eBook',
    description: 'Comprehensive digital books on any topic',
    category: 'Content',
    icon: '📚',
    estimatedTime: '30-60 min',
    difficulty: 'Intermediate',
    monetizationPotential: 'High'
  },
  {
    id: 'planner',
    name: 'Printable Planner',
    description: 'Customizable planners for productivity and organization',
    category: 'Productivity',
    icon: '📅',
    estimatedTime: '20-40 min',
    difficulty: 'Beginner',
    monetizationPotential: 'Very High'
  },
  {
    id: 'worksheet',
    name: 'Worksheet',
    description: 'Interactive worksheets for learning and practice',
    category: 'Education',
    icon: '📝',
    estimatedTime: '15-30 min',
    difficulty: 'Beginner',
    monetizationPotential: 'Medium'
  },
  {
    id: 'notion-template',
    name: 'Notion Template',
    description: 'Professional Notion templates for various use cases',
    category: 'Productivity',
    icon: '🗂️',
    estimatedTime: '25-45 min',
    difficulty: 'Intermediate',
    monetizationPotential: 'High'
  },
  {
    id: 'journal',
    name: 'Journal',
    description: 'Guided journals for personal development',
    category: 'Wellness',
    icon: '📖',
    estimatedTime: '20-35 min',
    difficulty: 'Beginner',
    monetizationPotential: 'High'
  },
  {
    id: 'swipe-file',
    name: 'Swipe File',
    description: 'Collection of proven marketing copy and templates',
    category: 'Marketing',
    icon: '💼',
    estimatedTime: '15-25 min',
    difficulty: 'Advanced',
    monetizationPotential: 'Very High'
  },
  {
    id: 'sales-funnel',
    name: 'Sales Funnel',
    description: 'Complete sales funnel templates and strategies',
    category: 'Marketing',
    icon: '🎯',
    estimatedTime: '45-90 min',
    difficulty: 'Advanced',
    monetizationPotential: 'Very High'
  },
  {
    id: 'digital-business-card',
    name: 'Digital Business Card',
    description: 'Modern digital business card templates',
    category: 'Business',
    icon: '💳',
    estimatedTime: '10-20 min',
    difficulty: 'Beginner',
    monetizationPotential: 'Medium'
  },
  {
    id: 'mini-course',
    name: 'Mini-Course',
    description: 'Structured mini-courses on specific topics',
    category: 'Education',
    icon: '🎓',
    estimatedTime: '60-120 min',
    difficulty: 'Advanced',
    monetizationPotential: 'Very High'
  },
  {
    id: 'affirmation-cards',
    name: 'Affirmation Cards',
    description: 'Inspirational affirmation card sets',
    category: 'Wellness',
    icon: '✨',
    estimatedTime: '15-30 min',
    difficulty: 'Beginner',
    monetizationPotential: 'Medium'
  },
  {
    id: 'lead-magnet',
    name: 'Lead Magnet',
    description: 'High-converting lead magnets for email capture',
    category: 'Marketing',
    icon: '🧲',
    estimatedTime: '20-40 min',
    difficulty: 'Intermediate',
    monetizationPotential: 'High'
  },
  {
    id: 'startup-kit',
    name: 'Niche Startup Kit',
    description: 'Complete startup guides for specific niches',
    category: 'Business',
    icon: '🚀',
    estimatedTime: '90-180 min',
    difficulty: 'Advanced',
    monetizationPotential: 'Very High'
  },
  {
    id: 'ai-cheat-sheet',
    name: 'AI Tools Cheat Sheet',
    description: 'Comprehensive guides to AI tools and prompts',
    category: 'Technology',
    icon: '🤖',
    estimatedTime: '30-60 min',
    difficulty: 'Intermediate',
    monetizationPotential: 'High'
  },
  {
    id: 'email-templates',
    name: 'Email Templates',
    description: 'Professional email templates for various purposes',
    category: 'Marketing',
    icon: '📧',
    estimatedTime: '20-40 min',
    difficulty: 'Beginner',
    monetizationPotential: 'Medium'
  },
  {
    id: 'social-media-calendar',
    name: 'Social Media Calendar',
    description: 'Content calendars for social media planning',
    category: 'Marketing',
    icon: '📱',
    estimatedTime: '25-45 min',
    difficulty: 'Intermediate',
    monetizationPotential: 'High'
  },
  {
    id: 'content-vault',
    name: 'Content Idea Vault',
    description: 'Massive collections of content ideas and prompts',
    category: 'Content',
    icon: '💡',
    estimatedTime: '30-60 min',
    difficulty: 'Intermediate',
    monetizationPotential: 'High'
  },
  {
    id: 'freelance-kit',
    name: 'Freelance Proposal Kit',
    description: 'Complete freelance proposal templates and guides',
    category: 'Business',
    icon: '💼',
    estimatedTime: '40-80 min',
    difficulty: 'Intermediate',
    monetizationPotential: 'High'
  },
  {
    id: 'productivity-tracker',
    name: 'Productivity Tracker',
    description: 'Advanced productivity tracking systems',
    category: 'Productivity',
    icon: '⚡',
    estimatedTime: '20-40 min',
    difficulty: 'Beginner',
    monetizationPotential: 'Medium'
  },
  {
    id: 'wellness-challenge',
    name: 'Wellness Challenge',
    description: '30-day wellness and fitness challenges',
    category: 'Wellness',
    icon: '🌱',
    estimatedTime: '45-90 min',
    difficulty: 'Intermediate',
    monetizationPotential: 'High'
  },
  {
    id: 'vision-board-kit',
    name: 'Vision Board Kit',
    description: 'Complete vision board creation guides and templates',
    category: 'Wellness',
    icon: '🎨',
    estimatedTime: '30-60 min',
    difficulty: 'Beginner',
    monetizationPotential: 'Medium'
  },
  {
    id: 'course-planner',
    name: 'Online Course Planner',
    description: 'Comprehensive course creation and planning templates',
    category: 'Education',
    icon: '📚',
    estimatedTime: '60-120 min',
    difficulty: 'Advanced',
    monetizationPotential: 'Very High'
  },
  {
    id: 'prompt-library',
    name: 'Prompt Library',
    description: 'Curated collections of AI prompts for various uses',
    category: 'Technology',
    icon: '🔮',
    estimatedTime: '25-50 min',
    difficulty: 'Intermediate',
    monetizationPotential: 'High'
  },
  {
    id: 'masterclass-guide',
    name: 'Masterclass Guide',
    description: 'In-depth masterclass content on specialized topics',
    category: 'Education',
    icon: '👑',
    estimatedTime: '90-180 min',
    difficulty: 'Advanced',
    monetizationPotential: 'Very High'
  },
  {
    id: 'spiritual-guide',
    name: 'Spiritual Guide',
    description: 'Spiritual development and mindfulness guides',
    category: 'Wellness',
    icon: '🕯️',
    estimatedTime: '40-80 min',
    difficulty: 'Intermediate',
    monetizationPotential: 'High'
  },
  {
    id: 'budget-sheet',
    name: 'Finance Budgeting Sheet',
    description: 'Comprehensive financial planning and budgeting tools',
    category: 'Finance',
    icon: '💰',
    estimatedTime: '30-60 min',
    difficulty: 'Intermediate',
    monetizationPotential: 'High'
  },
  {
    id: 'manifestation-kit',
    name: 'Manifestation Kit',
    description: 'Complete manifestation guides and tracking tools',
    category: 'Wellness',
    icon: '🌟',
    estimatedTime: '35-70 min',
    difficulty: 'Beginner',
    monetizationPotential: 'High'
  },
  {
    id: 'branding-guide',
    name: 'Branding Guide',
    description: 'Professional brand development guides and templates',
    category: 'Business',
    icon: '🎨',
    estimatedTime: '60-120 min',
    difficulty: 'Advanced',
    monetizationPotential: 'Very High'
  },
  {
    id: 'portfolio-template',
    name: 'Portfolio Template',
    description: 'Professional portfolio templates for various industries',
    category: 'Business',
    icon: '📁',
    estimatedTime: '40-80 min',
    difficulty: 'Intermediate',
    monetizationPotential: 'Medium'
  },
  {
    id: 'legal-docs',
    name: 'Legal Starter Docs',
    description: 'Essential legal document templates for businesses',
    category: 'Business',
    icon: '⚖️',
    estimatedTime: '45-90 min',
    difficulty: 'Advanced',
    monetizationPotential: 'High'
  },
  {
    id: 'entrepreneur-pack',
    name: 'Entrepreneur Starter Pack',
    description: 'Complete entrepreneurship guides and resources',
    category: 'Business',
    icon: '🏢',
    estimatedTime: '120-240 min',
    difficulty: 'Advanced',
    monetizationPotential: 'Very High'
  },
  {
    id: 'kids-activity-book',
    name: 'Children\'s Activity Book',
    description: 'Educational and fun activity books for children',
    category: 'Education',
    icon: '🧸',
    estimatedTime: '60-120 min',
    difficulty: 'Intermediate',
    monetizationPotential: 'High'
  },
  {
    id: 'relationship-pack',
    name: 'Relationship Advice Pack',
    description: 'Comprehensive relationship guidance and exercises',
    category: 'Wellness',
    icon: '💕',
    estimatedTime: '50-100 min',
    difficulty: 'Intermediate',
    monetizationPotential: 'High'
  },
  {
    id: 'trend-guide',
    name: 'Trend Prediction Guide',
    description: 'Industry trend analysis and prediction guides',
    category: 'Business',
    icon: '📈',
    estimatedTime: '40-80 min',
    difficulty: 'Advanced',
    monetizationPotential: 'High'
  },
  {
    id: 'travel-planner',
    name: 'Travel Itinerary Planner',
    description: 'Detailed travel planning templates and guides',
    category: 'Lifestyle',
    icon: '✈️',
    estimatedTime: '30-60 min',
    difficulty: 'Beginner',
    monetizationPotential: 'Medium'
  },
  {
    id: 'language-cheat-sheet',
    name: 'Language Learning Cheat Sheet',
    description: 'Quick reference guides for language learning',
    category: 'Education',
    icon: '🗣️',
    estimatedTime: '25-50 min',
    difficulty: 'Beginner',
    monetizationPotential: 'Medium'
  },
  {
    id: 'growth-blueprint',
    name: 'Growth-Hacking Blueprint',
    description: 'Advanced growth hacking strategies and frameworks',
    category: 'Marketing',
    icon: '📊',
    estimatedTime: '60-120 min',
    difficulty: 'Advanced',
    monetizationPotential: 'Very High'
  },
  {
    id: 'wedding-planner',
    name: 'Wedding Planner',
    description: 'Complete wedding planning guides and checklists',
    category: 'Lifestyle',
    icon: '💒',
    estimatedTime: '90-180 min',
    difficulty: 'Intermediate',
    monetizationPotential: 'High'
  },
  {
    id: 'real-estate-kit',
    name: 'Real Estate Marketing Kit',
    description: 'Professional real estate marketing materials and guides',
    category: 'Business',
    icon: '🏠',
    estimatedTime: '50-100 min',
    difficulty: 'Advanced',
    monetizationPotential: 'Very High'
  },
  {
    id: 'digital-detox',
    name: 'Digital Detox Template',
    description: 'Digital wellness and detox planning guides',
    category: 'Wellness',
    icon: '📵',
    estimatedTime: '20-40 min',
    difficulty: 'Beginner',
    monetizationPotential: 'Medium'
  },
  {
    id: 'resume-designer',
    name: 'Resume + CV Designer',
    description: 'Professional resume and CV templates with guides',
    category: 'Business',
    icon: '📄',
    estimatedTime: '30-60 min',
    difficulty: 'Intermediate',
    monetizationPotential: 'Medium'
  },
  {
    id: 'copywriting-framework',
    name: 'Copywriting Framework',
    description: 'Advanced copywriting formulas and templates',
    category: 'Marketing',
    icon: '✍️',
    estimatedTime: '45-90 min',
    difficulty: 'Advanced',
    monetizationPotential: 'Very High'
  },
  {
    id: 'blog-post-generator',
    name: 'Blog Post Generator',
    description: 'AI-powered blog posts with SEO optimization',
    category: 'Social Media',
    icon: '📝',
    estimatedTime: '15-30 min',
    difficulty: 'Beginner',
    monetizationPotential: 'High'
  },
  {
    id: 'social-media-posts',
    name: 'Social Media Posts',
    description: 'Viral social media content for all platforms',
    category: 'Social Media',
    icon: '📱',
    estimatedTime: '10-20 min',
    difficulty: 'Beginner',
    monetizationPotential: 'Medium'
  },
  {
    id: 'meme-generator',
    name: 'Meme Generator',
    description: 'Trending memes with viral potential',
    category: 'Social Media',
    icon: '😂',
    estimatedTime: '5-15 min',
    difficulty: 'Beginner',
    monetizationPotential: 'Medium'
  },
  {
    id: 'instagram-carousel',
    name: 'Instagram Carousel',
    description: 'Multi-slide Instagram carousel posts',
    category: 'Social Media',
    icon: '🎠',
    estimatedTime: '20-40 min',
    difficulty: 'Intermediate',
    monetizationPotential: 'High'
  },
  {
    id: 'tiktok-script',
    name: 'TikTok Script',
    description: 'Viral TikTok video scripts and hooks',
    category: 'Social Media',
    icon: '🎬',
    estimatedTime: '10-25 min',
    difficulty: 'Beginner',
    monetizationPotential: 'High'
  },
  {
    id: 'youtube-video-script',
    name: 'YouTube Video Script',
    description: 'Engaging YouTube video scripts with hooks',
    category: 'Social Media',
    icon: '📹',
    estimatedTime: '30-60 min',
    difficulty: 'Intermediate',
    monetizationPotential: 'Very High'
  },
  {
    id: 'twitter-thread',
    name: 'Twitter Thread',
    description: 'Viral Twitter threads that drive engagement',
    category: 'Social Media',
    icon: '🐦',
    estimatedTime: '15-30 min',
    difficulty: 'Beginner',
    monetizationPotential: 'Medium'
  },
  {
    id: 'linkedin-post',
    name: 'LinkedIn Post',
    description: 'Professional LinkedIn content for thought leadership',
    category: 'Social Media',
    icon: '💼',
    estimatedTime: '15-30 min',
    difficulty: 'Intermediate',
    monetizationPotential: 'High'
  },
  {
    id: 'pinterest-pin',
    name: 'Pinterest Pin',
    description: 'Pinterest-optimized pins with descriptions',
    category: 'Social Media',
    icon: '📌',
    estimatedTime: '10-20 min',
    difficulty: 'Beginner',
    monetizationPotential: 'Medium'
  },
  {
    id: 'facebook-ad-copy',
    name: 'Facebook Ad Copy',
    description: 'High-converting Facebook ad copy and creatives',
    category: 'Social Media',
    icon: '📢',
    estimatedTime: '20-40 min',
    difficulty: 'Advanced',
    monetizationPotential: 'Very High'
  },
  {
    id: 'content-calendar',
    name: 'Content Calendar',
    description: '30-day social media content calendar',
    category: 'Social Media',
    icon: '📅',
    estimatedTime: '60-120 min',
    difficulty: 'Intermediate',
    monetizationPotential: 'High'
  },
  {
    id: 'hashtag-strategy',
    name: 'Hashtag Strategy',
    description: 'Trending hashtag research and strategy',
    category: 'Social Media',
    icon: '#️⃣',
    estimatedTime: '20-40 min',
    difficulty: 'Beginner',
    monetizationPotential: 'Medium'
  },
  {
    id: 'influencer-kit',
    name: 'Influencer Kit',
    description: 'Complete influencer media kit and templates',
    category: 'Social Media',
    icon: '⭐',
    estimatedTime: '45-90 min',
    difficulty: 'Intermediate',
    monetizationPotential: 'High'
  },
  {
    id: 'podcast-script',
    name: 'Podcast Script',
    description: 'Engaging podcast episode scripts and outlines',
    category: 'Social Media',
    icon: '🎙️',
    estimatedTime: '30-60 min',
    difficulty: 'Intermediate',
    monetizationPotential: 'High'
  },
  {
    id: 'viral-challenge',
    name: 'Viral Challenge',
    description: 'Social media challenges designed to go viral',
    category: 'Social Media',
    icon: '🔥',
    estimatedTime: '25-50 min',
    difficulty: 'Advanced',
    monetizationPotential: 'Very High'
  }
]

export const categories = [
  'All',
  'Content',
  'Productivity',
  'Education',
  'Wellness',
  'Marketing',
  'Business',
  'Technology',
  'Finance',
  'Lifestyle',
  'Social Media'
]