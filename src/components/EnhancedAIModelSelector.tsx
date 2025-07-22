import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Checkbox } from './ui/checkbox'
import { Separator } from './ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import { aiModels } from '../data/aiModels'
import { Brain, Zap, Star, Users, Code, Sparkles, TrendingUp, Clock } from 'lucide-react'

interface EnhancedAIModelSelectorProps {
  selectedModels: string[]
  onModelChange: (models: string[]) => void
  maxSelections?: number
}

export function EnhancedAIModelSelector({ 
  selectedModels, 
  onModelChange, 
  maxSelections = 3 
}: EnhancedAIModelSelectorProps) {
  const [showDetails, setShowDetails] = useState(false)

  const activeModels = aiModels.filter(model => model.isActive)
  const premiumModels = activeModels.filter(model => 
    ['claude-sonnet', 'kimi', 'qwen3', 'nemotron'].includes(model.id)
  )
  const standardModels = activeModels.filter(model => 
    !['claude-sonnet', 'kimi', 'qwen3', 'nemotron'].includes(model.id)
  )

  const handleModelToggle = (modelId: string) => {
    if (selectedModels.includes(modelId)) {
      onModelChange(selectedModels.filter(id => id !== modelId))
    } else if (selectedModels.length < maxSelections) {
      onModelChange([...selectedModels, modelId])
    }
  }

  const getModelIcon = (specialization: string) => {
    if (specialization.includes('Creative') || specialization.includes('Analytical')) return <Sparkles className="h-4 w-4" />
    if (specialization.includes('Structured')) return <Brain className="h-4 w-4" />
    if (specialization.includes('Technical')) return <Code className="h-4 w-4" />
    if (specialization.includes('Human-like')) return <Users className="h-4 w-4" />
    if (specialization.includes('Business')) return <TrendingUp className="h-4 w-4" />
    if (specialization.includes('Fast')) return <Zap className="h-4 w-4" />
    return <Star className="h-4 w-4" />
  }

  const getProviderBadgeColor = (provider: string) => {
    switch (provider) {
      case 'Anthropic': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'OpenAI': return 'bg-green-100 text-green-800 border-green-200'
      case 'Google': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'NVIDIA': return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'Microsoft': return 'bg-cyan-100 text-cyan-800 border-cyan-200'
      case 'Moonshot': return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      case 'DeepSeek': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Alibaba': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const ModelCard = ({ model, isPremium = false }: { model: any, isPremium?: boolean }) => (
    <TooltipProvider key={model.id}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card 
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedModels.includes(model.id) 
                ? 'ring-2 ring-indigo-500 bg-indigo-50' 
                : 'hover:bg-gray-50'
            } ${
              selectedModels.length >= maxSelections && !selectedModels.includes(model.id)
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
            onClick={() => handleModelToggle(model.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox 
                    checked={selectedModels.includes(model.id)}
                    onChange={() => {}}
                    className="pointer-events-none"
                  />
                  {getModelIcon(model.specialization)}
                  <div>
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      {model.name}
                      {isPremium && (
                        <Badge variant="secondary" className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                          Premium
                        </Badge>
                      )}
                    </CardTitle>
                    <Badge 
                      variant="outline" 
                      className={`text-xs mt-1 ${getProviderBadgeColor(model.provider)}`}
                    >
                      {model.provider}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="text-xs font-medium text-indigo-600">
                  {model.specialization}
                </div>
                <CardDescription className="text-xs leading-relaxed">
                  {model.description}
                </CardDescription>
              </div>
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-xs">
          <div className="space-y-2">
            <div className="font-medium">{model.name}</div>
            <div className="text-sm text-gray-600">{model.description}</div>
            <div className="text-xs text-gray-500">
              Best for: {model.specialization.toLowerCase()}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">AI Model Selection</h3>
          <p className="text-sm text-gray-600">
            Choose up to {maxSelections} models for multi-perspective content generation
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {selectedModels.length}/{maxSelections} selected
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs"
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </Button>
        </div>
      </div>

      {/* OpenRouter Integration Notice */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Zap className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-blue-900">OpenRouter Integration Active</h4>
              <p className="text-sm text-blue-700">
                Access to 8+ premium AI models for specialized content generation
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Premium Models */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-purple-600" />
          <h4 className="font-medium text-gray-900">Premium Models</h4>
          <Badge className="text-xs bg-gradient-to-r from-purple-500 to-pink-500">
            OpenRouter Powered
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {premiumModels.map(model => (
            <ModelCard key={model.id} model={model} isPremium={true} />
          ))}
        </div>
      </div>

      <Separator />

      {/* Standard Models */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-600" />
          <h4 className="font-medium text-gray-900">Standard Models</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {standardModels.map(model => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>
      </div>

      {/* Model Combination Suggestions */}
      {selectedModels.length > 0 && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="space-y-2">
              <h4 className="font-medium text-green-900 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Smart Combination Detected
              </h4>
              <p className="text-sm text-green-700">
                {selectedModels.length === 1 && "Great choice! Consider adding a complementary model for diverse perspectives."}
                {selectedModels.length === 2 && "Excellent combination! This will provide balanced content with multiple viewpoints."}
                {selectedModels.length === 3 && "Perfect! This combination will generate comprehensive, multi-perspective content."}
              </p>
              {selectedModels.includes('claude-sonnet') && selectedModels.includes('kimi') && (
                <p className="text-xs text-green-600 font-medium">
                  💡 Claude + Kimi = Exceptional creative content with structured thinking
                </p>
              )}
              {selectedModels.includes('deepseek') && selectedModels.includes('nemotron') && (
                <p className="text-xs text-green-600 font-medium">
                  💡 DeepSeek + Nemotron = Technical excellence with professional formatting
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Selection Buttons */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Quick Selections:</h4>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onModelChange(['claude-sonnet', 'kimi', 'gemma'])}
            className="text-xs"
          >
            Creative Suite
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onModelChange(['deepseek', 'nemotron', 'mai'])}
            className="text-xs"
          >
            Business Pro
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onModelChange(['claude-sonnet', 'qwen3', 'mai'])}
            className="text-xs"
          >
            Balanced Mix
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onModelChange(['gpt4o-mini'])}
            className="text-xs"
          >
            Fast & Efficient
          </Button>
        </div>
      </div>

      {showDetails && (
        <Card className="bg-gray-50">
          <CardContent className="p-4">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Model Details & Pricing</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <h5 className="font-medium mb-2">Premium Features:</h5>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Advanced reasoning capabilities</li>
                    <li>• Specialized domain expertise</li>
                    <li>• Higher context windows</li>
                    <li>• Better content quality</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Usage Tips:</h5>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Combine 2-3 models for best results</li>
                    <li>• Use Claude for creative content</li>
                    <li>• Use Kimi for structured planning</li>
                    <li>• Use DeepSeek for technical content</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}