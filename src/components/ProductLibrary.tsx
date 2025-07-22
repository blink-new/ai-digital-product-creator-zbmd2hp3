import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { ProductLibraryService, SavedProduct } from '../services/productLibraryService'
import { 
  Search, 
  Filter, 
  FileText, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  Eye,
  Download,
  Trash2,
  BarChart3,
  Package
} from 'lucide-react'

interface ProductLibraryProps {
  onViewProduct?: (product: SavedProduct) => void
}

export function ProductLibrary({ onViewProduct }: ProductLibraryProps) {
  const [products, setProducts] = useState<SavedProduct[]>([])
  const [filteredProducts, setFilteredProducts] = useState<SavedProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedNiche, setSelectedNiche] = useState<string>('all')
  const [stats, setStats] = useState({
    totalProducts: 0,
    productsByType: {} as Record<string, number>,
    recentProducts: [] as SavedProduct[],
    totalRevenuePotential: '$0.00'
  })

  const loadProducts = async () => {
    try {
      setLoading(true)
      const loadedProducts = await ProductLibraryService.getProducts()
      setProducts(loadedProducts)
    } catch (error) {
      console.error('Failed to load products:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const productStats = await ProductLibraryService.getProductStats()
      setStats(productStats)
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }

  const filterProducts = useCallback(() => {
    let filtered = products

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(query) ||
        product.niche.toLowerCase().includes(query) ||
        product.targetAudience.toLowerCase().includes(query)
      )
    }

    // Filter by product type
    if (selectedType !== 'all') {
      filtered = filtered.filter(product => product.productType === selectedType)
    }

    // Filter by niche
    if (selectedNiche !== 'all') {
      filtered = filtered.filter(product => product.niche === selectedNiche)
    }

    setFilteredProducts(filtered)
  }, [products, searchQuery, selectedType, selectedNiche])

  useEffect(() => {
    loadProducts()
    loadStats()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [products, searchQuery, selectedType, selectedNiche, filterProducts])

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      await ProductLibraryService.deleteProduct(productId)
      await loadProducts()
      await loadStats()
    } catch (error) {
      console.error('Failed to delete product:', error)
      alert('Failed to delete product. Please try again.')
    }
  }

  const getUniqueValues = (key: keyof SavedProduct) => {
    const values = products.map(product => product[key] as string)
    return [...new Set(values)].filter(Boolean)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your product library...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-indigo-600" />
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Revenue Potential</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalRevenuePotential}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Most Popular Type</p>
                <p className="text-lg font-bold text-gray-900">
                  {Object.entries(stats.productsByType).length > 0
                    ? Object.entries(stats.productsByType).sort(([,a], [,b]) => b - a)[0][0]
                    : 'None'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-amber-600" />
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {products.filter(p => {
                    const productDate = new Date(p.createdAt)
                    const now = new Date()
                    return productDate.getMonth() === now.getMonth() && 
                           productDate.getFullYear() === now.getFullYear()
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="library" className="w-full">
        <TabsList>
          <TabsTrigger value="library">
            <FileText className="w-4 h-4 mr-2" />
            Product Library
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="library" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Product Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {getUniqueValues('productType').map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedNiche} onValueChange={setSelectedNiche}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Niche" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Niches</SelectItem>
                    {getUniqueValues('niche').map(niche => (
                      <SelectItem key={niche} value={niche}>{niche}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600">
                  {products.length === 0 
                    ? "You haven't created any products yet. Start generating your first digital product!"
                    : "No products match your current filters. Try adjusting your search criteria."
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-2">{product.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary">{product.productType}</Badge>
                          <Badge variant="outline">{product.niche}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="text-sm text-gray-600">
                      <p><strong>Target:</strong> {product.targetAudience}</p>
                      <p><strong>Tone:</strong> {product.tone}</p>
                      <p><strong>AI Model:</strong> {product.aiModel}</p>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(product.createdAt)}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {product.priceRange}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => onViewProduct?.(product)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Products by Type */}
            <Card>
              <CardHeader>
                <CardTitle>Products by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(stats.productsByType).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{type}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-indigo-600 h-2 rounded-full" 
                            style={{ 
                              width: `${(count / Math.max(...Object.values(stats.productsByType))) * 100}%` 
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium w-8 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Products */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.recentProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <p className="text-sm font-medium line-clamp-1">{product.title}</p>
                        <p className="text-xs text-gray-500">{formatDate(product.createdAt)}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">{product.productType}</Badge>
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