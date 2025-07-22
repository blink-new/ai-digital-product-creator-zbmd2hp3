import { blink } from '../blink/client'
import { OpenRouterService } from './openRouterService'

export interface PainPoint {
  id: string
  title: string
  description: string
  platform: string
  audience: string
  urgency: 'Low' | 'Medium' | 'High' | 'Critical'
  marketSize: string
  keywords: string[]
  relatedProblems: string[]
  suggestedSolutions: string[]
  marketingChannels: string[]
  competitionLevel: 'Low' | 'Medium' | 'High'
  monetizationPotential: 'Low' | 'Medium' | 'High' | 'Very High'
  estimatedDemand: string
}

export interface ProductSuggestion {
  id: string
  productType: string
  title: string
  description: string
  targetAudience: string
  painPointsAddressed: string[]
  marketingStrategy: string[]
  priceRange: string
  timeToMarket: string
  competitiveAdvantage: string
  validationSteps: string[]
}

export interface PainPointAnalysis {
  painPoints: PainPoint[]
  productSuggestions: ProductSuggestion[]
  marketInsights: {
    totalMarketSize: string
    growthTrend: string
    keyOpportunities: string[]
    threats: string[]
  }
  actionPlan: {
    immediateActions: string[]
    shortTerm: string[]
    longTerm: string[]
  }
}

export class PainPointService {
  static async discoverPainPoints(
    topic: string, 
    platforms: string[] = ['reddit', 'twitter', 'facebook', 'linkedin'],
    targetAudience?: string
  ): Promise<PainPointAnalysis> {
    try {
      // Step 1: Search for pain points across social media
      const searchQueries = [
        `${topic} problems complaints`,
        `${topic} frustrations issues`,
        `${topic} challenges difficulties`,
        `${topic} pain points struggles`,
        `${topic} help needed advice`
      ]

      const searchResults = []
      for (const query of searchQueries) {
        try {
          const result = await blink.data.search(query, {
            type: 'news',
            limit: 5
          })
          searchResults.push(result)
        } catch (error) {
          console.warn(`Search failed for query: ${query}`, error)
        }
      }

      // Step 2: Analyze search results with AI to extract pain points
      const analysisPrompt = `Analyze the following search results to identify pain points and market opportunities related to "${topic}".

SEARCH RESULTS:
${JSON.stringify(searchResults, null, 2)}

TARGET AUDIENCE: ${targetAudience || 'General public'}
PLATFORMS: ${platforms.join(', ')}

Please provide a comprehensive analysis in the following JSON format:

{
  "painPoints": [
    {
      "id": "unique-id",
      "title": "Pain Point Title",
      "description": "Detailed description of the problem",
      "platform": "Platform where this was found",
      "audience": "Specific audience affected",
      "urgency": "High|Medium|Low|Critical",
      "marketSize": "Estimated market size",
      "keywords": ["keyword1", "keyword2"],
      "relatedProblems": ["related problem 1"],
      "suggestedSolutions": ["solution 1", "solution 2"],
      "marketingChannels": ["channel1", "channel2"],
      "competitionLevel": "High|Medium|Low",
      "monetizationPotential": "Very High|High|Medium|Low",
      "estimatedDemand": "High|Medium|Low"
    }
  ],
  "productSuggestions": [
    {
      "id": "product-id",
      "productType": "eBook|Planner|Course|etc",
      "title": "Product Title",
      "description": "Product description",
      "targetAudience": "Specific target audience",
      "painPointsAddressed": ["pain point 1", "pain point 2"],
      "marketingStrategy": ["strategy 1", "strategy 2"],
      "priceRange": "$X - $Y",
      "timeToMarket": "X weeks",
      "competitiveAdvantage": "What makes this unique",
      "validationSteps": ["step 1", "step 2"]
    }
  ],
  "marketInsights": {
    "totalMarketSize": "Market size estimate",
    "growthTrend": "Growing|Stable|Declining",
    "keyOpportunities": ["opportunity 1"],
    "threats": ["threat 1"]
  },
  "actionPlan": {
    "immediateActions": ["action 1"],
    "shortTerm": ["action 1"],
    "longTerm": ["action 1"]
  }
}

Focus on:
1. Real problems people are discussing
2. Gaps in current solutions
3. Underserved audiences
4. Trending issues with commercial potential
5. Specific, actionable product ideas
6. Clear marketing strategies for each platform`

      // Use MoonshotAI Kimi for comprehensive analysis
      const text = await OpenRouterService.generateContent(
        analysisPrompt,
        'moonshotai/kimi-dev-72b:free',
        {
          maxTokens: 6000,
          temperature: 0.7,
          systemPrompt: 'You are an expert market researcher and business analyst. Provide comprehensive, actionable insights based on real market data and trends.'
        }
      )

      try {
        const analysis = JSON.parse(text)
        return this.validateAndEnhanceAnalysis(analysis, topic)
      } catch (parseError) {
        console.error('Failed to parse AI analysis:', parseError)
        return this.generateFallbackAnalysis(topic, targetAudience)
      }

    } catch (error) {
      console.error('Pain point discovery failed:', error)
      return this.generateFallbackAnalysis(topic, targetAudience)
    }
  }

