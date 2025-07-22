import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Checkbox } from './ui/checkbox'
import { 
  Search, 
  TrendingUp, 
  Target, 
  DollarSign, 
  Users, 
  AlertTriangle,
  Lightbulb,
  BarChart3,
  MapPin,
  Clock,
  Zap,
  CheckCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react'
import { PainPointService, PainPoint, ProductSuggestion, PainPointAnalysis } from '../services/painPointService'
import { ProductGenerationRequest } from '../types/product'

interface PainPointDiscoveryProps {
  onGenerateProduct: (request: ProductGenerationRequest) => void
}

export function PainPointDiscovery({ onGenerateProduct }: PainPointDiscoveryProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [targetAudience, setTargetAudience] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['reddit', 'twitter'])
  const [isSearching, setIsSearching] = useState(false)
  const [analysis, setAnalysis] = useState<PainPointAnalysis | null>(null)

  const platforms = [
    { id: 'reddit', name: 'Reddit', icon: '🔴' },
    { id: 'twitter', name: 'Twitter/X', icon: '🐦' },
    { id: 'facebook', name: 'Facebook', icon: '📘' },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
    { id: 'instagram', name: 'Instagram', icon: '📸' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵' },
    { id: 'youtube', name: 'YouTube', icon: '📺' },
    { id: 'discord', name: 'Discord', icon: '🎮' }
  ]

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    )
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      const result = await PainPointService.discoverPainPoints(
        searchQuery,
        selectedPlatforms,
        targetAudience || undefined
      )
      setAnalysis(result)
    } catch (error) {
      console.error('Pain point discovery failed:', error)
      alert('Failed to discover pain points. Please try again.')
    } finally {
      setIsSearching(false)
    }
  }

  const handleGenerateFromPainPoint = async (painPoint: PainPoint) => {
    try {
      const productSpec = await PainPointService.generateProductFromPainPoint(painPoint)
      onGenerateProduct(productSpec)
    } catch (error) {
      console.error('Product generation failed:', error)
      alert('Failed to generate product. Please try again.')
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Critical': return 'bg-red-100 text-red-800'
      case 'High': return 'bg-orange-100 text-orange-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPotentialColor = (potential: string) => {
    switch (potential) {
      case 'Very High': return 'bg-emerald-100 text-emerald-800'
      case 'High': return 'bg-green-100 text-green-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Low': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5 text-indigo-600" />
            AI Pain Point Discovery
          </CardTitle>
          <CardDescription>
            Discover real pain points from social media and automatically generate digital products to solve them
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="search-query">Topic or Industry</Label>
              <Input
                id="search-query"
                placeholder="e.g., digital marketing, productivity, fitness, personal finance"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="target-audience">Target Audience (Optional)</Label>
              <Input
                id="target-audience"
                placeholder="e.g., small business owners, busy professionals, students"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Social Media Platforms to Search</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {platforms.map((platform) => (
                  <div key={platform.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={platform.id}
                      checked={selectedPlatforms.includes(platform.id)}
                      onCheckedChange={() => handlePlatformToggle(platform.id)}
                    />
                    <Label htmlFor={platform.id} className="text-sm flex items-center gap-1">
                      <span>{platform.icon}</span>
                      {platform.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Button 
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              {isSearching ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Discovering Pain Points...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Discover Pain Points & Generate Products
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {analysis && (
        <Tabs defaultValue="pain-points" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pain-points">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Pain Points ({analysis.painPoints.length})
            </TabsTrigger>
            <TabsTrigger value="products">
              <Lightbulb className="w-4 h-4 mr-2" />
              Product Ideas ({analysis.productSuggestions.length})
            </TabsTrigger>
            <TabsTrigger value="insights">
              <BarChart3 className="w-4 h-4 mr-2" />
              Market Insights
            </TabsTrigger>
            <TabsTrigger value="action-plan">
              <CheckCircle className="w-4 h-4 mr-2" />
              Action Plan
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pain-points" className="space-y-4">
            <div className="grid gap-4">
              {analysis.painPoints.map((painPoint) => (
                <Card key={painPoint.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{painPoint.title}</h3>
                        <p className="text-gray-600 mb-3">{painPoint.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="outline" className="text-xs">
                            <MapPin className="w-3 h-3 mr-1" />
                            {painPoint.platform}
                          </Badge>
                          <Badge className={`text-xs ${getUrgencyColor(painPoint.urgency)}`}>
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            {painPoint.urgency} Urgency
                          </Badge>
                          <Badge className={`text-xs ${getPotentialColor(painPoint.monetizationPotential)}`}>
                            <DollarSign className="w-3 h-3 mr-1" />
                            {painPoint.monetizationPotential} Potential
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <Users className="w-3 h-3 mr-1" />
                            {painPoint.marketSize} Market
                          </Badge>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">Target Audience:</span>
                            <span className="ml-2 text-gray-600">{painPoint.audience}</span>
                          </div>
                          <div>
                            <span className="font-medium">Keywords:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {painPoint.keywords.map((keyword, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {keyword}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          {painPoint.suggestedSolutions.length > 0 && (
                            <div>
                              <span className="font-medium">Suggested Solutions:</span>
                              <ul className="list-disc list-inside mt-1 text-gray-600">
                                {painPoint.suggestedSolutions.slice(0, 3).map((solution, index) => (
                                  <li key={index} className="text-xs">{solution}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => handleGenerateFromPainPoint(painPoint)}
                        className="ml-4 bg-indigo-600 hover:bg-indigo-700"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Product
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <div className="grid gap-4">
              {analysis.productSuggestions.map((product) => (
                <Card key={product.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{product.title}</h3>
                        <p className="text-gray-600 mb-3">{product.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="outline" className="text-xs">
                            {product.productType}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <DollarSign className="w-3 h-3 mr-1" />
                            {product.priceRange}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            {product.timeToMarket}
                          </Badge>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">Target Audience:</span>
                            <span className="ml-2 text-gray-600">{product.targetAudience}</span>
                          </div>
                          <div>
                            <span className="font-medium">Pain Points Addressed:</span>
                            <ul className="list-disc list-inside mt-1 text-gray-600">
                              {product.painPointsAddressed.map((point, index) => (
                                <li key={index} className="text-xs">{point}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <span className="font-medium">Marketing Strategy:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {product.marketingStrategy.slice(0, 4).map((strategy, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {strategy}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="font-medium">Competitive Advantage:</span>
                            <span className="ml-2 text-gray-600">{product.competitiveAdvantage}</span>
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => {
                          // Convert product suggestion to generation request
                          const request: ProductGenerationRequest = {
                            productType: product.productType,
                            niche: product.title,
                            targetAudience: product.targetAudience,
                            tone: 'Professional',
                            length: 'Medium (15-25 pages)',
                            additionalRequirements: `Address these pain points: ${product.painPointsAddressed.join(', ')}. Competitive advantage: ${product.competitiveAdvantage}`,
                            selectedModels: ['kimi', 'gemma', 'qwen3']
                          }
                          onGenerateProduct(request)
                        }}
                        className="ml-4 bg-indigo-600 hover:bg-indigo-700"
                      >
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Create This Product
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Market Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Market Size:</span>
                    <span className="font-medium">{analysis.marketInsights.totalMarketSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Growth Trend:</span>
                    <Badge className={analysis.marketInsights.growthTrend === 'Growing' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {analysis.marketInsights.growthTrend}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Key Opportunities</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.marketInsights.keyOpportunities.map((opportunity, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Zap className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {opportunity}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Potential Threats</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.marketInsights.threats.map((threat, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                        {threat}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="action-plan" className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="w-5 h-5 text-red-500" />
                    Immediate Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.actionPlan.immediateActions.map((action, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="w-5 h-5 text-orange-500" />
                    Short Term (1-3 months)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.actionPlan.shortTerm.map((action, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-500" />
                    Long Term (3+ months)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.actionPlan.longTerm.map((action, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}