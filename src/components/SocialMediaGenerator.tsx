import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Switch } from './ui/switch'
import { 
  Sparkles, 
  Wand2, 
  Hash, 
  Image, 
  TrendingUp, 
  MessageCircle,
  Share2,
  Clock,
  Target,
  Lightbulb,
  Copy,
  Download,
  RefreshCw,
  Smile,
  Video,
  FileText,
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
  Youtube,
  Camera
} from 'lucide-react'
import { 
  SocialMediaService, 
  SocialMediaRequest, 
  SocialMediaContent, 
  BlogPostContent, 
  MemeContent 
} from '../services/socialMediaService'
import { TrendingService } from '../services/trendingService'

interface SocialMediaGeneratorProps {
  onGenerate?: (content: SocialMediaContent | BlogPostContent | MemeContent) => void
}

const platforms = [
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
  { id: 'tiktok', name: 'TikTok', icon: Video, color: 'bg-black' },
  { id: 'twitter', name: 'Twitter/X', icon: Twitter, color: 'bg-blue-500' },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-600' },
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'bg-blue-700' },
  { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'bg-red-600' },
  { id: 'pinterest', name: 'Pinterest', icon: Camera, color: 'bg-red-500' },
  { id: 'general', name: 'Multi-Platform', icon: Share2, color: 'bg-gray-600' }
]

const contentTypes = [
  { id: 'blog-post', name: 'Blog Post', icon: FileText, description: 'SEO-optimized blog content' },
  { id: 'social-media-post', name: 'Social Media Post', icon: MessageCircle, description: 'Platform-specific posts' },
  { id: 'meme', name: 'Meme', icon: Smile, description: 'Viral meme content' },
  { id: 'instagram-carousel', name: 'Instagram Carousel', icon: Instagram, description: 'Multi-slide posts' },
  { id: 'tiktok-script', name: 'TikTok Script', icon: Video, description: 'Video script with hooks' },
  { id: 'youtube-script', name: 'YouTube Script', icon: Youtube, description: 'Long-form video content' },
  { id: 'twitter-thread', name: 'Twitter Thread', icon: Twitter, description: 'Multi-tweet threads' },
  { id: 'linkedin-post', name: 'LinkedIn Post', icon: Linkedin, description: 'Professional content' }
]

