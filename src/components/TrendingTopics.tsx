import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { 
  Search, 
  TrendingUp, 
  Globe, 
  Lightbulb, 
  Image, 
  Sparkles,
  ExternalLink,
  Clock,
  Target,
  DollarSign,
  Loader2
} from 'lucide-react'
import { TrendingService, TrendingTopic, SearchResult } from '../services/trendingService'

interface TrendingTopicsProps {
  onTopicSelect: (topic: TrendingTopic) => void
  onImagePromptSelect: (prompt: string) => void
}

export function TrendingTopics({ onTopicSelect, onImagePromptSelect }: TrendingTopicsProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([])
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [relatedQueries, setRelatedQueries] = useState<string[]>([])
  const [imagePrompts, setImagePrompts] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  const categories = ['All', 'Business', 'Technology', 'Health', 'Finance', 'Lifestyle', 'Education']

  const handleSearch = useCallback(async (query?: string) => {
    const searchTerm = query || searchQuery
    if (!searchTerm.trim()) return

    setIsSearching(true)
    try {
      const response = await TrendingService.searchTrendingTopics(searchTerm, selectedCategory)
      setTrendingTopics(response.topics)
      setSearchResults(response.searchResults)
      setRelatedQueries(response.relatedQueries)
      setImagePrompts(response.imagePrompts)
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setIsSearching(false)
    }
  }, [searchQuery, selectedCategory])

  useEffect(() => {
    // Load default trending topics on mount
    handleSearch('trending digital products 2024')
  }, [handleSearch])

  const filteredTopics = selectedCategory === 'All' 
    ? trendingTopics 
    : trendingTopics.filter(topic => topic.category === selectedCategory)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Low': return 'bg-green-100 text-green-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'High': return 'bg-red-100 text-red-800'
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
    <div className="space-y-6">
      {/* Search Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            Trending Topics & Web Search
          </CardTitle>
          <CardDescription>
            Discover trending topics and niches with real-time web search
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Input */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search for trending topics, niches, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button 
              onClick={() => handleSearch()}
              disabled={isSearching}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {isSearching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </Button>
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

          {/* Related Queries */}
          {relatedQueries.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Related Searches:</h4>
              <div className="flex flex-wrap gap-2">
                {relatedQueries.slice(0, 5).map((query, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery(query)
                      handleSearch(query)
                    }}
                    className="text-xs h-7"
                  >
                    {query}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Tabs */}
      <Tabs defaultValue="topics" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="topics">
            <Target className="w-4 h-4 mr-2" />
            Trending Topics
          </TabsTrigger>
          <TabsTrigger value="search">
            <Globe className="w-4 h-4 mr-2" />
            Web Results
          </TabsTrigger>
          <TabsTrigger value="images">
            <Image className="w-4 h-4 mr-2" />
            Image Prompts
          </TabsTrigger>
        </TabsList>

        {/* Trending Topics */}
        <TabsContent value="topics" className="space-y-4">
          {filteredTopics.length === 0 && !isSearching ? (
            <Card>
              <CardContent className="text-center py-8">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No trending topics found</h3>
                <p className="text-gray-500">Try searching for different keywords or categories</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredTopics.map((topic) => (
                <Card key={topic.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold mb-1">{topic.title}</CardTitle>
                        <CardDescription className="text-sm">{topic.description}</CardDescription>
                      </div>
                      <Badge variant="outline" className="ml-2">{topic.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center">
                        <div className="font-medium text-gray-900">{topic.searchVolume}</div>
                        <div className="text-gray-500">Search Volume</div>
                      </div>
                      <div className="text-center">
                        <Badge className={getDifficultyColor(topic.difficulty)} size="sm">
                          {topic.difficulty}
                        </Badge>
                        <div className="text-gray-500 mt-1">Difficulty</div>
                      </div>
                      <div className="text-center">
                        <Badge className={getMonetizationColor(topic.monetizationPotential)} size="sm">
                          <DollarSign className="w-3 h-3 mr-1" />
                          {topic.monetizationPotential}
                        </Badge>
                      </div>
                    </div>

                    {/* Keywords */}
                    <div className="space-y-2">
                      <h5 className="text-xs font-medium text-gray-700">Keywords:</h5>
                      <div className="flex flex-wrap gap-1">
                        {topic.keywords.slice(0, 4).map((keyword, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Related Topics */}
                    <div className="space-y-2">
                      <h5 className="text-xs font-medium text-gray-700">Related:</h5>
                      <div className="text-xs text-gray-600">
                        {topic.relatedTopics.slice(0, 3).join(' • ')}
                      </div>
                    </div>

                    <Button
                      onClick={() => onTopicSelect(topic)}
                      className="w-full bg-indigo-600 hover:bg-indigo-700"
                      size="sm"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Use This Topic
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Web Search Results */}
        <TabsContent value="search" className="space-y-4">
          {searchResults.length === 0 && !isSearching ? (
            <Card>
              <CardContent className="text-center py-8">
                <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No search results</h3>
                <p className="text-gray-500">Search for topics to see web results</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {searchResults.map((result, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1 line-clamp-2">
                          {result.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {result.snippet}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{result.source}</span>
                          {result.date && (
                            <>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{result.date}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(result.url, '_blank')}
                        className="ml-3"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Image Prompts */}
        <TabsContent value="images" className="space-y-4">
          {imagePrompts.length === 0 && !isSearching ? (
            <Card>
              <CardContent className="text-center py-8">
                <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No image prompts</h3>
                <p className="text-gray-500">Search for topics to get AI image suggestions</p>
              </CardContent>
            </Card>
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
                          onClick={() => onImagePromptSelect(prompt)}
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
        </TabsContent>
      </Tabs>
    </div>
  )
}