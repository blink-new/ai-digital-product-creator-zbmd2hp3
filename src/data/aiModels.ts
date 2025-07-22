import { AIModel } from '../types/product'

export const aiModels: AIModel[] = [
  // OpenRouter FREE Models (Updated with correct endpoints)
  {
    id: 'moonshotai/kimi-dev-72b:free',
    name: 'MoonshotAI Kimi Dev 72B',
    provider: 'Moonshot',
    specialization: 'Long-form Structured Thinking',
    description: 'Excels at creating detailed outlines, comprehensive content structures, and strategic planning',
    isActive: true
  },
  {
    id: 'tngtech/deepseek-r1t2-chimera:free',
    name: 'DeepSeek R1T2 Chimera',
    provider: 'TNGTech',
    specialization: 'Technical & Logic Content',
    description: 'Perfect for code-heavy content, technical documentation, and logical frameworks',
    isActive: true
  },
  {
    id: 'mistralai/mistral-small-3.2-24b-instruct:free',
    name: 'Mistral Small 3.2 24B',
    provider: 'Mistral',
    specialization: 'Instruction Following',
    description: 'Excellent at following detailed instructions and creating structured content',
    isActive: true
  },
  {
    id: 'google/gemma-3n-e4b-it:free',
    name: 'Google Gemma 3N E4B',
    provider: 'Google',
    specialization: 'Human-like Phrasing',
    description: 'Creates natural, conversational content that feels authentically human',
    isActive: true
  },
  {
    id: 'qwen/qwen3-235b-a22b:free',
    name: 'Qwen3 235B A22B',
    provider: 'Alibaba',
    specialization: 'User-friendly Content',
    description: 'Specializes in accessible, easy-to-understand content for broad audiences',
    isActive: true
  },
  {
    id: 'microsoft/mai-ds-r1:free',
    name: 'Microsoft MAI DS R1',
    provider: 'Microsoft',
    specialization: 'Business Strategy',
    description: 'Expert in pricing strategies, market analysis, and revenue optimization',
    isActive: true
  },
  {
    id: 'nvidia/llama-3.1-nemotron-ultra-253b-v1:free',
    name: 'NVIDIA Nemotron Ultra 253B',
    provider: 'NVIDIA',
    specialization: 'Document Enhancement',
    description: 'Advanced document formatting, styling, and professional presentation',
    isActive: true
  },
  {
    id: 'moonshotai/kimi-vl-a3b-thinking:free',
    name: 'MoonshotAI Kimi VL A3B Thinking',
    provider: 'Moonshot',
    specialization: 'Visual & Analytical Thinking',
    description: 'Advanced reasoning and analytical content generation',
    isActive: true
  },
  {
    id: 'agentica-org/deepcoder-14b-preview:free',
    name: 'DeepCoder 14B Preview',
    provider: 'Agentica',
    specialization: 'Code & Template Logic',
    description: 'Specialized in file logic, template management, and structured data',
    isActive: true
  },
  {
    id: 'arliai/qwq-32b-arliai-rpr-v1:free',
    name: 'ArliAI QwQ 32B RPR V1',
    provider: 'ArliAI',
    specialization: 'Business Model & Strategy',
    description: 'Expert in business model development and strategic planning',
    isActive: true
  }
]