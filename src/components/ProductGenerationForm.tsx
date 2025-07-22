import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Sparkles, Wand2, Target, Volume2, FileText, Plus, TrendingUp, Image, Lightbulb } from 'lucide-react'
import { ProductGenerationRequest } from '../types/product'
import { TrendingTopics } from './TrendingTopics'
import { TrendingService, TrendingTopic } from '../services/trendingService'

interface ProductGenerationFormProps {
  selectedProductType: string
  onGenerate: (request: ProductGenerationRequest) => void
  isGenerating: boolean
}

// Helper functions for AI autofill suggestions
const getRandomNiche = () => {
  const niches = [
    'Digital Marketing for Small Businesses',
    'Personal Finance for Millennials',
    'Productivity for Remote Workers',
    'Mindfulness and Mental Health',
    'Sustainable Living and Eco-Friendly Practices',
    'AI Tools for Content Creators',
    'Fitness and Nutrition for Busy Professionals',
    'Entrepreneurship and Side Hustles'
  ]
  return niches[Math.floor(Math.random() * niches.length)]
}

const getRandomAudience = () => {
  const audiences = [
    'Busy professionals aged 25-40 looking to optimize their productivity',
    'Small business owners seeking cost-effective marketing strategies',
    'College students and recent graduates entering the job market',
    'Parents balancing work and family life',
    'Freelancers and solopreneurs building their businesses',
    'Health-conscious individuals seeking sustainable lifestyle changes',
    'Content creators and social media influencers',
    'Retirees exploring new hobbies and interests'
  ]
  return audiences[Math.floor(Math.random() * audiences.length)]
}

const getRandomTone = () => {
  const tones = ['Professional', 'Conversational', 'Inspirational', 'Educational', 'Friendly', 'Authoritative']
  return tones[Math.floor(Math.random() * tones.length)]
}

const getRandomLength = () => {
  const lengths = ['Short (5-10 pages)', 'Medium (15-25 pages)', 'Long (30-50 pages)', 'Comprehensive (50+ pages)']
  return lengths[Math.floor(Math.random() * lengths.length)]
}

const getRandomRequirements = () => {
  const requirements = [
    'Include actionable checklists and templates',
    'Add visual elements and infographics',
    'Provide real-world case studies and examples',
    'Include interactive worksheets and exercises',
    'Add bonus resources and tool recommendations',
    'Ensure mobile-friendly formatting',
    'Include social media sharing templates',
    'Add email templates for follow-up'
  ]
  return requirements[Math.floor(Math.random() * requirements.length)]
}

