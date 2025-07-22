import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Clock, TrendingUp, Sparkles, Lightbulb } from 'lucide-react'
import { ProductType } from '../types/product'
import { useState, useEffect } from 'react'

interface ProductTypeCardProps {
  product: ProductType
  onClick: () => void
  isSelected?: boolean
}

// AI suggestions for each product type
const getAISuggestions = (productId: string): string[] => {
  const suggestions: Record<string, string[]> = {
    'ebook': ['AI Tools for Beginners', 'Remote Work Productivity', 'Sustainable Living Guide'],
    'planner': ['2024 Goal Setting', 'Habit Tracker Pro', 'Mindfulness Journal'],
    'social-media-posts': ['AI Content Ideas', 'Viral Hook Templates', 'Engagement Boosters'],
    'blog-post-generator': ['SEO Optimization Tips', 'Content Marketing Strategies', 'Trending Topics'],
    'meme-generator': ['Current Trends', 'Viral Formats', 'Platform-Specific Memes'],
    'tiktok-script': ['Trending Sounds', 'Viral Hooks', 'Story Templates'],
    'youtube-video-script': ['Engaging Intros', 'Call-to-Action Scripts', 'Tutorial Formats'],
    'instagram-carousel': ['Educational Slides', 'Before/After Posts', 'Tips & Tricks'],
    'twitter-thread': ['Thought Leadership', 'How-to Guides', 'Industry Insights'],
    'linkedin-post': ['Professional Tips', 'Career Advice', 'Industry Updates'],
    'facebook-ad-copy': ['High-Converting Headlines', 'Audience Targeting', 'CTA Optimization']
  }
  
  return suggestions[productId] || ['Trending Topics', 'Popular Niches', 'Viral Content Ideas']
}

export function ProductTypeCard({ product, onClick, isSelected = false }: ProductTypeCardProps) {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])

  useEffect(() => {
    setSuggestions(getAISuggestions(product.id))
  }, [product.id])
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'Advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getMonetizationColor = (potential: string) => {
    switch (potential) {
      case 'Low': return 'bg-gray-100 text-gray-600'
      case 'Medium': return 'bg-blue-100 text-blue-700'
      case 'High': return 'bg-purple-100 text-purple-700'
      case 'Very High': return 'bg-amber-100 text-amber-700'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${
        isSelected ? 'ring-2 ring-indigo-500 shadow-lg' : ''
      }`}
    >
      <CardHeader className="pb-3" onClick={onClick}>
        <div className="flex items-center justify-between">
          <div className="text-3xl">{product.icon}</div>
          <Badge className={getDifficultyColor(product.difficulty)}>
            {product.difficulty}
          </Badge>
        </div>
        <CardTitle className="text-lg font-semibold">{product.name}</CardTitle>
        <CardDescription className="text-sm text-gray-600">
          {product.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-gray-500">
            <Clock className="w-4 h-4" />
            <span>{product.estimatedTime}</span>
          </div>
          <Badge className={getMonetizationColor(product.monetizationPotential)}>
            <TrendingUp className="w-3 h-3 mr-1" />
            {product.monetizationPotential}
          </Badge>
        </div>
        
        {/* AI Suggestions Section */}
        <div className="border-t pt-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1 text-xs font-medium text-indigo-600">
              <Sparkles className="w-3 h-3" />
              AI Suggestions
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                setShowSuggestions(!showSuggestions)
              }}
              className="h-6 px-2 text-xs"
            >
              {showSuggestions ? 'Hide' : 'Show'}
            </Button>
          </div>
          
          {showSuggestions && (
            <div className="space-y-1">
              {suggestions.slice(0, 3).map((suggestion, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 rounded px-2 py-1"
                >
                  <Lightbulb className="w-3 h-3 text-amber-500 flex-shrink-0" />
                  <span className="truncate">{suggestion}</span>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onClick()
                }}
                className="w-full h-7 text-xs mt-2"
              >
                <Sparkles className="w-3 h-3 mr-1" />
                Generate with AI
              </Button>
            </div>
          )}
          
          {!showSuggestions && (
            <div className="text-xs text-gray-500">
              Click to see trending ideas...
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}