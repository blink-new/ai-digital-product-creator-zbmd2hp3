import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { 
  Zap, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Search,
  Filter,
  Star,
  Sparkles,
  ArrowRight,
  Target,
  BarChart3,
  Lightbulb,
  Shuffle
} from 'lucide-react'
import { QuickIdeasService, QuickIdea } from '../services/quickIdeasService'
import { ProductGenerationRequest } from '../types/product'
import { categories } from '../data/productTypes'

interface QuickIdeasHubProps {
  onSelectIdea: (request: ProductGenerationRequest) => void
}

export function QuickIdeasHub({ onSelectIdea }: QuickIdeasHubProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')
  const [selectedMonetization, setSelectedMonetization] = useState('All')
  const [sortBy, setSortBy] = useState<'trending' | 'popularity' | 'difficulty' | 'monetization'>('trending')

  const allIdeas = QuickIdeasService.getAllQuickIdeas()
  const trendingIdeas = QuickIdeasService.getTrendingQuickIdeas(8)
  const randomIdeas = QuickIdeasService.getRandomQuickIdeas(6)

  const filteredIdeas = useMemo(() => {
    let ideas = allIdeas

    // Apply search filter
    if (searchQuery.trim()) {
      ideas = QuickIdeasService.searchQuickIdeas(searchQuery)
    }

    // Apply category filter
    if (selectedCategory !== 'All') {
      ideas = ideas.filter(idea => idea.category === selectedCategory)
    }

    // Apply difficulty filter
    if (selectedDifficulty !== 'All') {
      ideas = ideas.filter(idea => idea.difficulty === selectedDifficulty)
    }

    // Apply monetization filter
    if (selectedMonetization !== 'All') {
      ideas = ideas.filter(idea => idea.monetizationPotential === selectedMonetization)
    }

    // Apply sorting
    switch (sortBy) {
      case 'trending':
        return ideas.sort((a, b) => b.trendingScore - a.trendingScore)
      case 'popularity':
        return ideas.sort((a, b) => a.popularityRank - b.popularityRank)
      case 'difficulty': {
        const difficultyOrder = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3 }
        return ideas.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty])
      }
      case 'monetization': {
        const monetizationOrder = { 'Very High': 4, 'High': 3, 'Medium': 2, 'Low': 1 }
        return ideas.sort((a, b) => monetizationOrder[b.monetizationPotential] - monetizationOrder[a.monetizationPotential])
      }
      default:
        return ideas
    }
  }, [searchQuery, selectedCategory, selectedDifficulty, selectedMonetization, sortBy, allIdeas])

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
      case 'Very High': return 'bg-emerald-100 text-emerald-800'
      case 'High': return 'bg-green-100 text-green-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Low': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTrendingColor = (score: number) => {
    if (score >= 90) return 'bg-red-100 text-red-800'
    if (score >= 80) return 'bg-orange-100 text-orange-800'
    if (score >= 70) return 'bg-yellow-100 text-yellow-800'
    return 'bg-gray-100 text-gray-800'
  }

  const handleSelectIdea = (idea: QuickIdea) => {
    onSelectIdea(idea.formData)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('All')
    setSelectedDifficulty('All')
    setSelectedMonetization('All')
    setSortBy('trending')
  }

  const QuickIdeaCard = ({ idea }: { idea: QuickIdea }) => (
    <Card className="hover:shadow-lg transition-all duration-200 group cursor-pointer" onClick={() => handleSelectIdea(idea)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{idea.icon}</div>
            <div>
              <h3 className="font-semibold text-lg group-hover:text-indigo-600 transition-colors">
                {idea.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">{idea.description}</p>
            </div>
          </div>
          <Badge className={`text-xs ${getTrendingColor(idea.trendingScore)}`}>
            <TrendingUp className="w-3 h-3 mr-1" />
            {idea.trendingScore}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="text-xs">
            {idea.category}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {idea.productType}
          </Badge>
          <Badge className={`text-xs ${getDifficultyColor(idea.difficulty)}`}>
            {idea.difficulty}
          </Badge>
          <Badge className={`text-xs ${getMonetizationColor(idea.monetizationPotential)}`}>
            <DollarSign className="w-3 h-3 mr-1" />
            {idea.monetizationPotential}
          </Badge>
          <Badge variant="outline" className="text-xs">
            <Clock className="w-3 h-3 mr-1" />
            {idea.estimatedTime}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {idea.tags.slice(0, 4).map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {idea.tags.length > 4 && (
            <Badge variant="secondary" className="text-xs">
              +{idea.tags.length - 4} more
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Target:</span> {idea.formData.targetAudience.slice(0, 50)}...
          </div>
          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 group-hover:bg-indigo-700">
            <ArrowRight className="w-4 h-4 mr-1" />
            Use This Idea
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-indigo-600" />
            Quick Ideas Hub
          </CardTitle>
          <CardDescription>
            Ready-to-use product ideas with pre-filled forms for instant generation
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="trending" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trending">
            <TrendingUp className="w-4 h-4 mr-2" />
            Trending ({trendingIdeas.length})
          </TabsTrigger>
          <TabsTrigger value="browse">
            <Search className="w-4 h-4 mr-2" />
            Browse All ({allIdeas.length})
          </TabsTrigger>
          <TabsTrigger value="random">
            <Shuffle className="w-4 h-4 mr-2" />
            Random Picks
          </TabsTrigger>
          <TabsTrigger value="stats">
            <BarChart3 className="w-4 h-4 mr-2" />
            Statistics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trending" className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">🔥 Trending Product Ideas</h2>
            <p className="text-gray-600">High-demand ideas with proven market potential</p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            {trendingIdeas.map((idea) => (
              <QuickIdeaCard key={idea.id} idea={idea} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="browse" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search ideas..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Difficulty</label>
                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Levels</SelectItem>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Monetization</label>
                  <Select value={selectedMonetization} onValueChange={setSelectedMonetization}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Potential</SelectItem>
                      <SelectItem value="Very High">Very High</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Sort By</label>
                  <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trending">Trending Score</SelectItem>
                      <SelectItem value="popularity">Popularity</SelectItem>
                      <SelectItem value="difficulty">Difficulty</SelectItem>
                      <SelectItem value="monetization">Monetization</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-600">
                  Showing {filteredIdeas.length} of {allIdeas.length} ideas
                </div>
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  <Filter className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="grid gap-4 md:grid-cols-2">
            {filteredIdeas.map((idea) => (
              <QuickIdeaCard key={idea.id} idea={idea} />
            ))}
          </div>

          {filteredIdeas.length === 0 && (
            <div className="text-center py-12">
              <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No ideas found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your filters or search terms</p>
              <Button onClick={clearFilters}>
                Clear All Filters
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="random" className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">🎲 Random Inspiration</h2>
            <p className="text-gray-600">Discover unexpected opportunities</p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {randomIdeas.map((idea) => (
              <QuickIdeaCard key={idea.id} idea={idea} />
            ))}
          </div>

          <div className="text-center">
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 hover:from-purple-600 hover:to-pink-600"
            >
              <Shuffle className="w-4 h-4 mr-2" />
              Get New Random Ideas
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-2">{allIdeas.length}</div>
                <div className="text-sm text-gray-600">Total Ideas</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {allIdeas.filter(idea => idea.trendingScore >= 80).length}
                </div>
                <div className="text-sm text-gray-600">High Trending</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {allIdeas.filter(idea => idea.monetizationPotential === 'Very High').length}
                </div>
                <div className="text-sm text-gray-600">Very High Potential</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {allIdeas.filter(idea => idea.difficulty === 'Beginner').length}
                </div>
                <div className="text-sm text-gray-600">Beginner Friendly</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categories Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categories.slice(1).map((category) => {
                    const count = allIdeas.filter(idea => idea.category === category).length
                    const percentage = Math.round((count / allIdeas.length) * 100)
                    return (
                      <div key={category} className="flex items-center justify-between">
                        <span className="text-sm">{category}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-indigo-600 h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600 w-8">{count}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Trending Ideas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {allIdeas
                    .sort((a, b) => b.trendingScore - a.trendingScore)
                    .slice(0, 5)
                    .map((idea, index) => (
                      <div key={idea.id} className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-xs font-medium text-indigo-600">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{idea.title}</div>
                          <div className="text-xs text-gray-600">{idea.category}</div>
                        </div>
                        <Badge className={`text-xs ${getTrendingColor(idea.trendingScore)}`}>
                          {idea.trendingScore}
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}