export function SocialMediaGenerator({ onGenerate }: SocialMediaGeneratorProps) {
  const [formData, setFormData] = useState<SocialMediaRequest>({
    contentType: 'social-media-post',
    topic: '',
    platform: 'instagram',
    tone: 'Engaging',
    targetAudience: '',
    keywords: [],
    includeHashtags: true,
    includeCallToAction: true,
    contentLength: 'medium',
    additionalRequirements: ''
  })
  
  const [keywordInput, setKeywordInput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<SocialMediaContent | BlogPostContent | MemeContent | null>(null)
  const [trendingHashtags, setTrendingHashtags] = useState<string[]>([])
  const [imagePrompts, setImagePrompts] = useState<string[]>([])
  const [isEnhancing, setIsEnhancing] = useState(false)

  const generateTrendingHashtags = useCallback(async () => {
    try {
      const hashtags = await SocialMediaService.getTrendingHashtags(formData.topic, formData.platform || 'general')
      setTrendingHashtags(hashtags)
    } catch (error) {
      console.error('Failed to generate hashtags:', error)
    }
  }, [formData.topic, formData.platform])

  const generateImagePrompts = useCallback(async () => {
    try {
      const prompts = await TrendingService.getImagePromptSuggestions(formData.contentType, formData.topic)
      setImagePrompts(prompts)
    } catch (error) {
      console.error('Failed to generate image prompts:', error)
    }
  }, [formData.contentType, formData.topic])

  // Auto-generate trending hashtags when topic or platform changes
  useEffect(() => {
    if (formData.topic && formData.platform) {
      generateTrendingHashtags()
    }
  }, [formData.topic, formData.platform, generateTrendingHashtags])

  // Auto-generate image prompts when topic changes
  useEffect(() => {
    if (formData.topic) {
      generateImagePrompts()
    }
  }, [formData.topic, formData.contentType, generateImagePrompts])

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !formData.keywords.includes(keywordInput.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, keywordInput.trim()]
      }))
      setKeywordInput('')
    }
  }

  const handleRemoveKeyword = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }))
  }

  const handleAddHashtag = (hashtag: string) => {
    if (!formData.keywords.includes(hashtag)) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, hashtag.replace('#', '')]
      }))
    }
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      let content: SocialMediaContent | BlogPostContent | MemeContent

      switch (formData.contentType) {
        case 'blog-post':
          content = await SocialMediaService.generateBlogPost(formData)
          break
        case 'meme':
          content = await SocialMediaService.generateMeme(formData)
          break
        default:
          content = await SocialMediaService.generateSocialMediaPost(formData)
      }

      setGeneratedContent(content)
      onGenerate?.(content)
    } catch (error) {
      console.error('Generation failed:', error)
      alert('Failed to generate content. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleEnhanceContent = async (enhancementType: 'viral' | 'engagement' | 'trending') => {
    if (!generatedContent) return

    setIsEnhancing(true)
    try {
      const enhanced = await SocialMediaService.enhanceSocialContent(
        generatedContent.content, 
        enhancementType
      )
      
      setGeneratedContent(prev => prev ? { ...prev, content: enhanced } : null)
    } catch (error) {
      console.error('Enhancement failed:', error)
      alert('Failed to enhance content. Please try again.')
    } finally {
      setIsEnhancing(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  const selectedPlatform = platforms.find(p => p.id === formData.platform)
  const selectedContentType = contentTypes.find(c => c.id === formData.contentType)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-indigo-600" />
            Social Media Content Generator
          </CardTitle>
          <CardDescription>
            Create viral blog posts, social media content, and memes with AI suggestions and trending insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="setup" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="setup">
                <Wand2 className="w-4 h-4 mr-2" />
                Setup
              </TabsTrigger>
              <TabsTrigger value="trending">
                <TrendingUp className="w-4 h-4 mr-2" />
                Trending
              </TabsTrigger>
              <TabsTrigger value="preview">
                <Image className="w-4 h-4 mr-2" />
                Preview
              </TabsTrigger>
            </TabsList>

            <TabsContent value="setup" className="space-y-6">
              {/* Content Type Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Content Type</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {contentTypes.map((type) => (
                    <Card 
                      key={type.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        formData.contentType === type.id 
                          ? 'ring-2 ring-indigo-500 bg-indigo-50' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, contentType: type.id as any }))}
                    >
                      <CardContent className="p-3 text-center">
                        <type.icon className="w-6 h-6 mx-auto mb-2 text-indigo-600" />
                        <div className="text-sm font-medium">{type.name}</div>
                        <div className="text-xs text-gray-500">{type.description}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Platform Selection */}
              {formData.contentType !== 'blog-post' && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Platform</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {platforms.map((platform) => (
                      <Card 
                        key={platform.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          formData.platform === platform.id 
                            ? 'ring-2 ring-indigo-500 bg-indigo-50' 
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setFormData(prev => ({ ...prev, platform: platform.id }))}
                      >
                        <CardContent className="p-3 text-center">
                          <div className={`w-8 h-8 rounded-lg ${platform.color} flex items-center justify-center mx-auto mb-2`}>
                            <platform.icon className="w-4 h-4 text-white" />
                          </div>
                          <div className="text-sm font-medium">{platform.name}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Topic Input */}
              <div className="space-y-2">
                <Label htmlFor="topic" className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Topic/Subject
                </Label>
                <Input
                  id="topic"
                  placeholder="e.g., AI productivity tips, sustainable living, digital marketing trends"
                  value={formData.topic}
                  onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                  required
                />
              </div>

              {/* Target Audience */}
              <div className="space-y-2">
                <Label htmlFor="audience">Target Audience</Label>
                <Textarea
                  id="audience"
                  placeholder="Describe your ideal audience..."
                  value={formData.targetAudience}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
                  rows={2}
                  required
                />
              </div>

              {/* Tone and Length */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Tone</Label>
                  <Select value={formData.tone} onValueChange={(value) => setFormData(prev => ({ ...prev, tone: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Professional">Professional</SelectItem>
                      <SelectItem value="Casual">Casual</SelectItem>
                      <SelectItem value="Engaging">Engaging</SelectItem>
                      <SelectItem value="Humorous">Humorous</SelectItem>
                      <SelectItem value="Inspirational">Inspirational</SelectItem>
                      <SelectItem value="Educational">Educational</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Content Length</Label>
                  <Select value={formData.contentLength} onValueChange={(value) => setFormData(prev => ({ ...prev, contentLength: value as any }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Short</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="long">Long</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Options</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="hashtags"
                        checked={formData.includeHashtags}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, includeHashtags: checked }))}
                      />
                      <Label htmlFor="hashtags" className="text-sm">Include Hashtags</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="cta"
                        checked={formData.includeCallToAction}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, includeCallToAction: checked }))}
                      />
                      <Label htmlFor="cta" className="text-sm">Include CTA</Label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Keywords */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  Keywords & Tags
                </Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add keyword..."
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
                  />
                  <Button onClick={handleAddKeyword} variant="outline">
                    Add
                  </Button>
                </div>
                {formData.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.keywords.map((keyword, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="cursor-pointer hover:bg-red-100"
                        onClick={() => handleRemoveKeyword(keyword)}
                      >
                        {keyword} ×
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Additional Requirements */}
              <div className="space-y-2">
                <Label htmlFor="requirements">Additional Requirements</Label>
                <Textarea
                  id="requirements"
                  placeholder="Any specific requirements, style preferences, or elements to include..."
                  value={formData.additionalRequirements}
                  onChange={(e) => setFormData(prev => ({ ...prev, additionalRequirements: e.target.value }))}
                  rows={2}
                />
              </div>

              {/* Generate Button */}
              <Button 
                onClick={handleGenerate}
                disabled={isGenerating || !formData.topic || !formData.targetAudience}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating {selectedContentType?.name}...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate {selectedContentType?.name}
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="trending" className="space-y-6">
              {/* Trending Hashtags */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Hash className="w-5 h-5 text-indigo-600" />
                    Trending Hashtags
                  </CardTitle>
                  <CardDescription>
                    AI-generated trending hashtags for {formData.topic || 'your topic'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {trendingHashtags.length === 0 ? (
                    <div className="text-center py-8">
                      <Hash className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Enter a topic to see trending hashtags</p>
                    </div>
                  ) : (
                    <div className="grid gap-2 md:grid-cols-2">
                      {trendingHashtags.map((hashtag, index) => (
                        <div 
                          key={index}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleAddHashtag(hashtag)}
                        >
                          <span className="text-sm font-medium">{hashtag}</span>
                          <Button variant="ghost" size="sm">
                            <Sparkles className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Image Prompts */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Image className="w-5 h-5 text-indigo-600" />
                    AI Image Prompts
                  </CardTitle>
                  <CardDescription>
                    Ready-to-use image prompts for your content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {imagePrompts.length === 0 ? (
                    <div className="text-center py-8">
                      <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Enter a topic to see image suggestions</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {imagePrompts.map((prompt, index) => (
                        <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Image className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm text-gray-900 mb-2">{prompt}</p>
                                <Button
                                  onClick={() => copyToClipboard(prompt)}
                                  variant="outline"
                                  size="sm"
                                  className="w-full"
                                >
                                  <Copy className="w-4 h-4 mr-2" />
                                  Copy Prompt
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preview" className="space-y-6">
              {generatedContent ? (
                <div className="space-y-6">
                  {/* Content Display */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          {selectedContentType?.icon && <selectedContentType.icon className="w-5 h-5" />}
                          {generatedContent.title}
                        </CardTitle>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => copyToClipboard(generatedContent.content)}
                            variant="outline"
                            size="sm"
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy
                          </Button>
                          <Button
                            onClick={() => {/* Add download functionality */}}
                            variant="outline"
                            size="sm"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Export
                          </Button>
                        </div>
                      </div>
                      {selectedPlatform && (
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded ${selectedPlatform.color}`}></div>
                          <span className="text-sm text-gray-600">Optimized for {selectedPlatform.name}</span>
                        </div>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="prose max-w-none">
                        <div className="whitespace-pre-wrap text-gray-900">
                          {generatedContent.content}
                        </div>
                      </div>

                      {/* Enhancement Buttons */}
                      <div className="flex gap-2 pt-4 border-t">
                        <Button
                          onClick={() => handleEnhanceContent('viral')}
                          disabled={isEnhancing}
                          variant="outline"
                          size="sm"
                        >
                          {isEnhancing ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <TrendingUp className="w-4 h-4 mr-2" />}
                          Make Viral
                        </Button>
                        <Button
                          onClick={() => handleEnhanceContent('engagement')}
                          disabled={isEnhancing}
                          variant="outline"
                          size="sm"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Boost Engagement
                        </Button>
                        <Button
                          onClick={() => handleEnhanceContent('trending')}
                          disabled={isEnhancing}
                          variant="outline"
                          size="sm"
                        >
                          <Lightbulb className="w-4 h-4 mr-2" />
                          Add Trends
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Hashtags */}
                  {generatedContent.hashtags && generatedContent.hashtags.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Hash className="w-5 h-5 text-indigo-600" />
                          Hashtags
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {generatedContent.hashtags.map((hashtag, index) => (
                            <Badge 
                              key={index} 
                              variant="secondary"
                              className="cursor-pointer hover:bg-indigo-100"
                              onClick={() => copyToClipboard(hashtag)}
                            >
                              {hashtag}
                            </Badge>
                          ))}
                        </div>
                        <Button
                          onClick={() => copyToClipboard(generatedContent.hashtags.join(' '))}
                          variant="outline"
                          size="sm"
                          className="mt-3"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy All Hashtags
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {/* Call to Action */}
                  {generatedContent.callToAction && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <MessageCircle className="w-5 h-5 text-indigo-600" />
                          Call to Action
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="p-3 bg-indigo-50 rounded-lg">
                          <p className="text-gray-900">{generatedContent.callToAction}</p>
                        </div>
                        <Button
                          onClick={() => copyToClipboard(generatedContent.callToAction!)}
                          variant="outline"
                          size="sm"
                          className="mt-3"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy CTA
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {/* Engagement Tips */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-indigo-600" />
                        Engagement Tips
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-3 md:grid-cols-2">
                        <div>
                          <h4 className="font-medium mb-2 flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Best Posting Times
                          </h4>
                          <div className="space-y-1">
                            {generatedContent.bestPostingTimes.map((time, index) => (
                              <div key={index} className="text-sm text-gray-600">{time}</div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2 flex items-center gap-2">
                            <Lightbulb className="w-4 h-4" />
                            Engagement Tips
                          </h4>
                          <div className="space-y-1">
                            {generatedContent.engagementTips.map((tip, index) => (
                              <div key={index} className="text-sm text-gray-600">• {tip}</div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Share2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No content generated yet</h3>
                    <p className="text-gray-500">Generate content to see the preview</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}