  static async generateProductFromPainPoint(painPoint: PainPoint): Promise<{
    productType: string
    niche: string
    targetAudience: string
    tone: string
    length: string
    additionalRequirements: string
  }> {
    try {
      const prompt = `Based on this pain point, generate a complete product specification:

PAIN POINT:
- Title: ${painPoint.title}
- Description: ${painPoint.description}
- Audience: ${painPoint.audience}
- Platform: ${painPoint.platform}
- Keywords: ${painPoint.keywords.join(', ')}
- Suggested Solutions: ${painPoint.suggestedSolutions.join(', ')}

Create a product specification that directly addresses this pain point. Return as JSON:

{
  "productType": "Most suitable product type (eBook, Planner, Course, etc.)",
  "niche": "Specific niche/topic for the product",
  "targetAudience": "Detailed target audience description",
  "tone": "Professional|Conversational|Inspirational|Educational|Friendly|Authoritative",
  "length": "Short (5-10 pages)|Medium (15-25 pages)|Long (30-50 pages)|Comprehensive (50+ pages)",
  "additionalRequirements": "Specific requirements, features, and elements to include"
}`

      const text = await OpenRouterService.generateContent(
        prompt,
        'microsoft/mai-ds-r1:free',
        {
          maxTokens: 1500,
          temperature: 0.7,
          systemPrompt: 'You are a product strategy expert. Create detailed product specifications that directly address market pain points.'
        }
      )

      const spec = JSON.parse(text)
      return spec
    } catch (error) {
      console.error('Product generation from pain point failed:', error)
      
      // Fallback specification
      return {
        productType: 'ebook',
        niche: painPoint.title,
        targetAudience: painPoint.audience,
        tone: 'Professional',
        length: 'Medium (15-25 pages)',
        additionalRequirements: `Address the following pain points: ${painPoint.description}. Include practical solutions: ${painPoint.suggestedSolutions.join(', ')}`
      }
    }
  }

  private static validateAndEnhanceAnalysis(analysis: any, topic: string): PainPointAnalysis {
    // Ensure all required fields exist with defaults
    const painPoints = (analysis.painPoints || []).map((pp: any, index: number) => ({
      id: pp.id || `pain-${index}`,
      title: pp.title || `${topic} Challenge ${index + 1}`,
      description: pp.description || 'Pain point description',
      platform: pp.platform || 'Social Media',
      audience: pp.audience || 'General audience',
      urgency: pp.urgency || 'Medium',
      marketSize: pp.marketSize || 'Medium',
      keywords: pp.keywords || [topic],
      relatedProblems: pp.relatedProblems || [],
      suggestedSolutions: pp.suggestedSolutions || [],
      marketingChannels: pp.marketingChannels || ['Social Media', 'Content Marketing'],
      competitionLevel: pp.competitionLevel || 'Medium',
      monetizationPotential: pp.monetizationPotential || 'Medium',
      estimatedDemand: pp.estimatedDemand || 'Medium'
    }))

    const productSuggestions = (analysis.productSuggestions || []).map((ps: any, index: number) => ({
      id: ps.id || `product-${index}`,
      productType: ps.productType || 'ebook',
      title: ps.title || `${topic} Solution Guide`,
      description: ps.description || 'Product description',
      targetAudience: ps.targetAudience || 'General audience',
      painPointsAddressed: ps.painPointsAddressed || [],
      marketingStrategy: ps.marketingStrategy || ['Social Media Marketing'],
      priceRange: ps.priceRange || '$19.99 - $49.99',
      timeToMarket: ps.timeToMarket || '2-4 weeks',
      competitiveAdvantage: ps.competitiveAdvantage || 'Addresses specific pain points',
      validationSteps: ps.validationSteps || ['Survey target audience', 'Create MVP']
    }))

    return {
      painPoints,
      productSuggestions,
      marketInsights: analysis.marketInsights || {
        totalMarketSize: 'Medium',
        growthTrend: 'Growing',
        keyOpportunities: [`Growing demand for ${topic} solutions`],
        threats: ['Increasing competition']
      },
      actionPlan: analysis.actionPlan || {
        immediateActions: ['Research target audience', 'Validate pain points'],
        shortTerm: ['Create MVP', 'Test with small audience'],
        longTerm: ['Scale marketing', 'Expand product line']
      }
    }
  }

