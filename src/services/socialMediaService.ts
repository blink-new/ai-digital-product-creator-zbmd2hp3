import { blink } from '../blink/client'

export interface SocialMediaRequest {
  contentType: string
  topic: string
  platform?: string
  tone: string
  targetAudience: string
  keywords: string[]
  includeHashtags: boolean
  includeCallToAction: boolean
  contentLength: 'short' | 'medium' | 'long'
  additionalRequirements: string
}

export interface SocialMediaContent {
  title: string
  content: string
  hashtags: string[]
  callToAction?: string
  platform: string
  estimatedReach: string
  engagementTips: string[]
  bestPostingTimes: string[]
}

export interface BlogPostContent {
  title: string
  content: string
  metaDescription: string
  keywords: string[]
  readingTime: string
  seoScore: string
  callToAction?: string
  hashtags: string[]
  engagementTips: string[]
  bestPostingTimes: string[]
}

export interface MemeContent {
  title: string
  content: string
  imagePrompt: string
  caption: string
  hashtags: string[]
  viralPotential: string
  platform: string
  engagementTips: string[]
  bestPostingTimes: string[]
  callToAction?: string
}

export class SocialMediaService {
  static async generateSocialMediaPost(request: SocialMediaRequest): Promise<SocialMediaContent> {
    try {
      const platformSpecs = this.getPlatformSpecifications(request.platform || 'general')
      
      const prompt = `Create a ${request.contentLength} ${request.tone.toLowerCase()} social media post for ${request.platform || 'general social media'} about "${request.topic}" targeting ${request.targetAudience}.

**PLATFORM SPECIFICATIONS:**
${platformSpecs}

**CONTENT REQUIREMENTS:**
- Topic: ${request.topic}
- Tone: ${request.tone}
- Target Audience: ${request.targetAudience}
- Length: ${request.contentLength}
- Keywords to include: ${request.keywords.join(', ')}
- Include hashtags: ${request.includeHashtags}
- Include call-to-action: ${request.includeCallToAction}
- Additional requirements: ${request.additionalRequirements}

**OUTPUT FORMAT:**
Please provide:
1. **TITLE:** A compelling title for the post
2. **CONTENT:** The main post content optimized for the platform
3. **HASHTAGS:** 10-15 relevant hashtags (if requested)
4. **CALL_TO_ACTION:** A compelling CTA (if requested)
5. **ENGAGEMENT_TIPS:** 5 tips to boost engagement
6. **BEST_POSTING_TIMES:** Optimal posting times for this platform

Make the content engaging, platform-appropriate, and designed to maximize reach and engagement.`

      const { text } = await blink.ai.generateText({
        prompt,
        model: 'gpt-4o-mini',
        maxTokens: 2000,
        search: true
      })

      return this.parseSocialMediaContent(text, request.platform || 'general')
    } catch (error) {
      console.error('Social media generation failed:', error)
      return this.generateFallbackSocialContent(request)
    }
  }

  static async generateBlogPost(request: SocialMediaRequest): Promise<BlogPostContent> {
    try {
      const prompt = `Create a comprehensive, SEO-optimized blog post about "${request.topic}" with a ${request.tone.toLowerCase()} tone for ${request.targetAudience}.

**CONTENT REQUIREMENTS:**
- Topic: ${request.topic}
- Tone: ${request.tone}
- Target Audience: ${request.targetAudience}
- Length: ${request.contentLength} (short: 500-800 words, medium: 800-1500 words, long: 1500+ words)
- Keywords to include: ${request.keywords.join(', ')}
- Additional requirements: ${request.additionalRequirements}

**OUTPUT FORMAT:**
Please provide:
1. **TITLE:** SEO-optimized title (50-60 characters)
2. **META_DESCRIPTION:** Meta description (150-160 characters)
3. **CONTENT:** Full blog post with headers, subheaders, and engaging content
4. **KEYWORDS:** Primary and secondary keywords
5. **READING_TIME:** Estimated reading time
6. **SEO_SCORE:** Estimated SEO score (1-10)
7. **HASHTAGS:** Social media hashtags for promotion
8. **CALL_TO_ACTION:** Compelling CTA for the end of the post

Structure the content with:
- Engaging introduction
- Clear headers and subheaders
- Actionable insights
- Conclusion with next steps
- SEO optimization throughout`

      const { text } = await blink.ai.generateText({
        prompt,
        model: 'gpt-4o-mini',
        maxTokens: 4000,
        search: true
      })

      return this.parseBlogPostContent(text)
    } catch (error) {
      console.error('Blog post generation failed:', error)
      return this.generateFallbackBlogContent(request)
    }
  }

