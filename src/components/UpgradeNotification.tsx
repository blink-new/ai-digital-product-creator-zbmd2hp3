import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Separator } from './ui/separator'
import { 
  Sparkles, 
  Zap, 
  Brain, 
  Search, 
  Lightbulb, 
  TrendingUp, 
  Star, 
  CheckCircle, 
  X,
  ExternalLink,
  Rocket
} from 'lucide-react'

interface UpgradeNotificationProps {
  onClose: () => void
}

export function UpgradeNotification({ onClose }: UpgradeNotificationProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const features = [
    {
      icon: <Zap className="h-6 w-6 text-purple-600" />,
      title: "OpenRouter Integration",
      description: "Access to 8+ premium AI models including Claude 3.5 Sonnet, Kimi, DeepSeek, and more",
      benefits: [
        "Higher quality content generation",
        "Specialized model expertise",
        "Multi-model perspectives",
        "Advanced reasoning capabilities"
      ]
    },
    {
      icon: <Search className="h-6 w-6 text-blue-600" />,
      title: "AI Pain Point Discovery",
      description: "Web search integration to find real social media pain points and auto-generate products",
      benefits: [
        "Real-time market research",
        "Social media trend analysis",
        "Automated product suggestions",
        "Market validation insights"
      ]
    },
    {
      icon: <Lightbulb className="h-6 w-6 text-yellow-600" />,
      title: "Quick Ideas Hub",
      description: "15+ pre-filled product ideas with instant generation for rapid prototyping",
      benefits: [
        "No more blank page syndrome",
        "Trending product concepts",
        "One-click generation",
        "Proven market demand"
      ]
    },
    {
      icon: <Brain className="h-6 w-6 text-green-600" />,
      title: "Enhanced AI Models",
      description: "Premium models with specialized capabilities for different content types",
      benefits: [
        "Claude 3.5 Sonnet for creativity",
        "Kimi for structured thinking",
        "DeepSeek for technical content",
        "NVIDIA Nemotron for formatting"
      ]
    }
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % features.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + features.length) % features.length)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-4 top-4"
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                <Rocket className="h-8 w-8 text-white" />
              </div>
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg px-4 py-2">
                🚀 MAJOR UPGRADE
              </Badge>
            </div>
            
            <div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                OpenRouter Integration Complete!
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                Your AI Digital Product Creator just got supercharged with premium AI models and advanced features
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Feature Showcase */}
          <div className="relative">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  {features[currentSlide].icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {features[currentSlide].title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {features[currentSlide].description}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {features[currentSlide].benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-4">
              <Button variant="outline" size="sm" onClick={prevSlide}>
                ← Previous
              </Button>
              <div className="flex gap-2">
                {features.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentSlide ? 'bg-purple-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              <Button variant="outline" size="sm" onClick={nextSlide}>
                Next →
              </Button>
            </div>
          </div>

          <Separator />

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">8+</div>
              <div className="text-sm text-purple-700">Premium AI Models</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">15+</div>
              <div className="text-sm text-blue-700">Quick Ideas</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">40+</div>
              <div className="text-sm text-green-700">Product Types</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">∞</div>
              <div className="text-sm text-yellow-700">Pain Points</div>
            </div>
          </div>

          <Separator />

          {/* What's New Summary */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">What's New in This Update:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Star className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <div className="font-medium">Premium AI Models</div>
                    <div className="text-sm text-gray-600">Claude 3.5 Sonnet, Kimi, DeepSeek, Qwen, Nemotron</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Star className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <div className="font-medium">Multi-Model Generation</div>
                    <div className="text-sm text-gray-600">Combine up to 3 models for diverse perspectives</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Star className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <div className="font-medium">Enhanced Content Quality</div>
                    <div className="text-sm text-gray-600">Better structure, creativity, and professionalism</div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Star className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <div className="font-medium">Real-Time Market Research</div>
                    <div className="text-sm text-gray-600">Find trending pain points from social media</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Star className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <div className="font-medium">Quick Start Templates</div>
                    <div className="text-sm text-gray-600">15+ pre-filled ideas for instant generation</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Star className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <div className="font-medium">Improved UI/UX</div>
                    <div className="text-sm text-gray-600">Better navigation and enhanced user experience</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button 
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              onClick={onClose}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Start Creating with New Features
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => window.open('https://blink.new/docs', '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Documentation
            </Button>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 pt-4 border-t">
            <p>
              🎉 Thank you for using AI Digital Product Creator! 
              <br />
              These upgrades are designed to help you create even better digital products.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}