export function ProductGenerationForm({ selectedProductType, onGenerate, isGenerating }: ProductGenerationFormProps) {
  const [formData, setFormData] = useState<ProductGenerationRequest>({
    productType: selectedProductType,
    niche: '',
    targetAudience: '',
    tone: '',
    length: '',
    additionalRequirements: '',
    selectedModels: ['kimi', 'gemma', 'qwen3']
  })
  const [imagePrompts, setImagePrompts] = useState<string[]>([])
  const [enhancedPrompt, setEnhancedPrompt] = useState('')
  const [isEnhancing, setIsEnhancing] = useState(false)

  const generateImagePrompts = useCallback(async () => {
    try {
      const prompts = await TrendingService.getImagePromptSuggestions(selectedProductType, formData.niche)
      setImagePrompts(prompts)
    } catch (error) {
      console.error('Failed to generate image prompts:', error)
    }
  }, [selectedProductType, formData.niche])

  useEffect(() => {
    // Generate image prompts when product type or niche changes
    if (selectedProductType && formData.niche) {
      generateImagePrompts()
    }
  }, [selectedProductType, formData.niche, generateImagePrompts])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onGenerate(formData)
  }

  const handleAIAutofill = (field: keyof ProductGenerationRequest) => {
    // Simulate AI autofill with intelligent suggestions
    const suggestions = {
      niche: getRandomNiche(),
      targetAudience: getRandomAudience(),
      tone: getRandomTone(),
      length: getRandomLength(),
      additionalRequirements: getRandomRequirements()
    }
    
    if (field in suggestions) {
      setFormData(prev => ({
        ...prev,
        [field]: suggestions[field as keyof typeof suggestions]
      }))
    }
  }

  const handleTopicSelect = (topic: TrendingTopic) => {
    setFormData(prev => ({
      ...prev,
      niche: topic.title,
      targetAudience: topic.description,
      additionalRequirements: `Focus on ${topic.keywords.join(', ')}. Related topics: ${topic.relatedTopics.join(', ')}`
    }))
  }

  const handleImagePromptSelect = (prompt: string) => {
    setFormData(prev => ({
      ...prev,
      additionalRequirements: prev.additionalRequirements 
        ? `${prev.additionalRequirements}\n\nImage suggestions: ${prompt}`
        : `Image suggestions: ${prompt}`
    }))
  }

  const handleEnhancePrompt = async () => {
    if (!formData.niche) return
    
    setIsEnhancing(true)
    try {
      const enhanced = await TrendingService.enhancePrompt(formData.niche, selectedProductType)
      setEnhancedPrompt(enhanced)
      setFormData(prev => ({ ...prev, niche: enhanced }))
    } catch (error) {
      console.error('Failed to enhance prompt:', error)
    } finally {
      setIsEnhancing(false)
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="form" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="form">
            <Wand2 className="w-4 h-4 mr-2" />
            Generation Form
          </TabsTrigger>
          <TabsTrigger value="trending">
            <TrendingUp className="w-4 h-4 mr-2" />
            Trending Topics
          </TabsTrigger>
          <TabsTrigger value="images">
            <Image className="w-4 h-4 mr-2" />
            Image Prompts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="form">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-indigo-600" />
                Product Generation Settings
              </CardTitle>
              <CardDescription>
                Configure your AI-powered product generation with intelligent autofill suggestions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Niche */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="niche" className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Niche/Topic
                    </Label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleAIAutofill('niche')}
                        className="text-xs"
                      >
                        <Sparkles className="w-3 h-3 mr-1" />
                        AI Suggest
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleEnhancePrompt}
                        disabled={isEnhancing || !formData.niche}
                        className="text-xs"
                      >
                        {isEnhancing ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600 mr-1"></div>
                        ) : (
                          <Lightbulb className="w-3 h-3 mr-1" />
                        )}
                        Enhance
                      </Button>
                    </div>
                  </div>
                  <Input
                    id="niche"
                    placeholder="e.g., Digital Marketing for Small Businesses"
                    value={formData.niche}
                    onChange={(e) => setFormData(prev => ({ ...prev, niche: e.target.value }))}
                    required
                  />
                  {enhancedPrompt && (
                    <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                      Enhanced: {enhancedPrompt}
                    </div>
                  )}
                </div>

                {/* Target Audience */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="audience" className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Target Audience
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAIAutofill('targetAudience')}
                      className="text-xs"
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI Suggest
                    </Button>
                  </div>
                  <Textarea
                    id="audience"
                    placeholder="Describe your ideal customer in detail..."
                    value={formData.targetAudience}
                    onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
                    rows={3}
                    required
                  />
                </div>

                {/* Tone and Length */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2">
                        <Volume2 className="w-4 h-4" />
                        Tone
                      </Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleAIAutofill('tone')}
                        className="text-xs"
                      >
                        <Sparkles className="w-3 h-3 mr-1" />
                        AI Pick
                      </Button>
                    </div>
                    <Select value={formData.tone} onValueChange={(value) => setFormData(prev => ({ ...prev, tone: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Professional">Professional</SelectItem>
                        <SelectItem value="Conversational">Conversational</SelectItem>
                        <SelectItem value="Inspirational">Inspirational</SelectItem>
                        <SelectItem value="Educational">Educational</SelectItem>
                        <SelectItem value="Friendly">Friendly</SelectItem>
                        <SelectItem value="Authoritative">Authoritative</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Length
                      </Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleAIAutofill('length')}
                        className="text-xs"
                      >
                        <Sparkles className="w-3 h-3 mr-1" />
                        AI Pick
                      </Button>
                    </div>
                    <Select value={formData.length} onValueChange={(value) => setFormData(prev => ({ ...prev, length: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select length" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Short (5-10 pages)">Short (5-10 pages)</SelectItem>
                        <SelectItem value="Medium (15-25 pages)">Medium (15-25 pages)</SelectItem>
                        <SelectItem value="Long (30-50 pages)">Long (30-50 pages)</SelectItem>
                        <SelectItem value="Comprehensive (50+ pages)">Comprehensive (50+ pages)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Additional Requirements */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="requirements" className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Additional Requirements
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAIAutofill('additionalRequirements')}
                      className="text-xs"
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI Suggest
                    </Button>
                  </div>
                  <Textarea
                    id="requirements"
                    placeholder="Any specific requirements, features, or elements to include..."
                    value={formData.additionalRequirements}
                    onChange={(e) => setFormData(prev => ({ ...prev, additionalRequirements: e.target.value }))}
                    rows={3}
                  />
                </div>

                {/* Selected Models Display */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Selected AI Models</Label>
                  <div className="flex flex-wrap gap-2">
                    {formData.selectedModels.map((modelId) => (
                      <Badge key={modelId} variant="secondary" className="text-xs">
                        {modelId}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Generate Button */}
                <Button 
                  type="submit" 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating Product...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Generate Digital Product
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trending">
          <TrendingTopics 
            onTopicSelect={handleTopicSelect}
            onImagePromptSelect={handleImagePromptSelect}
          />
        </TabsContent>

        <TabsContent value="images">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="w-5 h-5 text-indigo-600" />
                AI Image Prompts
              </CardTitle>
              <CardDescription>
                AI-generated image prompts for your content
              </CardDescription>
            </CardHeader>
            <CardContent>
              {imagePrompts.length === 0 ? (
                <div className="text-center py-8">
                  <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No image prompts yet</h3>
                  <p className="text-gray-500">Enter a niche/topic to generate AI image suggestions</p>
                </div>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {imagePrompts.map((prompt, index) => (
                    <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Image className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-900 mb-2 line-clamp-3">{prompt}</p>
                            <Button
                              onClick={() => handleImagePromptSelect(prompt)}
                              variant="outline"
                              size="sm"
                              className="w-full"
                            >
                              <Lightbulb className="w-4 h-4 mr-2" />
                              Use This Prompt
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
      </Tabs>
    </div>
  )
}