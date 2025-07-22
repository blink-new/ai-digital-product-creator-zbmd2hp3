import { blink } from '../blink/client'
import { GeneratedContent } from './aiService'

export interface SavedProduct {
  id: string
  userId: string
  title: string
  productType: string
  niche: string
  targetAudience: string
  tone: string
  requirements: string
  aiModel: string
  content: string
  tableOfContents: string
  monetizationSuggestions: string
  marketingChannels: string
  priceRange: string
  exportFormats: string
  createdAt: string
  updatedAt: string
}

export class ProductLibraryService {
  static async saveProduct(content: GeneratedContent, metadata: {
    productType: string
    niche: string
    targetAudience: string
    tone: string
    requirements: string
    aiModel: string
  }): Promise<string> {
    try {
      const user = await blink.auth.me()
      const productId = `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      await blink.db.generatedProducts.create({
        id: productId,
        userId: user.id,
        title: content.title,
        productType: metadata.productType,
        niche: metadata.niche,
        targetAudience: metadata.targetAudience,
        tone: metadata.tone,
        requirements: metadata.requirements,
        aiModel: metadata.aiModel,
        content: content.content,
        tableOfContents: JSON.stringify(content.tableOfContents),
        monetizationSuggestions: JSON.stringify(content.monetizationSuggestions),
        marketingChannels: JSON.stringify(content.marketingChannels),
        priceRange: content.priceRange,
        exportFormats: JSON.stringify([]),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })

      return productId
    } catch (error) {
      console.error('Failed to save product:', error)
      throw new Error('Failed to save product to library')
    }
  }

  static async getProducts(filters?: {
    productType?: string
    niche?: string
    searchQuery?: string
  }): Promise<SavedProduct[]> {
    try {
      const user = await blink.auth.me()
      
      const whereClause: any = { userId: user.id }

      if (filters?.productType) {
        whereClause.productType = filters.productType
      }

      if (filters?.niche) {
        whereClause.niche = filters.niche
      }

      const products = await blink.db.generatedProducts.list({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        limit: 100
      })

      // Filter by search query if provided
      let filteredProducts = products
      if (filters?.searchQuery) {
        const query = filters.searchQuery.toLowerCase()
        filteredProducts = products.filter(product => 
          product.title.toLowerCase().includes(query) ||
          product.niche.toLowerCase().includes(query) ||
          product.targetAudience.toLowerCase().includes(query)
        )
      }

      return filteredProducts.map(product => ({
        ...product,
        tableOfContents: this.parseJsonField(product.tableOfContents),
        monetizationSuggestions: this.parseJsonField(product.monetizationSuggestions),
        marketingChannels: this.parseJsonField(product.marketingChannels),
        exportFormats: this.parseJsonField(product.exportFormats)
      }))
    } catch (error) {
      console.error('Failed to get products:', error)
      throw new Error('Failed to load product library')
    }
  }

  static async getProduct(productId: string): Promise<SavedProduct | null> {
    try {
      const user = await blink.auth.me()
      
      const products = await blink.db.generatedProducts.list({
        where: { 
          AND: [
            { id: productId },
            { userId: user.id }
          ]
        },
        limit: 1
      })

      if (products.length === 0) {
        return null
      }

      const product = products[0]
      return {
        ...product,
        tableOfContents: this.parseJsonField(product.tableOfContents),
        monetizationSuggestions: this.parseJsonField(product.monetizationSuggestions),
        marketingChannels: this.parseJsonField(product.marketingChannels),
        exportFormats: this.parseJsonField(product.exportFormats)
      }
    } catch (error) {
      console.error('Failed to get product:', error)
      return null
    }
  }

  static async updateProduct(productId: string, updates: Partial<SavedProduct>): Promise<void> {
    try {
      const user = await blink.auth.me()
      
      // Verify ownership
      const product = await this.getProduct(productId)
      if (!product || product.userId !== user.id) {
        throw new Error('Product not found or access denied')
      }

      const updateData: any = {
        ...updates,
        updatedAt: new Date().toISOString()
      }

      // Stringify array fields if they exist
      if (updates.tableOfContents) {
        updateData.tableOfContents = JSON.stringify(updates.tableOfContents)
      }
      if (updates.monetizationSuggestions) {
        updateData.monetizationSuggestions = JSON.stringify(updates.monetizationSuggestions)
      }
      if (updates.marketingChannels) {
        updateData.marketingChannels = JSON.stringify(updates.marketingChannels)
      }
      if (updates.exportFormats) {
        updateData.exportFormats = JSON.stringify(updates.exportFormats)
      }

      await blink.db.generatedProducts.update(productId, updateData)
    } catch (error) {
      console.error('Failed to update product:', error)
      throw new Error('Failed to update product')
    }
  }

  static async deleteProduct(productId: string): Promise<void> {
    try {
      const user = await blink.auth.me()
      
      // Verify ownership
      const product = await this.getProduct(productId)
      if (!product || product.userId !== user.id) {
        throw new Error('Product not found or access denied')
      }

      await blink.db.generatedProducts.delete(productId)
    } catch (error) {
      console.error('Failed to delete product:', error)
      throw new Error('Failed to delete product')
    }
  }

  static async getProductStats(): Promise<{
    totalProducts: number
    productsByType: Record<string, number>
    recentProducts: SavedProduct[]
    totalRevenuePotential: string
  }> {
    try {
      const products = await this.getProducts()
      
      const productsByType = products.reduce((acc, product) => {
        acc[product.productType] = (acc[product.productType] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const recentProducts = products.slice(0, 5)

      // Calculate total revenue potential (rough estimate)
      const totalRevenuePotential = products.reduce((total, product) => {
        const priceMatch = product.priceRange.match(/\$(\d+(?:\.\d{2})?)/g)
        if (priceMatch) {
          const prices = priceMatch.map(p => parseFloat(p.replace('$', '')))
          const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length
          return total + avgPrice
        }
        return total + 25 // Default estimate
      }, 0)

      return {
        totalProducts: products.length,
        productsByType,
        recentProducts,
        totalRevenuePotential: `$${totalRevenuePotential.toFixed(2)}`
      }
    } catch (error) {
      console.error('Failed to get product stats:', error)
      return {
        totalProducts: 0,
        productsByType: {},
        recentProducts: [],
        totalRevenuePotential: '$0.00'
      }
    }
  }

  static convertToGeneratedContent(product: SavedProduct): GeneratedContent {
    return {
      title: product.title,
      subtitle: `A comprehensive guide for ${product.targetAudience}`,
      content: product.content,
      tableOfContents: Array.isArray(product.tableOfContents) ? product.tableOfContents : [],
      monetizationSuggestions: Array.isArray(product.monetizationSuggestions) ? product.monetizationSuggestions : [],
      marketingChannels: Array.isArray(product.marketingChannels) ? product.marketingChannels : [],
      priceRange: product.priceRange,
      coverDesign: {
        title: product.title,
        subtitle: `A comprehensive guide for ${product.targetAudience}`,
        colors: ['#6366F1', '#F59E0B', '#FFFFFF']
      }
    }
  }

  private static parseJsonField(field: string): any {
    try {
      return JSON.parse(field)
    } catch {
      return []
    }
  }
}