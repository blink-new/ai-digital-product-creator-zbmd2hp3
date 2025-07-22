import { blink } from '../blink/client'
import { AIModel } from '../types/product'
import { OpenRouterService } from './openRouterService'

export interface GenerationRequest {
  productType: string
  niche: string
  targetAudience: string
  tone: string
  requirements: string
  aiModel: string
}

export interface GeneratedContent {
  title: string
  subtitle: string
  content: string
  tableOfContents: string[]
  monetizationSuggestions: string[]
  marketingChannels: string[]
  priceRange: string
  coverDesign: {
    title: string
    subtitle: string
    colors: string[]
  }
}

export class AIService {
  private static getModelPrompt(model: AIModel, request: GenerationRequest): string {
    const basePrompt = `Create a comprehensive ${request.productType} for the ${request.niche} niche, targeting ${request.targetAudience} with a ${request.tone} tone.

Requirements: ${request.requirements}

Please generate a complete, professional digital product with the following structure:

**TITLE & SUBTITLE:**
- Create a compelling, marketable title
- Write an engaging subtitle that clearly communicates value

**CONTENT STRUCTURE:**
- Introduction that hooks the reader
- 5-8 main sections with detailed content
- Each section should have 3-5 subsections
- Include actionable tips, strategies, and examples
- Add practical exercises or worksheets where relevant
- Conclude with next steps and resources

**TABLE OF CONTENTS:**
- List all main sections and subsections
- Use clear, descriptive headings

**MONETIZATION STRATEGIES:**
- 5-7 specific ways to monetize this product
- Include pricing strategies and market positioning
- Suggest upsells and cross-sells

**MARKETING CHANNELS:**
- 6-8 specific marketing channels and tactics
- Include social media strategies
- Suggest content marketing approaches

**PRICE RANGE:**
- Provide a realistic price range based on value and market
- Consider different pricing tiers

**COVER DESIGN SUGGESTIONS:**
- Describe visual elements and color schemes
- Suggest typography and layout ideas

Make the content professional, actionable, and ready for commercial use. Ensure it provides genuine value and solves real problems for the target audience.`

    // Customize prompt based on AI model specialization
    switch (model.id) {
      case 'kimi':
        return `${basePrompt}\n\n**SPECIALIZATION FOCUS:** Use structured thinking and comprehensive organization. Provide detailed outlines, logical flow, and systematic approaches. Include frameworks and methodologies.`
      case 'deepseek':
        return `${basePrompt}\n\n**SPECIALIZATION FOCUS:** Emphasize technical accuracy and include code examples, tools, and step-by-step processes where applicable. Focus on implementation details.`
      case 'gemma':
      case 'qwen3':
        return `${basePrompt}\n\n**SPECIALIZATION FOCUS:** Use natural, human-like language that connects emotionally with the audience. Make it engaging, relatable, and conversational while maintaining professionalism.`
      case 'nemotron':
        return `${basePrompt}\n\n**SPECIALIZATION FOCUS:** Focus on document enhancement and professional formatting. Ensure high-quality presentation, clear structure, and polished content organization.`
      case 'mai':
        return `${basePrompt}\n\n**SPECIALIZATION FOCUS:** Emphasize business strategy and monetization opportunities. Include market analysis, competitive insights, and revenue optimization strategies.`
      default:
        return basePrompt
    }
  }

  static async generateContent(request: GenerationRequest): Promise<GeneratedContent> {
    try {
      const model = this.getAIModel(request.aiModel)
      const prompt = this.getModelPrompt(model, request)

      let text: string

      // Try OpenRouter first for specialized models
      if (this.isOpenRouterModel(request.aiModel)) {
        try {
          const openRouterModelId = this.getOpenRouterModelId(request.aiModel)
          text = await OpenRouterService.generateContent(prompt, openRouterModelId, {
            maxTokens: 6000,
            temperature: 0.7
          })
        } catch (openRouterError) {
          console.warn('OpenRouter failed, falling back to Blink AI:', openRouterError)
          // Fallback to Blink AI
          const response = await blink.ai.generateText({
            prompt,
            model: 'gpt-4o-mini',
            maxTokens: 6000,
            search: true
          })
          text = response.text
        }
      } else {
        // Use Blink AI for other models
        const response = await blink.ai.generateText({
          prompt,
          model: 'gpt-4o-mini',
          maxTokens: 6000,
          search: true // Enable web search for current information
        })
        text = response.text
      }

      // Parse the generated content
      return this.parseGeneratedContent(text, request)
    } catch (error) {
      console.error('AI generation failed:', error)
      
      // Provide fallback content if AI generation fails
      return this.generateFallbackContent(request)
    }
  }