  private static generateFallbackAnalysis(topic: string, targetAudience?: string): PainPointAnalysis {
    return {
      painPoints: [
        {
          id: 'pain-1',
          title: `Lack of comprehensive ${topic} guidance`,
          description: `Many people struggle to find reliable, actionable information about ${topic}`,
          platform: 'Reddit',
          audience: targetAudience || 'General public',
          urgency: 'High',
          marketSize: 'Large',
          keywords: [topic, 'guide', 'help', 'tutorial'],
          relatedProblems: ['Information overload', 'Conflicting advice', 'Lack of step-by-step guidance'],
          suggestedSolutions: ['Comprehensive guide', 'Step-by-step tutorials', 'Expert insights'],
          marketingChannels: ['Social Media', 'Content Marketing', 'SEO'],
          competitionLevel: 'Medium',
          monetizationPotential: 'High',
          estimatedDemand: 'High'
        },
        {
          id: 'pain-2',
          title: `Time management challenges with ${topic}`,
          description: `People find it difficult to efficiently manage their time when dealing with ${topic}`,
          platform: 'Twitter',
          audience: 'Busy professionals',
          urgency: 'High',
          marketSize: 'Medium',
          keywords: [topic, 'time management', 'productivity', 'efficiency'],
          relatedProblems: ['Overwhelm', 'Procrastination', 'Poor planning'],
          suggestedSolutions: ['Time management templates', 'Productivity systems', 'Planning tools'],
          marketingChannels: ['LinkedIn', 'Productivity blogs', 'YouTube'],
          competitionLevel: 'Medium',
          monetizationPotential: 'High',
          estimatedDemand: 'High'
        }
      ],
      productSuggestions: [
        {
          id: 'product-1',
          productType: 'ebook',
          title: `The Complete ${topic} Mastery Guide`,
          description: `Comprehensive guide addressing all aspects of ${topic}`,
          targetAudience: targetAudience || 'Beginners and intermediate learners',
          painPointsAddressed: ['Lack of guidance', 'Information overload'],
          marketingStrategy: ['Content marketing', 'Social media', 'SEO'],
          priceRange: '$29.99 - $79.99',
          timeToMarket: '3-4 weeks',
          competitiveAdvantage: 'Comprehensive, actionable content',
          validationSteps: ['Survey target audience', 'Create outline', 'Test with beta readers']
        },
        {
          id: 'product-2',
          productType: 'planner',
          title: `${topic} Productivity Planner`,
          description: `Time management and planning system for ${topic}`,
          targetAudience: 'Busy professionals and entrepreneurs',
          painPointsAddressed: ['Time management', 'Poor planning'],
          marketingStrategy: ['LinkedIn marketing', 'Productivity communities', 'Influencer partnerships'],
          priceRange: '$19.99 - $39.99',
          timeToMarket: '2-3 weeks',
          competitiveAdvantage: 'Specifically designed for busy professionals',
          validationSteps: ['Test with target users', 'Gather feedback', 'Iterate design']
        }
      ],
      marketInsights: {
        totalMarketSize: 'Large and growing',
        growthTrend: 'Growing',
        keyOpportunities: [
          `Increasing interest in ${topic}`,
          'Underserved niche markets',
          'Digital product demand growth'
        ],
        threats: [
          'Increasing competition',
          'Market saturation in some areas',
          'Changing consumer preferences'
        ]
      },
      actionPlan: {
        immediateActions: [
          'Validate pain points with target audience',
          'Research existing solutions',
          'Create detailed product outline'
        ],
        shortTerm: [
          'Develop MVP',
          'Test with small audience',
          'Gather feedback and iterate',
          'Build marketing presence'
        ],
        longTerm: [
          'Scale marketing efforts',
          'Expand product line',
          'Build brand authority',
          'Explore new markets'
        ]
      }
    }
  }
}