import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Badge } from './components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { ProductTypeCard } from './components/ProductTypeCard'
import { AIModelSelector } from './components/AIModelSelector'
import { EnhancedAIModelSelector } from './components/EnhancedAIModelSelector'
import { UpgradeNotification } from './components/UpgradeNotification'
import { ProductGenerationForm } from './components/ProductGenerationForm'
import { ContentPreview } from './components/ContentPreview'
import { ProductLibrary } from './components/ProductLibrary'
import { SocialMediaGenerator } from './components/SocialMediaGenerator'
import { PainPointDiscovery } from './components/PainPointDiscovery'
import { QuickIdeasHub } from './components/QuickIdeasHub'
import { productTypes, categories } from './data/productTypes'
import { aiModels } from './data/aiModels'
import { ProductType, AIModel, ProductGenerationRequest } from './types/product'
import { AIService, GeneratedContent } from './services/aiService'
import { ProductLibraryService, SavedProduct } from './services/productLibraryService'
import { blink } from './blink/client'
import { 
  Search, 
  Sparkles, 
  Bot, 
  FileText, 
  Download, 
  TrendingUp, 
  Zap,
  Filter,
  Grid3X3,
  List,
  Star,
  Clock,
  DollarSign,
  ArrowLeft,
  Library,
  Wand2,
  BarChart3,
  Share2,
  Lightbulb
} from 'lucide-react'