  private static generateFallbackContent(request: GenerationRequest): GeneratedContent {
    const title = `${request.productType}: ${request.niche} Guide`
    const subtitle = `A comprehensive resource for ${request.targetAudience}`
    
    const content = `# ${title}

## Introduction
Welcome to your comprehensive guide on ${request.niche}. This resource has been specifically designed for ${request.targetAudience} who want to achieve success in this area.

## Chapter 1: Getting Started
Understanding the fundamentals is crucial for success. In this chapter, we'll cover the basic concepts and principles you need to know.

### Key Concepts
- Foundation principles
- Essential terminology
- Common misconceptions

### Getting Started Checklist
- [ ] Assess your current situation
- [ ] Set clear goals
- [ ] Gather necessary resources

## Chapter 2: Core Strategies
Now that you understand the basics, let's dive into the core strategies that will help you succeed.

### Strategy 1: Foundation Building
Building a strong foundation is essential for long-term success.

### Strategy 2: Implementation
Learn how to put these concepts into practice effectively.

## Chapter 3: Advanced Techniques
Take your knowledge to the next level with these advanced techniques and strategies.

### Advanced Method 1
Detailed explanation of advanced concepts.

### Advanced Method 2
Additional sophisticated approaches.

## Chapter 4: Common Challenges and Solutions
Every journey has obstacles. Here's how to overcome the most common challenges.

### Challenge 1: Getting Started
Solutions and workarounds for initial hurdles.

### Challenge 2: Maintaining Momentum
How to stay motivated and consistent.

## Chapter 5: Case Studies and Examples
Real-world examples and case studies to illustrate key concepts.

### Case Study 1
Detailed analysis of a successful implementation.

### Case Study 2
Lessons learned from challenges and setbacks.

## Conclusion
Congratulations on completing this comprehensive guide. You now have the knowledge and tools needed to succeed in ${request.niche}.

## Next Steps
- Implement the strategies outlined in this guide
- Track your progress regularly
- Continue learning and adapting

## Additional Resources
- Recommended reading
- Useful tools and software
- Community resources and support`

    return {
      title,
      subtitle,
      content,
      tableOfContents: [
        'Introduction',
        'Chapter 1: Getting Started',
        'Chapter 2: Core Strategies', 
        'Chapter 3: Advanced Techniques',
        'Chapter 4: Common Challenges and Solutions',
        'Chapter 5: Case Studies and Examples',
        'Conclusion',
        'Next Steps',
        'Additional Resources'
      ],
      monetizationSuggestions: [
        'Sell as a standalone digital product on your website',
        'Use as a lead magnet to build your email list',
        'Bundle with complementary products for higher value',
        'Create a premium version with additional content',
        'License to other businesses in your niche',
        'Offer as a bonus for higher-tier products or services',
        'Create a course or workshop based on the content'
      ],
      marketingChannels: [
        'Social media marketing (Instagram, LinkedIn, Twitter)',
        'Content marketing through blog posts and articles',
        'Email marketing campaigns to your subscriber list',
        'Influencer partnerships and collaborations',
        'SEO-optimized landing pages',
        'Paid advertising (Google Ads, Facebook Ads)',
        'Online marketplaces (Etsy, Gumroad, Creative Market)',
        'Webinars and online presentations'
      ],
      priceRange: '$19.99 - $97.00',
      coverDesign: {
        title,
        subtitle,
        colors: ['#6366F1', '#F59E0B', '#FFFFFF']
      }
    }
  }