  static async generateMeme(request: SocialMediaRequest): Promise<MemeContent> {
    try {
      const prompt = `Create a viral meme concept about "${request.topic}" with a ${request.tone.toLowerCase()} tone for ${request.targetAudience}.

**MEME REQUIREMENTS:**
- Topic: ${request.topic}
- Tone: ${request.tone}
- Target Audience: ${request.targetAudience}
- Platform: ${request.platform || 'general'}
- Keywords: ${request.keywords.join(', ')}
- Additional requirements: ${request.additionalRequirements}

**OUTPUT FORMAT:**
Please provide:
1. **TITLE:** Catchy meme title
2. **IMAGE_PROMPT:** Detailed description for meme image creation
3. **CAPTION:** Meme text/caption that goes on the image
4. **CONTENT:** Additional text content to accompany the meme
5. **HASHTAGS:** Trending hashtags for maximum reach
6. **VIRAL_POTENTIAL:** Assessment of viral potential (1-10)
7. **ENGAGEMENT_TIPS:** Tips to maximize meme engagement

Make it relatable, shareable, and aligned with current meme trends while staying relevant to the topic.`

      const { text } = await blink.ai.generateText({
        prompt,
        model: 'gpt-4o-mini',
        maxTokens: 1500,
        search: true
      })

      return this.parseMemeContent(text, request.platform || 'general')
    } catch (error) {
      console.error('Meme generation failed:', error)
      return this.generateFallbackMemeContent(request)
    }
  }

