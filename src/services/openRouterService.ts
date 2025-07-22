import { blink } from '../blink/client'

export interface OpenRouterModel {
  id: string
  name: string
  provider: string
  specialization: string
  description: string
  contextLength: number
  pricing: {
    prompt: number
    completion: number
  }
  isActive: boolean
}

export interface OpenRouterRequest {
  model: string
  messages: Array<{
    role: 'system' | 'user' | 'assistant'
    content: string
  }>
  max_tokens?: number
  temperature?: number
  top_p?: number
  stream?: boolean
}

export interface OpenRouterResponse {
  id: string
  object: string
  created: number
  model: string
  choices: Array<{
    index: number
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export class OpenRouterService {
  private static readonly BASE_URL = 'https://openrouter.ai/api/v1'
  
  // Updated with the correct FREE model endpoints from OpenRouter
  private static readonly MODELS: OpenRouterModel[] = [
    {
      id: 'moonshotai/kimi-dev-72b:free',
      name: 'MoonshotAI Kimi Dev 72B',
      provider: 'Moonshot',
      specialization: 'Long-form Structured Thinking',
      description: 'Excels at creating detailed outlines, comprehensive content structures, and strategic planning',
      contextLength: 72000,
      pricing: { prompt: 0, completion: 0 },
      isActive: true
    },
    {
      id: 'tngtech/deepseek-r1t2-chimera:free',
      name: 'DeepSeek R1T2 Chimera',
      provider: 'TNGTech',
      specialization: 'Technical & Logic Content',
      description: 'Perfect for code-heavy content, technical documentation, and logical frameworks',
      contextLength: 32000,
      pricing: { prompt: 0, completion: 0 },
      isActive: true
    },
    {
      id: 'mistralai/mistral-small-3.2-24b-instruct:free',
      name: 'Mistral Small 3.2 24B',
      provider: 'Mistral',
      specialization: 'Instruction Following',
      description: 'Excellent at following detailed instructions and creating structured content',
      contextLength: 24000,
      pricing: { prompt: 0, completion: 0 },
      isActive: true
    },
    {
      id: 'google/gemma-3n-e4b-it:free',
      name: 'Google Gemma 3N E4B',
      provider: 'Google',
      specialization: 'Human-like Phrasing',
      description: 'Creates natural, conversational content that feels authentically human',
      contextLength: 8192,
      pricing: { prompt: 0, completion: 0 },
      isActive: true
    },
    {
      id: 'qwen/qwen3-235b-a22b:free',
      name: 'Qwen3 235B A22B',
      provider: 'Alibaba',
      specialization: 'User-friendly Content',
      description: 'Specializes in accessible, easy-to-understand content for broad audiences',
      contextLength: 32768,
      pricing: { prompt: 0, completion: 0 },
      isActive: true
    },
    {
      id: 'microsoft/mai-ds-r1:free',
      name: 'Microsoft MAI DS R1',
      provider: 'Microsoft',
      specialization: 'Business Strategy',
      description: 'Expert in pricing strategies, market analysis, and revenue optimization',
      contextLength: 65536,
      pricing: { prompt: 0, completion: 0 },
      isActive: true
    },
    {
      id: 'nvidia/llama-3.1-nemotron-ultra-253b-v1:free',
      name: 'NVIDIA Nemotron Ultra 253B',
      provider: 'NVIDIA',
      specialization: 'Document Enhancement',
      description: 'Advanced document formatting, styling, and professional presentation',
      contextLength: 128000,
      pricing: { prompt: 0, completion: 0 },
      isActive: true
    },
    {
      id: 'moonshotai/kimi-vl-a3b-thinking:free',
      name: 'MoonshotAI Kimi VL A3B Thinking',
      provider: 'Moonshot',
      specialization: 'Visual & Analytical Thinking',
      description: 'Advanced reasoning and analytical content generation',
      contextLength: 32000,
      pricing: { prompt: 0, completion: 0 },
      isActive: true
    },
    {
      id: 'agentica-org/deepcoder-14b-preview:free',
      name: 'DeepCoder 14B Preview',
      provider: 'Agentica',
      specialization: 'Code & Template Logic',
      description: 'Specialized in file logic, template management, and structured data',
      contextLength: 16000,
      pricing: { prompt: 0, completion: 0 },
      isActive: true
    },
    {
      id: 'arliai/qwq-32b-arliai-rpr-v1:free',
      name: 'ArliAI QwQ 32B RPR V1',
      provider: 'ArliAI',
      specialization: 'Business Model & Strategy',
      description: 'Expert in business model development and strategic planning',
      contextLength: 32000,
      pricing: { prompt: 0, completion: 0 },
      isActive: true
    }
  ]

  static getAvailableModels(): OpenRouterModel[] {
    return this.MODELS.filter(model => model.isActive)
  }

  static getModelById(id: string): OpenRouterModel | undefined {
    return this.MODELS.find(model => model.id === id)
  }

  static async generateContent(
    prompt: string,
    modelId: string,
    options: {
      maxTokens?: number
      temperature?: number
      systemPrompt?: string
    } = {}
  ): Promise<string> {
    try {
      const model = this.getModelById(modelId)
      if (!model) {
        throw new Error(`Model ${modelId} not found`)
      }

      const messages = []
      
      if (options.systemPrompt) {
        messages.push({
          role: 'system' as const,
          content: options.systemPrompt
        })
      }

      messages.push({
        role: 'user' as const,
        content: prompt
      })

      const requestBody: OpenRouterRequest = {
        model: modelId,
        messages,
        max_tokens: options.maxTokens || 4000,
        temperature: options.temperature || 0.7,
        top_p: 0.9
      }

      // Use Blink's secure API proxy to call OpenRouter
      const response = await blink.data.fetch({
        url: `${this.BASE_URL}/chat/completions`,
        method: 'POST',
        headers: {
          'Authorization': 'Bearer {{OPENROUTER_API_KEY}}',
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://ai-digital-product-creator-zbmd2hp3.sites.blink.new',
          'X-Title': 'AI Digital Product Creator'
        },
        body: requestBody
      })

      if (response.status !== 200) {
        console.error('OpenRouter API error:', response.status, response.body)
        throw new Error(`OpenRouter API error: ${response.status} - ${response.body?.error?.message || 'Unknown error'}`)
      }

      const data = response.body as OpenRouterResponse
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('No response from OpenRouter API')
      }

      return data.choices[0].message.content
    } catch (error) {
      console.error('OpenRouter API call failed:', error)
      
      // Fallback to Blink AI if OpenRouter fails
      console.log('Falling back to Blink AI...')
      const { text } = await blink.ai.generateText({
        prompt: options.systemPrompt ? `${options.systemPrompt}\n\n${prompt}` : prompt,
        model: 'gpt-4o-mini',
        maxTokens: options.maxTokens || 4000
      })
      
      return text
    }
  }

  static async generateWithMultipleModels(
    prompt: string,
    modelIds: string[],
    options: {
      maxTokens?: number
      temperature?: number
      systemPrompt?: string
    } = {}
  ): Promise<{ [modelId: string]: string }> {
    const results: { [modelId: string]: string } = {}
    
    // Generate content with each model in parallel
    const promises = modelIds.map(async (modelId) => {
      try {
        const content = await this.generateContent(prompt, modelId, options)
        results[modelId] = content
      } catch (error) {
        console.error(`Failed to generate with model ${modelId}:`, error)
        results[modelId] = `Error: Failed to generate content with ${modelId}`
      }
    })

    await Promise.all(promises)
    return results
  }

  static async enhanceContentWithSpecializedModel(
    content: string,
    enhancementType: 'structure' | 'technical' | 'humanize' | 'business' | 'format'
  ): Promise<string> {
    const modelMap = {
      structure: 'moonshotai/kimi-dev-72b:free', // Kimi for structure
      technical: 'tngtech/deepseek-r1t2-chimera:free', // DeepSeek for technical
      humanize: 'google/gemma-3n-e4b-it:free', // Gemma for human-like
      business: 'microsoft/mai-ds-r1:free', // Microsoft for business
      format: 'nvidia/llama-3.1-nemotron-ultra-253b-v1:free' // Nemotron for formatting
    }

    const enhancementPrompts = {
      structure: 'Improve the structure and organization of this content. Make it more logical, well-organized, and easy to follow with clear sections and subsections.',
      technical: 'Enhance the technical accuracy and add more detailed explanations, examples, and step-by-step processes where applicable.',
      humanize: 'Rewrite this content to sound more natural, conversational, and human-like while maintaining professionalism and value.',
      business: 'Enhance this content with business insights, monetization strategies, market analysis, and practical business applications.',
      format: 'Improve the formatting, presentation, and professional appearance of this content. Ensure it\'s well-structured and visually appealing.'
    }

    const systemPrompt = `You are an expert content enhancer specializing in ${enhancementType}. ${enhancementPrompts[enhancementType]}`
    
    const prompt = `Please enhance the following content:\n\n${content}`

    return await this.generateContent(prompt, modelMap[enhancementType], {
      systemPrompt,
      maxTokens: 6000,
      temperature: 0.7
    })
  }

  static async generateComprehensiveContent(
    request: {
      productType: string
      niche: string
      targetAudience: string
      tone: string
      requirements: string
    },
    selectedModels: string[] = []
  ): Promise<{
    content: string
    modelUsed: string
    alternatives?: { [modelId: string]: string }
  }> {
    // Use the best model for the task or user's selection
    const primaryModel = selectedModels.length > 0 
      ? selectedModels[0] 
      : 'moonshotai/kimi-dev-72b:free' // Default to Kimi for comprehensive content

    const systemPrompt = `You are an expert digital product creator. Create comprehensive, professional, and valuable content that solves real problems for the target audience.

Focus on:
- Actionable, practical advice
- Professional presentation
- Clear structure and organization
- Genuine value for the target audience
- Commercial viability and marketability`

    const prompt = `Create a comprehensive ${request.productType} for the ${request.niche} niche.

TARGET AUDIENCE: ${request.targetAudience}
TONE: ${request.tone}
REQUIREMENTS: ${request.requirements}

Please generate a complete, professional digital product with the following structure:

**TITLE & SUBTITLE:**
- Create a compelling, marketable title
- Write an engaging subtitle that clearly communicates value

**CONTENT STRUCTURE:**
- Introduction that hooks the reader and establishes credibility
- 5-8 main sections with detailed, actionable content
- Each section should have 3-5 subsections with practical advice
- Include real examples, case studies, and actionable tips
- Add practical exercises, worksheets, or checklists where relevant
- Conclude with clear next steps and additional resources

**TABLE OF CONTENTS:**
- List all main sections and subsections
- Use clear, descriptive headings that promise value

**MONETIZATION STRATEGIES:**
- 5-7 specific ways to monetize this product
- Include pricing strategies and market positioning
- Suggest upsells, cross-sells, and product ecosystem opportunities

**MARKETING CHANNELS:**
- 6-8 specific marketing channels and tactics
- Include platform-specific strategies
- Suggest content marketing and partnership approaches

**PRICE RANGE:**
- Provide a realistic price range based on value and market
- Consider different pricing tiers and packages

**COVER DESIGN SUGGESTIONS:**
- Describe visual elements, color schemes, and typography
- Suggest layout ideas that appeal to the target audience

Make the content professional, actionable, and ready for commercial use. Ensure it provides genuine value and solves real problems for the target audience.`

    try {
      const content = await this.generateContent(prompt, primaryModel, {
        systemPrompt,
        maxTokens: 8000,
        temperature: 0.7
      })

      // If multiple models selected, generate alternatives
      let alternatives: { [modelId: string]: string } | undefined
      if (selectedModels.length > 1) {
        const alternativeModels = selectedModels.slice(1, 3) // Limit to 2 alternatives
        alternatives = await this.generateWithMultipleModels(prompt, alternativeModels, {
          systemPrompt,
          maxTokens: 6000,
          temperature: 0.7
        })
      }

      return {
        content,
        modelUsed: primaryModel,
        alternatives
      }
    } catch (error) {
      console.error('Comprehensive content generation failed:', error)
      throw new Error('Failed to generate content. Please try again.')
    }
  }

  static async searchEnhancedGeneration(
    topic: string,
    productType: string,
    targetAudience: string
  ): Promise<string> {
    try {
      // First, search for current information about the topic
      const searchResults = await blink.data.search(`${topic} trends 2024 latest`, {
        type: 'news',
        limit: 10
      })

      const searchContext = searchResults.organic_results
        ?.slice(0, 5)
        .map(result => `${result.title}: ${result.snippet}`)
        .join('\n') || ''

      const prompt = `Based on the latest information and trends, create a comprehensive ${productType} about ${topic} for ${targetAudience}.

CURRENT TRENDS AND INFORMATION:
${searchContext}

Create content that:
1. Incorporates the latest trends and information
2. Addresses current challenges and opportunities
3. Provides up-to-date strategies and tactics
4. References recent developments and changes
5. Offers timely, relevant advice

Generate a complete product outline with current, actionable content.`

      return await this.generateContent(prompt, 'moonshotai/kimi-dev-72b:free', {
        maxTokens: 6000,
        temperature: 0.7
      })
    } catch (error) {
      console.error('Search-enhanced generation failed:', error)
      throw new Error('Failed to generate search-enhanced content')
    }
  }
}