  static async enhanceContent(content: string, enhancementType: 'humanize' | 'professional' | 'engaging'): Promise<string> {
    try {
      const enhancementPrompts = {
        humanize: 'Rewrite this content to sound more human, natural, and conversational while maintaining professionalism.',
        professional: 'Enhance this content to sound more professional, authoritative, and polished.',
        engaging: 'Make this content more engaging, compelling, and action-oriented to capture reader attention.'
      }

      const { text } = await blink.ai.generateText({
        prompt: `${enhancementPrompts[enhancementType]}\n\nContent to enhance:\n${content}`,
        model: 'gpt-4o-mini',
        maxTokens: 3000
      })

      return text
    } catch (error) {
      console.error('Content enhancement failed:', error)
      throw new Error('Failed to enhance content. Please try again.')
    }
  }

  private static getAIModel(modelId: string): AIModel {
    const models: AIModel[] = [
      { id: 'kimi', name: 'Kimi', specialization: 'Structured Thinking', description: 'Long-form structured content and comprehensive analysis' },
      { id: 'deepseek', name: 'DeepSeek', specialization: 'Technical Content', description: 'Code-heavy and logic-based content creation' },
      { id: 'gemma', name: 'Gemma', specialization: 'Human-like Phrasing', description: 'Natural, conversational content that connects with readers' },
      { id: 'qwen3', name: 'Qwen3', specialization: 'User-friendly Content', description: 'Accessible and engaging content for broad audiences' },
      { id: 'nemotron', name: 'NVIDIA Nemotron', specialization: 'Document Enhancement', description: 'Professional document formatting and enhancement' },
      { id: 'mai', name: 'Microsoft MAI', specialization: 'Business Strategy', description: 'Business model and monetization strategy development' }
    ]

    return models.find(m => m.id === modelId) || models[0]
  }

