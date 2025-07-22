import { blink } from '../blink/client'

export interface TrendingTopic {
  id: string
  title: string
  description: string
  category: string
  searchVolume: string
  difficulty: 'Low' | 'Medium' | 'High'
  monetizationPotential: 'Low' | 'Medium' | 'High' | 'Very High'
  keywords: string[]
  relatedTopics: string[]
}

export interface SearchResult {
  title: string
  snippet: string
  url: string
  source: string
  date?: string
}

export interface TrendingSearchResponse {
  topics: TrendingTopic[]
  searchResults: SearchResult[]
  relatedQueries: string[]
  imagePrompts: string[]
}

export class TrendingService {
  static async searchTrendingTopics(query: string, category?: string): Promise<TrendingSearchResponse> {
    try {
      // Use Blink's web search to find trending topics
      const searchResults = await blink.data.search(query, {
        type: 'news',
        limit: 10
      })

      // Generate AI-powered trending topics based on search results
      const trendingPrompt = `Based on the search query "${query}" and current trends, generate 5-8 trending topics that would be perfect for digital product creation. 

      For each topic, provide:
      - A catchy title
      - Brief description
      - Category (Business, Health, Technology, Finance, etc.)
      - Search volume estimate (Low/Medium/High/Very High)
      - Monetization difficulty (Low/Medium/High)
      - Monetization potential (Low/Medium/High/Very High)
      - 3-5 relevant keywords
      - 3-4 related subtopics

      Also suggest 5-8 image prompts that would work well for visual content related to these topics.

      Format as JSON with this structure:
      {
        "topics": [
          {
            "id": "unique-id",
            "title": "Topic Title",
            "description": "Brief description",
            "category": "Category",
            "searchVolume": "High",
            "difficulty": "Medium",
            "monetizationPotential": "High",
            "keywords": ["keyword1", "keyword2"],
            "relatedTopics": ["subtopic1", "subtopic2"]
          }
        ],
        "imagePrompts": [
          "Professional image prompt for visual content"
        ]
      }`

      const { text } = await blink.ai.generateText({
        prompt: trendingPrompt,
        model: 'gpt-4o-mini',
        maxTokens: 2000
      })

      // Parse the AI response
      let parsedData: any
      try {
        parsedData = JSON.parse(text)
      } catch (error) {
        // Fallback if JSON parsing fails
        parsedData = this.generateFallbackTopics(query, category)
      }

      // Convert search results to our format
      const formattedSearchResults: SearchResult[] = searchResults.organic_results?.map((result: any) => ({
        title: result.title || '',
        snippet: result.snippet || '',
        url: result.link || '',
        source: result.source || 'Web',
        date: result.date
      })) || []

      // Add news results if available
      if (searchResults.news_results) {
        formattedSearchResults.push(...searchResults.news_results.map((result: any) => ({
          title: result.title || '',
          snippet: result.snippet || '',
          url: result.link || '',
          source: result.source || 'News',
          date: result.date
        })))
      }

      return {
        topics: parsedData.topics || [],
        searchResults: formattedSearchResults,
        relatedQueries: searchResults.related_searches || [],
        imagePrompts: parsedData.imagePrompts || []
      }
    } catch (error) {
      console.error('Trending search failed:', error)
      return this.generateFallbackTopics(query, category)
    }
  }

  static async getImagePromptSuggestions(productType: string, niche: string): Promise<string[]> {
    try {
      const prompt = `Generate 8-10 detailed image prompts for creating visual content for a ${productType} about ${niche}. 

      The prompts should be:
      - Specific and detailed for AI image generation
      - Professional and high-quality
      - Suitable for commercial use
      - Varied in style (photography, illustrations, graphics, etc.)
      - Optimized for social media and marketing

      Return as a JSON array of strings.`

      const { text } = await blink.ai.generateText({
        prompt,
        model: 'gpt-4o-mini',
        maxTokens: 1000
      })

      try {
        return JSON.parse(text)
      } catch {
        // Fallback prompts
        return [
          `Professional ${productType} cover design with modern typography and ${niche} theme`,
          `Clean minimalist illustration representing ${niche} concepts`,
          `High-quality stock photo style image related to ${niche}`,
          `Infographic-style visual explaining ${niche} key points`,
          `Social media post template with ${niche} branding`,
          `Professional headshot or lifestyle photo for ${niche} audience`,
          `Abstract geometric design with ${niche} color scheme`,
          `Hand-drawn sketch style illustration for ${niche} content`
        ]
      }
    } catch (error) {
      console.error('Image prompt generation failed:', error)
      return [
        'Professional cover design with modern typography',
        'Clean minimalist illustration',
        'High-quality stock photo style image',
        'Infographic-style visual',
        'Social media post template',
        'Professional lifestyle photo',
        'Abstract geometric design',
        'Hand-drawn sketch style illustration'
      ]
    }
  }

