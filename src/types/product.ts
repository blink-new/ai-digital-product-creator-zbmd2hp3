export interface ProductType {
  id: string
  name: string
  description: string
  category: string
  icon: string
  estimatedTime: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  monetizationPotential: 'Low' | 'Medium' | 'High' | 'Very High'
}

export interface AIModel {
  id: string
  name: string
  provider: string
  specialization: string
  description: string
  isActive: boolean
}

export interface GeneratedProduct {
  id: string
  title: string
  targetAudience: string
  shortDescription: string
  format: string
  monetizationPotential: string
  filledExampleSections: string[]
  promptEnhancements: string[]
  downloadFormat: 'PDF' | 'Canva' | 'Notion' | 'Google Docs'
  coverTitle: string
  coverSubtitle: string
  tableOfContents: string[]
  marketingChannels: string[]
  suggestedPriceRange: string
  content: string
  createdAt: string
  productType: string
}

export interface ProductGenerationRequest {
  productType: string
  niche: string
  targetAudience: string
  tone: string
  length: string
  additionalRequirements: string
  selectedModels: string[]
}