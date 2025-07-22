import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Switch } from './ui/switch'
import { Badge } from './ui/badge'
import { Bot, Zap } from 'lucide-react'
import { AIModel } from '../types/product'

interface AIModelSelectorProps {
  models: AIModel[]
  selectedModels: string[]
  onModelToggle: (modelId: string) => void
}

export function AIModelSelector({ models, selectedModels, onModelToggle }: AIModelSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Bot className="w-5 h-5 text-indigo-600" />
        <h3 className="text-lg font-semibold">AI Model Selection</h3>
        <Badge variant="outline" className="ml-auto">
          {selectedModels.length} selected
        </Badge>
      </div>
      
      <div className="grid gap-3">
        {models.map((model) => (
          <Card 
            key={model.id} 
            className={`transition-all duration-200 ${
              selectedModels.includes(model.id) 
                ? 'ring-2 ring-indigo-500 bg-indigo-50' 
                : 'hover:shadow-md'
            } ${!model.isActive ? 'opacity-50' : ''}`}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <CardTitle className="text-sm font-medium">{model.name}</CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {model.provider}
                  </Badge>
                </div>
                <Switch
                  checked={selectedModels.includes(model.id)}
                  onCheckedChange={() => onModelToggle(model.id)}
                  disabled={!model.isActive}
                />
              </div>
              <CardDescription className="text-xs font-medium text-indigo-600">
                {model.specialization}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-gray-600">{model.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}