  static async enhancePrompt(originalPrompt: string, productType: string): Promise<string> {
    try {
      const enhancementPrompt = `Enhance this prompt for creating a ${productType}:

      Original prompt: "${originalPrompt}"

      Make it more:
      - Specific and actionable
      - Commercially viable
      - Engaging and compelling
      - Optimized for the target audience
      - Include trending keywords and phrases

      Return only the enhanced prompt, no additional text.`

      const { text } = await blink.ai.generateText({
        prompt: enhancementPrompt,
        model: 'gpt-4o-mini',
        maxTokens: 500
      })

      return text.trim()
    } catch (error) {
      console.error('Prompt enhancement failed:', error)
      return originalPrompt
    }
  }

  private static generateFallbackTopics(query: string, category?: string): TrendingSearchResponse {
    const fallbackTopics: TrendingTopic[] = [
      {
        id: 'ai-productivity',
        title: 'AI-Powered Productivity Tools',
        description: 'How to leverage AI tools for maximum productivity and efficiency',
        category: 'Technology',
        searchVolume: 'Very High',
        difficulty: 'Medium',
        monetizationPotential: 'Very High',
        keywords: ['AI tools', 'productivity', 'automation', 'efficiency'],
        relatedTopics: ['ChatGPT workflows', 'AI writing tools', 'Task automation', 'Time management']
      },
      {
        id: 'remote-work',
        title: 'Remote Work Mastery',
        description: 'Complete guide to thriving in remote work environments',
        category: 'Business',
        searchVolume: 'High',
        difficulty: 'Low',
        monetizationPotential: 'High',
        keywords: ['remote work', 'work from home', 'digital nomad', 'productivity'],
        relatedTopics: ['Home office setup', 'Communication tools', 'Work-life balance', 'Team collaboration']
      },
      {
        id: 'sustainable-living',
        title: 'Sustainable Living Guide',
        description: 'Practical steps to live more sustainably and reduce environmental impact',
        category: 'Lifestyle',
        searchVolume: 'High',
        difficulty: 'Low',
        monetizationPotential: 'Medium',
        keywords: ['sustainability', 'eco-friendly', 'green living', 'environment'],
        relatedTopics: ['Zero waste', 'Renewable energy', 'Sustainable fashion', 'Eco products']
      },
      {
        id: 'mental-health',
        title: 'Mental Health & Wellness',
        description: 'Comprehensive mental health strategies for modern life',
        category: 'Wellness',
        searchVolume: 'Very High',
        difficulty: 'Medium',
        monetizationPotential: 'High',
        keywords: ['mental health', 'wellness', 'mindfulness', 'self-care'],
        relatedTopics: ['Stress management', 'Meditation', 'Therapy techniques', 'Emotional intelligence']
      },
      {
        id: 'crypto-investing',
        title: 'Cryptocurrency Investment Guide',
        description: 'Beginner-friendly guide to cryptocurrency investing and trading',
        category: 'Finance',
        searchVolume: 'High',
        difficulty: 'High',
        monetizationPotential: 'Very High',
        keywords: ['cryptocurrency', 'bitcoin', 'investing', 'blockchain'],
        relatedTopics: ['DeFi', 'NFTs', 'Trading strategies', 'Wallet security']
      }
    ]

    const fallbackImagePrompts = [
      'Professional modern workspace with laptop and coffee, clean minimalist style',
      'Abstract geometric shapes in gradient colors, suitable for tech content',
      'Diverse group of people collaborating in modern office environment',
      'Hand holding smartphone with app interface, clean product photography',
      'Inspirational quote overlay on nature background, Instagram style',
      'Infographic elements with charts and icons, professional business style',
      'Cozy home office setup with plants and natural lighting',
      'Digital art illustration with vibrant colors and modern design'
    ]

    return {
      topics: fallbackTopics,
      searchResults: [],
      relatedQueries: [
        `${query} trends 2024`,
        `${query} best practices`,
        `${query} for beginners`,
        `${query} tools and resources`,
        `${query} case studies`
      ],
      imagePrompts: fallbackImagePrompts
    }
  }
}