type AppView = 'productSelection' | 'generation' | 'preview' | 'library' | 'social' | 'painPoints' | 'quickIdeas'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentView, setCurrentView] = useState<AppView>('productSelection')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedProductType, setSelectedProductType] = useState<string | null>(null)
  const [selectedModels, setSelectedModels] = useState<string[]>(['kimi', 'gemma', 'qwen3'])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null)
  const [generationMetadata, setGenerationMetadata] = useState<any>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedProduct, setSelectedProduct] = useState<SavedProduct | null>(null)
  const [showUpgradeNotification, setShowUpgradeNotification] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  const filteredProducts = productTypes.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleModelToggle = (modelId: string) => {
    setSelectedModels(prev => 
      prev.includes(modelId) 
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
    )
  }

  const handleProductGeneration = async (request: ProductGenerationRequest) => {
    setIsGenerating(true)
    try {
      const selectedModel = selectedModels[0] || 'kimi'
      
      const generationRequest = {
        productType: productTypes.find(p => p.id === selectedProductType)?.name || 'Digital Product',
        niche: request.niche,
        targetAudience: request.targetAudience,
        tone: request.tone,
        requirements: request.requirements,
        aiModel: selectedModel
      }

      const content = await AIService.generateContent(generationRequest)
      
      setGeneratedContent(content)
      setGenerationMetadata(generationRequest)
      setCurrentView('preview')
    } catch (error) {
      console.error('Generation failed:', error)
      alert('Failed to generate content. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleEnhanceContent = async (content: string, type: 'humanize' | 'professional' | 'engaging') => {
    return await AIService.enhanceContent(content, type)
  }

  const handleSaveProduct = async () => {
    if (!generatedContent || !generationMetadata) return

    try {
      const productId = await ProductLibraryService.saveProduct(generatedContent, generationMetadata)
      alert('Product saved to library successfully!')
      setCurrentView('library')
    } catch (error) {
      console.error('Failed to save product:', error)
      alert('Failed to save product. Please try again.')
    }
  }

  const handleViewProduct = (product: SavedProduct) => {
    setSelectedProduct(product)
    const content = ProductLibraryService.convertToGeneratedContent(product)
    setGeneratedContent(content)
    setCurrentView('preview')
  }

  const handleBackToProducts = () => {
    setSelectedProductType(null)
    setGeneratedContent(null)
    setSelectedProduct(null)
    setCurrentView('productSelection')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading AI Product Creator...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <Bot className="w-8 h-8 text-indigo-600" />
            </div>
            <CardTitle className="text-2xl">AI Product Creator</CardTitle>
            <CardDescription>
              Sign in to start generating viral digital products with AI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => blink.auth.login()} 
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              Sign In to Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AI Product Creator</h1>
                <p className="text-sm text-gray-500">40+ Digital Products</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="hidden sm:flex bg-gradient-to-r from-purple-500 to-pink-500 text-white animate-pulse">
                <Zap className="w-3 h-3 mr-1" />
                OpenRouter Powered
              </Badge>
              <Badge variant="outline" className="hidden md:flex bg-blue-50 text-blue-700 border-blue-200">
                8+ Premium Models
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => blink.auth.logout()}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={
          currentView === 'library' ? 'library' : 
          currentView === 'social' ? 'social' : 
          currentView === 'painPoints' ? 'pain-points' :
          currentView === 'quickIdeas' ? 'quick-ideas' :
          'create'
        } onValueChange={(value) => {
          if (value === 'library') {
            setCurrentView('library')
          } else if (value === 'social') {
            setCurrentView('social' as AppView)
          } else if (value === 'pain-points') {
            setCurrentView('painPoints' as AppView)
          } else if (value === 'quick-ideas') {
            setCurrentView('quickIdeas' as AppView)
          } else {
            setCurrentView('productSelection')
          }
        }} className="space-y-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="create">
              <Wand2 className="w-4 h-4 mr-2" />
              Digital Products
            </TabsTrigger>
            <TabsTrigger value="pain-points">
              <Search className="w-4 h-4 mr-2" />
              Pain Points
            </TabsTrigger>
            <TabsTrigger value="quick-ideas">
              <Lightbulb className="w-4 h-4 mr-2" />
              Quick Ideas
            </TabsTrigger>
            <TabsTrigger value="social">
              <Share2 className="w-4 h-4 mr-2" />
              Social Media
            </TabsTrigger>
            <TabsTrigger value="library">
              <Library className="w-4 h-4 mr-2" />
              Library
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-8">
            {currentView === 'productSelection' && (
              <>
                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search product types..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className="text-xs"
                    >
                      {category}
                    </Button>
                  ))}
                </div>

                {/* Product Types Grid */}
                <div className={`grid gap-4 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                    : 'grid-cols-1'
                }`}>
                  {filteredProducts.map((product) => (
                    <ProductTypeCard
                      key={product.id}
                      product={product}
                      onClick={() => {
                        setSelectedProductType(product.id)
                        setCurrentView('generation')
                      }}
                    />
                  ))}
                </div>

                {filteredProducts.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-500">Try adjusting your search or category filter</p>
                  </div>
                )}
              </>
            )}

            {currentView === 'generation' && selectedProductType && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Generate {productTypes.find(p => p.id === selectedProductType)?.name}
                  </h2>
                  <Button
                    variant="outline"
                    onClick={handleBackToProducts}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Products
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Main Form - Takes up 3 columns */}
                  <div className="lg:col-span-3">
                    <ProductGenerationForm
                      selectedProductType={selectedProductType}
                      onGenerate={handleProductGeneration}
                      isGenerating={isGenerating}
                    />
                  </div>

                  {/* Right Sidebar - AI Models & Stats */}
                  <div className="space-y-6">
                    <EnhancedAIModelSelector
                      selectedModels={selectedModels}
                      onModelChange={setSelectedModels}
                      maxSelections={3}
                    />
                    
                    {/* Quick Stats */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Generation Stats</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Estimated Time:</span>
                          <span className="font-medium">2-5 minutes</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">AI Models:</span>
                          <span className="font-medium">{selectedModels.length} selected</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Output Format:</span>
                          <span className="font-medium">Professional PDF</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Features:</span>
                          <span className="font-medium">AI Enhanced</span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Product Type Info */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Product Info</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {(() => {
                          const product = productTypes.find(p => p.id === selectedProductType)
                          return product ? (
                            <>
                              <div className="text-center mb-3">
                                <div className="text-2xl mb-1">{product.icon}</div>
                                <div className="font-medium text-sm">{product.name}</div>
                              </div>
                              <div className="space-y-2 text-xs">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Category:</span>
                                  <span className="font-medium">{product.category}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Difficulty:</span>
                                  <Badge variant="outline" className="text-xs">{product.difficulty}</Badge>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Time:</span>
                                  <span className="font-medium">{product.estimatedTime}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Potential:</span>
                                  <Badge variant="outline" className="text-xs">{product.monetizationPotential}</Badge>
                                </div>
                              </div>
                            </>
                          ) : null
                        })()}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}

            {currentView === 'preview' && generatedContent && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Generated Product</h2>
                  <Button
                    variant="outline"
                    onClick={handleBackToProducts}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Create Another
                  </Button>
                </div>
                
                <ContentPreview
                  content={generatedContent}
                  onEnhance={handleEnhanceContent}
                  onSave={selectedProduct ? undefined : handleSaveProduct}
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="pain-points">
            <PainPointDiscovery onGenerateProduct={(request) => {
              setSelectedProductType(request.productType)
              setCurrentView('generation')
              // Auto-fill the form with the request data
              setTimeout(() => {
                handleProductGeneration(request)
              }, 100)
            }} />
          </TabsContent>

          <TabsContent value="quick-ideas">
            <QuickIdeasHub onSelectIdea={(request) => {
              setSelectedProductType(request.productType)
              setCurrentView('generation')
              // Auto-fill the form with the request data
              setTimeout(() => {
                handleProductGeneration(request)
              }, 100)
            }} />
          </TabsContent>

          <TabsContent value="social">
            <SocialMediaGenerator />
          </TabsContent>

          <TabsContent value="library">
            <ProductLibrary onViewProduct={handleViewProduct} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Upgrade Notification */}
      {showUpgradeNotification && (
        <UpgradeNotification onClose={() => setShowUpgradeNotification(false)} />
      )}
    </div>
  )
}

export default App