  static async getTrendingHashtags(topic: string, platform: string): Promise<string[]> {
    try {
      const prompt = `Generate 15-20 trending hashtags for "${topic}" optimized for ${platform}. 

Include a mix of:
- Popular trending hashtags
- Niche-specific hashtags
- Branded hashtags
- Community hashtags
- Location-based hashtags (if relevant)

Return as a simple list, one hashtag per line, including the # symbol.`

      const { text } = await blink.ai.generateText({
        prompt,
        model: 'gpt-4o-mini',
        maxTokens: 500,
        search: true
      })

      const hashtags = text
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.startsWith('#'))
        .slice(0, 20)

      return hashtags.length > 0 ? hashtags : this.getFallbackHashtags(topic, platform)
    } catch (error) {
      console.error('Hashtag generation failed:', error)
      return this.getFallbackHashtags(topic, platform)
    }
  }

  static async enhanceSocialContent(content: string, enhancementType: 'viral' | 'engagement' | 'trending'): Promise<string> {
    try {
      const enhancementPrompts = {
        viral: 'Rewrite this content to maximize viral potential. Add hooks, emotional triggers, and shareable elements while maintaining the core message.',
        engagement: 'Enhance this content to boost engagement. Add questions, calls for interaction, and elements that encourage comments and shares.',
        trending: 'Update this content with current trends, trending topics, and popular culture references while keeping it relevant and authentic.'
      }

      const { text } = await blink.ai.generateText({
        prompt: `${enhancementPrompts[enhancementType]}\n\nOriginal content:\n${content}`,
        model: 'gpt-4o-mini',
        maxTokens: 1500,
        search: true
      })

      return text
    } catch (error) {
      console.error('Content enhancement failed:', error)
      return content
    }
  }

  private static getPlatformSpecifications(platform: string): string {
    const specs: Record<string, string> = {
      instagram: `
- Character limit: 2,200 characters
- Optimal post length: 125-150 characters
- Use 3-5 hashtags in the first comment
- Include emojis and visual elements
- Focus on high-quality visuals
- Use Instagram-specific features (Stories, Reels)`,
      
      tiktok: `
- Video-first platform
- Hook viewers in first 3 seconds
- Use trending sounds and effects
- Keep captions short and punchy
- Include trending hashtags
- Focus on entertainment and education`,
      
      twitter: `
- Character limit: 280 characters
- Use 1-2 hashtags maximum
- Include mentions and replies
- Thread for longer content
- Focus on real-time engagement
- Use Twitter-specific language`,
      
      linkedin: `
- Professional tone required
- Longer-form content performs well
- Use industry-specific hashtags
- Include professional insights
- Tag relevant companies/people
- Focus on value and expertise`,
      
      facebook: `
- Optimal length: 40-80 characters
- Use Facebook-specific features
- Include call-to-action buttons
- Focus on community building
- Use relevant hashtags sparingly
- Encourage meaningful conversations`,
      
      youtube: `
- Focus on video content
- Compelling titles and thumbnails
- Detailed descriptions
- Use relevant tags
- Include timestamps
- Encourage subscriptions and engagement`,
      
      pinterest: `
- Visual-first platform
- Use keyword-rich descriptions
- Include relevant hashtags
- Focus on inspiration and ideas
- Use high-quality vertical images
- Include website links`,
      
      general: `
- Platform-agnostic content
- Adaptable to multiple platforms
- Focus on universal engagement
- Include versatile hashtags
- Maintain broad appeal
- Optimize for cross-platform sharing`
    }

    return specs[platform] || specs.general
  }

  private static parseSocialMediaContent(text: string, platform: string): SocialMediaContent {
    const title = this.extractSection(text, 'TITLE') || 'Social Media Post'
    const content = this.extractSection(text, 'CONTENT') || text
    const hashtags = this.extractHashtags(text)
    const callToAction = this.extractSection(text, 'CALL_TO_ACTION')
    const engagementTips = this.extractList(text, 'ENGAGEMENT_TIPS')
    const bestPostingTimes = this.extractList(text, 'BEST_POSTING_TIMES')

    return {
      title,
      content,
      hashtags,
      callToAction,
      platform,
      estimatedReach: this.calculateEstimatedReach(platform, hashtags.length),
      engagementTips: engagementTips.length > 0 ? engagementTips : this.getDefaultEngagementTips(platform),
      bestPostingTimes: bestPostingTimes.length > 0 ? bestPostingTimes : this.getDefaultPostingTimes(platform)
    }
  }

  private static parseBlogPostContent(text: string): BlogPostContent {
    const title = this.extractSection(text, 'TITLE') || 'Blog Post'
    const content = this.extractSection(text, 'CONTENT') || text
    const metaDescription = this.extractSection(text, 'META_DESCRIPTION') || title.substring(0, 150)
    const keywords = this.extractList(text, 'KEYWORDS')
    const readingTime = this.extractSection(text, 'READING_TIME') || this.calculateReadingTime(content)
    const seoScore = this.extractSection(text, 'SEO_SCORE') || '7/10'
    const hashtags = this.extractHashtags(text)
    const callToAction = this.extractSection(text, 'CALL_TO_ACTION')

    return {
      title,
      content,
      metaDescription,
      keywords: keywords.length > 0 ? keywords : ['blog', 'content', 'article'],
      readingTime,
      seoScore,
      hashtags,
      callToAction,
      engagementTips: this.getDefaultEngagementTips('blog'),
      bestPostingTimes: this.getDefaultPostingTimes('blog')
    }
  }

  private static parseMemeContent(text: string, platform: string): MemeContent {
    const title = this.extractSection(text, 'TITLE') || 'Meme'
    const imagePrompt = this.extractSection(text, 'IMAGE_PROMPT') || 'Funny meme image'
    const caption = this.extractSection(text, 'CAPTION') || 'Meme caption'
    const content = this.extractSection(text, 'CONTENT') || text
    const hashtags = this.extractHashtags(text)
    const viralPotential = this.extractSection(text, 'VIRAL_POTENTIAL') || '7/10'
    const callToAction = this.extractSection(text, 'CALL_TO_ACTION')

    return {
      title,
      content,
      imagePrompt,
      caption,
      hashtags,
      viralPotential,
      platform,
      callToAction,
      engagementTips: this.getDefaultEngagementTips('meme'),
      bestPostingTimes: this.getDefaultPostingTimes(platform)
    }
  }

  private static extractSection(text: string, sectionName: string): string | undefined {
    const patterns = [
      new RegExp(`\\*\\*${sectionName}[^:]*:\\*\\*\\s*(.+?)(?=\\n\\*\\*|$)`, 'is'),
      new RegExp(`${sectionName}:\\s*(.+?)(?=\\n[A-Z_]+:|$)`, 'is'),
      new RegExp(`\\*\\*${sectionName}\\*\\*\\s*(.+?)(?=\\n\\*\\*|$)`, 'is')
    ]

    for (const pattern of patterns) {
      const match = text.match(pattern)
      if (match) {
        return match[1].trim().replace(/\*\*/g, '')
      }
    }

    return undefined
  }

  private static extractHashtags(text: string): string[] {
    const hashtagMatches = text.match(/#[\w\d_]+/g)
    if (hashtagMatches) {
      return [...new Set(hashtagMatches)].slice(0, 15)
    }

    // Extract from HASHTAGS section
    const hashtagSection = this.extractSection(text, 'HASHTAGS')
    if (hashtagSection) {
      const hashtags = hashtagSection
        .split(/[\n,]/)
        .map(tag => tag.trim())
        .filter(tag => tag.startsWith('#'))
        .slice(0, 15)
      
      if (hashtags.length > 0) return hashtags
    }

    return []
  }

  private static extractList(text: string, sectionName: string): string[] {
    const section = this.extractSection(text, sectionName)
    if (section) {
      return section
        .split('\n')
        .map(line => line.trim().replace(/^[-•*]\s*/, '').replace(/^\d+\.\s*/, ''))
        .filter(line => line.length > 3)
        .slice(0, 8)
    }
    return []
  }

  private static calculateEstimatedReach(platform: string, hashtagCount: number): string {
    const baseReach: Record<string, number> = {
      instagram: 1000,
      tiktok: 2000,
      twitter: 500,
      linkedin: 800,
      facebook: 600,
      youtube: 1500,
      pinterest: 1200,
      general: 800
    }

    const base = baseReach[platform] || 800
    const multiplier = 1 + (hashtagCount * 0.1)
    const estimated = Math.round(base * multiplier)

    return `${estimated.toLocaleString()}+ impressions`
  }

  private static calculateReadingTime(content: string): string {
    const wordsPerMinute = 200
    const wordCount = content.split(/\s+/).length
    const minutes = Math.ceil(wordCount / wordsPerMinute)
    return `${minutes} min read`
  }

  private static getDefaultEngagementTips(platform: string): string[] {
    const tips: Record<string, string[]> = {
      instagram: [
        'Post during peak hours (6-9 AM, 12-2 PM, 5-7 PM)',
        'Use Instagram Stories for behind-the-scenes content',
        'Engage with comments within the first hour',
        'Use location tags to increase discoverability',
        'Create carousel posts for higher engagement'
      ],
      tiktok: [
        'Hook viewers in the first 3 seconds',
        'Use trending sounds and effects',
        'Post consistently (1-3 times per day)',
        'Engage with trending challenges',
        'Keep videos under 60 seconds for better reach'
      ],
      twitter: [
        'Tweet during business hours for B2B content',
        'Use Twitter threads for longer content',
        'Engage in real-time conversations',
        'Retweet and quote tweet relevant content',
        'Use polls to increase engagement'
      ],
      linkedin: [
        'Post during business hours (Tuesday-Thursday)',
        'Share industry insights and expertise',
        'Use professional headshots and company logos',
        'Engage with industry leaders and peers',
        'Share behind-the-scenes business content'
      ],
      blog: [
        'Optimize for SEO with relevant keywords',
        'Include internal and external links',
        'Use compelling headlines and subheadings',
        'Add social sharing buttons',
        'Encourage comments and discussion'
      ],
      meme: [
        'Post when your audience is most active',
        'Use current trends and pop culture references',
        'Keep text minimal and impactful',
        'Engage with meme communities',
        'Time posts with trending topics'
      ]
    }

    return tips[platform] || tips.instagram
  }

  private static getDefaultPostingTimes(platform: string): string[] {
    const times: Record<string, string[]> = {
      instagram: ['6-9 AM', '12-2 PM', '5-7 PM', 'Tuesday-Thursday'],
      tiktok: ['6-10 AM', '7-9 PM', 'Tuesday-Thursday', 'Sunday'],
      twitter: ['8-10 AM', '12-3 PM', '5-6 PM', 'Monday-Friday'],
      linkedin: ['7:45-8:30 AM', '12-1 PM', '5-6 PM', 'Tuesday-Thursday'],
      facebook: ['9 AM-12 PM', '1-3 PM', 'Wednesday-Friday'],
      youtube: ['2-4 PM', '8-11 PM', 'Thursday-Saturday'],
      pinterest: ['8-11 PM', 'Saturday-Monday'],
      blog: ['10-11 AM', '2-3 PM', 'Tuesday-Thursday'],
      meme: ['6-9 PM', '9-11 PM', 'Friday-Sunday']
    }

    return times[platform] || times.instagram
  }

  private static getFallbackHashtags(topic: string, platform: string): string[] {
    const topicWords = topic.toLowerCase().split(' ')
    const baseHashtags = topicWords.map(word => `#${word.replace(/[^a-z0-9]/g, '')}`)
    
    const platformHashtags: Record<string, string[]> = {
      instagram: ['#instagood', '#photooftheday', '#instadaily', '#follow', '#like4like'],
      tiktok: ['#fyp', '#foryou', '#viral', '#trending', '#tiktok'],
      twitter: ['#trending', '#news', '#follow', '#retweet', '#twitter'],
      linkedin: ['#professional', '#business', '#career', '#networking', '#industry'],
      general: ['#content', '#social', '#digital', '#online', '#community']
    }

    return [
      ...baseHashtags.slice(0, 3),
      ...(platformHashtags[platform] || platformHashtags.general)
    ].slice(0, 10)
  }

  private static generateFallbackSocialContent(request: SocialMediaRequest): SocialMediaContent {
    return {
      title: `${request.topic} - Social Media Post`,
      content: `🌟 Exciting insights about ${request.topic}! 

Perfect for ${request.targetAudience} who want to stay ahead of the curve.

${request.includeCallToAction ? '👉 What are your thoughts? Share in the comments below!' : ''}

#${request.topic.replace(/\s+/g, '')} #SocialMedia #Content`,
      hashtags: this.getFallbackHashtags(request.topic, request.platform || 'general'),
      callToAction: request.includeCallToAction ? 'Engage with this post and share your thoughts!' : undefined,
      platform: request.platform || 'general',
      estimatedReach: '1,000+ impressions',
      engagementTips: this.getDefaultEngagementTips(request.platform || 'general'),
      bestPostingTimes: this.getDefaultPostingTimes(request.platform || 'general')
    }
  }

  private static generateFallbackBlogContent(request: SocialMediaRequest): BlogPostContent {
    const content = `# ${request.topic}: A Comprehensive Guide

## Introduction

Welcome to our comprehensive guide on ${request.topic}. This resource is specifically designed for ${request.targetAudience} who want to understand and master this important topic.

## Key Concepts

Understanding ${request.topic} requires a solid foundation in the core concepts and principles that drive success in this area.

## Best Practices

Here are the essential best practices you should follow:

1. Start with a clear understanding of your goals
2. Research thoroughly before taking action
3. Implement strategies systematically
4. Monitor and adjust based on results
5. Stay updated with latest trends and developments

## Conclusion

${request.topic} is an essential skill for ${request.targetAudience}. By following the strategies outlined in this guide, you'll be well-equipped to achieve your goals.

${request.includeCallToAction ? '## Take Action Today\n\nReady to get started? Apply these insights to your own situation and see the results for yourself!' : ''}`

    return {
      title: `${request.topic}: Complete Guide for ${request.targetAudience}`,
      content,
      metaDescription: `Comprehensive guide on ${request.topic} for ${request.targetAudience}. Learn best practices, strategies, and actionable insights.`,
      keywords: [request.topic.toLowerCase(), 'guide', 'tips', 'strategies'],
      readingTime: '5 min read',
      seoScore: '7/10',
      hashtags: this.getFallbackHashtags(request.topic, 'blog'),
      callToAction: request.includeCallToAction ? 'Apply these insights to your own situation and see the results!' : undefined,
      engagementTips: this.getDefaultEngagementTips('blog'),
      bestPostingTimes: this.getDefaultPostingTimes('blog')
    }
  }

  private static generateFallbackMemeContent(request: SocialMediaRequest): MemeContent {
    return {
      title: `${request.topic} Meme`,
      content: `When someone mentions ${request.topic} and you're the expert in the room 😎`,
      imagePrompt: `Funny meme image related to ${request.topic}, showing someone looking confident or knowledgeable`,
      caption: `Me explaining ${request.topic} to ${request.targetAudience}`,
      hashtags: this.getFallbackHashtags(request.topic, request.platform || 'general'),
      viralPotential: '7/10',
      platform: request.platform || 'general',
      callToAction: request.includeCallToAction ? 'Tag someone who needs to see this!' : undefined,
      engagementTips: this.getDefaultEngagementTips('meme'),
      bestPostingTimes: this.getDefaultPostingTimes(request.platform || 'general')
    }
  }
}