  private static parseGeneratedContent(text: string, request: GenerationRequest): GeneratedContent {
    // Parse the AI response into structured content
    const lines = text.split('\n').filter(line => line.trim())
    
    let title = `${request.productType} for ${request.niche}`
    let subtitle = `A comprehensive guide for ${request.targetAudience}`
    const content = text
    let tableOfContents: string[] = []
    let monetizationSuggestions: string[] = []
    let marketingChannels: string[] = []
    let priceRange = '$19.99 - $97.00'

    // Enhanced title extraction with multiple patterns
    const titlePatterns = [
      /(?:Title|TITLE):\s*(.+)/i,
      /(?:Product Title|PRODUCT TITLE):\s*(.+)/i,
      /^\*\*TITLE[^:]*:\*\*\s*(.+)/im,
      /^#\s+(.+)/m
    ]
    
    for (const pattern of titlePatterns) {
      const match = text.match(pattern)
      if (match) {
        title = match[1].trim().replace(/\*\*/g, '').replace(/^#+\s*/, '')
        break
      }
    }

    // Enhanced subtitle extraction
    const subtitlePatterns = [
      /(?:Subtitle|SUBTITLE):\s*(.+)/i,
      /(?:Product Subtitle|PRODUCT SUBTITLE):\s*(.+)/i,
      /^\*\*SUBTITLE[^:]*:\*\*\s*(.+)/im
    ]
    
    for (const pattern of subtitlePatterns) {
      const match = text.match(pattern)
      if (match) {
        subtitle = match[1].trim().replace(/\*\*/g, '')
        break
      }
    }

    // Enhanced table of contents extraction
    const tocPatterns = [
      /(?:Table of Contents|TOC|Contents|TABLE OF CONTENTS):\s*((?:\n.*?)+?)(?:\n\n|\n\*\*[A-Z])/i,
      /^\*\*TABLE OF CONTENTS[^:]*:\*\*\s*((?:\n.*?)+?)(?:\n\n|\n\*\*[A-Z])/im
    ]
    
    for (const pattern of tocPatterns) {
      const match = text.match(pattern)
      if (match) {
        tableOfContents = match[1]
          .split('\n')
          .map(line => line.trim().replace(/^[-•*]\s*/, '').replace(/^\d+\.\s*/, ''))
          .filter(line => line && !line.match(/^[0-9]+\.?\s*$/) && line.length > 3)
          .slice(0, 12)
        break
      }
    }

    // Extract from markdown headers if no explicit TOC found
    if (tableOfContents.length === 0) {
      const headerMatches = text.match(/^#{1,3}\s+(.+)/gm)
      if (headerMatches) {
        tableOfContents = headerMatches
          .map(header => header.replace(/^#+\s*/, '').trim())
          .filter(header => header.length > 3)
          .slice(0, 10)
      }
    }

    // Default table of contents based on product type
    if (tableOfContents.length === 0) {
      tableOfContents = this.getDefaultTOC(request.productType)
    }

    // Enhanced monetization extraction
    const monetizationPatterns = [
      /(?:Monetization|Revenue|Pricing|MONETIZATION STRATEGIES?).*?:((?:\n.*?)+?)(?:\n\n|\n\*\*[A-Z])/i,
      /^\*\*MONETIZATION[^:]*:\*\*\s*((?:\n.*?)+?)(?:\n\n|\n\*\*[A-Z])/im
    ]
    
    for (const pattern of monetizationPatterns) {
      const match = text.match(pattern)
      if (match) {
        monetizationSuggestions = match[1]
          .split('\n')
          .map(line => line.trim().replace(/^[-•*]\s*/, '').replace(/^\d+\.\s*/, ''))
          .filter(line => line && line.length > 10)
          .slice(0, 7)
        break
      }
    }

    // Default monetization suggestions
    if (monetizationSuggestions.length === 0) {
      monetizationSuggestions = [
        'Sell as a standalone digital product on your website',
        'Use as a lead magnet to build your email list',
        'Bundle with complementary products for higher value',
        'Create a premium version with additional content',
        'License to other businesses in your niche',
        'Offer as a bonus for higher-tier products or services',
        'Create a course or workshop based on the content'
      ]
    }

    // Enhanced marketing channels extraction
    const marketingPatterns = [
      /(?:Marketing|Promotion|Channels|MARKETING CHANNELS?).*?:((?:\n.*?)+?)(?:\n\n|\n\*\*[A-Z])/i,
      /^\*\*MARKETING[^:]*:\*\*\s*((?:\n.*?)+?)(?:\n\n|\n\*\*[A-Z])/im
    ]
    
    for (const pattern of marketingPatterns) {
      const match = text.match(pattern)
      if (match) {
        marketingChannels = match[1]
          .split('\n')
          .map(line => line.trim().replace(/^[-•*]\s*/, '').replace(/^\d+\.\s*/, ''))
          .filter(line => line && line.length > 10)
          .slice(0, 8)
        break
      }
    }

    // Default marketing channels
    if (marketingChannels.length === 0) {
      marketingChannels = [
        'Social media marketing (Instagram, LinkedIn, Twitter)',
        'Content marketing through blog posts and articles',
        'Email marketing campaigns to your subscriber list',
        'Influencer partnerships and collaborations',
        'SEO-optimized landing pages',
        'Paid advertising (Google Ads, Facebook Ads)',
        'Online marketplaces (Etsy, Gumroad, Creative Market)',
        'Webinars and online presentations'
      ]
    }

    // Enhanced price range extraction
    const pricePatterns = [
      /(?:Price|Cost|Pricing|PRICE RANGE?).*?(\$[\d,.]+ ?- ?\$[\d,.]+|\$[\d,.]+)/i,
      /^\*\*PRICE[^:]*:\*\*.*?(\$[\d,.]+ ?- ?\$[\d,.]+|\$[\d,.]+)/im
    ]
    
    for (const pattern of pricePatterns) {
      const match = text.match(pattern)
      if (match) {
        priceRange = match[1]
        break
      }
    }

    return {
      title,
      subtitle,
      content,
      tableOfContents,
      monetizationSuggestions,
      marketingChannels,
      priceRange,
      coverDesign: {
        title,
        subtitle,
        colors: ['#6366F1', '#F59E0B', '#FFFFFF']
      }
    }
  }

  private static isOpenRouterModel(modelId: string): boolean {
    const openRouterModels = [
      'moonshotai/kimi-dev-72b:free',
      'tngtech/deepseek-r1t2-chimera:free',
      'mistralai/mistral-small-3.2-24b-instruct:free',
      'google/gemma-3n-e4b-it:free',
      'qwen/qwen3-235b-a22b:free',
      'microsoft/mai-ds-r1:free',
      'nvidia/llama-3.1-nemotron-ultra-253b-v1:free',
      'moonshotai/kimi-vl-a3b-thinking:free',
      'agentica-org/deepcoder-14b-preview:free',
      'arliai/qwq-32b-arliai-rpr-v1:free',
      // Legacy model IDs for backward compatibility
      'kimi', 'deepseek', 'gemma', 'qwen3', 'nemotron', 'mai'
    ]
    return openRouterModels.includes(modelId)
  }

  private static getOpenRouterModelId(modelId: string): string {
    const modelMap: Record<string, string> = {
      'moonshotai/kimi-dev-72b:free': 'moonshotai/kimi-dev-72b:free',
      'tngtech/deepseek-r1t2-chimera:free': 'tngtech/deepseek-r1t2-chimera:free',
      'mistralai/mistral-small-3.2-24b-instruct:free': 'mistralai/mistral-small-3.2-24b-instruct:free',
      'google/gemma-3n-e4b-it:free': 'google/gemma-3n-e4b-it:free',
      'qwen/qwen3-235b-a22b:free': 'qwen/qwen3-235b-a22b:free',
      'microsoft/mai-ds-r1:free': 'microsoft/mai-ds-r1:free',
      'nvidia/llama-3.1-nemotron-ultra-253b-v1:free': 'nvidia/llama-3.1-nemotron-ultra-253b-v1:free',
      'moonshotai/kimi-vl-a3b-thinking:free': 'moonshotai/kimi-vl-a3b-thinking:free',
      'agentica-org/deepcoder-14b-preview:free': 'agentica-org/deepcoder-14b-preview:free',
      'arliai/qwq-32b-arliai-rpr-v1:free': 'arliai/qwq-32b-arliai-rpr-v1:free',
      // Legacy mappings for backward compatibility
      'kimi': 'moonshotai/kimi-dev-72b:free',
      'deepseek': 'tngtech/deepseek-r1t2-chimera:free',
      'gemma': 'google/gemma-3n-e4b-it:free',
      'qwen3': 'qwen/qwen3-235b-a22b:free',
      'nemotron': 'nvidia/llama-3.1-nemotron-ultra-253b-v1:free',
      'mai': 'microsoft/mai-ds-r1:free'
    }
    return modelMap[modelId] || 'moonshotai/kimi-dev-72b:free'
  }

  private static getDefaultTOC(productType: string): string[] {
    const tocTemplates: Record<string, string[]> = {
      'ebook': [
        'Introduction',
        'Chapter 1: Getting Started',
        'Chapter 2: Core Concepts',
        'Chapter 3: Advanced Strategies',
        'Chapter 4: Implementation',
        'Chapter 5: Case Studies',
        'Conclusion',
        'Resources and References'
      ],
      'planner': [
        'How to Use This Planner',
        'Goal Setting Worksheets',
        'Monthly Planning Pages',
        'Weekly Planning Spreads',
        'Daily Planning Templates',
        'Habit Trackers',
        'Reflection Pages',
        'Notes and Ideas'
      ],
      'worksheet': [
        'Instructions',
        'Assessment Section',
        'Planning Worksheets',
        'Action Steps',
        'Progress Tracking',
        'Reflection Questions',
        'Next Steps',
        'Additional Resources'
      ],
      'template': [
        'Template Overview',
        'Setup Instructions',
        'Customization Guide',
        'Usage Examples',
        'Best Practices',
        'Troubleshooting',
        'Advanced Features',
        'Support Resources'
      ]
    }

    const type = productType.toLowerCase()
    for (const [key, toc] of Object.entries(tocTemplates)) {
      if (type.includes(key)) {
        return toc
      }
    }

    return tocTemplates.ebook // Default fallback
  }
}