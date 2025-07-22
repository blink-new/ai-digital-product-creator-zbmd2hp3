import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { ScrollArea } from './ui/scroll-area'
import { Separator } from './ui/separator'
import { GeneratedContent } from '../services/aiService'
import { PDFService, PDFOptions } from '../services/pdfService'
import { ExportService, ExportOptions } from '../services/exportService'
import { 
  Download, 
  FileText, 
  Eye, 
  Palette, 
  DollarSign, 
  TrendingUp,
  Share2,
  Edit3,
  Sparkles
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface ContentPreviewProps {
  content: GeneratedContent
  onEnhance?: (content: string, type: 'humanize' | 'professional' | 'engaging') => Promise<string>
  onSave?: () => void
}

export function ContentPreview({ content, onEnhance, onSave }: ContentPreviewProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [exportFormat, setExportFormat] = useState<string>('')
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [enhancedContent, setEnhancedContent] = useState<string>(content.content)

  const handleExport = async (format: string) => {
    setIsExporting(true)
    setExportFormat(format)

    try {
      const exportOptions: ExportOptions = {
        format: format as any,
        includeTableOfContents: true,
        includeCover: true,
        includeMonetization: true,
        includeMarketing: true,
        includeMetadata: true,
        template: 'professional'
      }

      const contentToExport = {
        ...content,
        content: enhancedContent
      }

      // Handle special formats that return URLs
      if (format === 'canva') {
        const url = await ExportService.exportToCanva(content)
        window.open(url, '_blank')
        return
      }

      const result = await ExportService.exportContent(contentToExport, exportOptions)
      
      if (typeof result === 'string') {
        // URL result (notion, googledocs)
        const link = document.createElement('a')
        link.href = result
        link.download = ExportService.getExportFilename(contentToExport, format)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        // Blob result (pdf, html, markdown, txt, json)
        const filename = ExportService.getExportFilename(contentToExport, format)
        await ExportService.downloadFile(result, filename)
      }
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed. Please try again.')
    } finally {
      setIsExporting(false)
      setExportFormat('')
    }
  }

  const handleEnhance = async (type: 'humanize' | 'professional' | 'engaging') => {
    if (!onEnhance) return

    setIsEnhancing(true)
    try {
      const enhanced = await onEnhance(enhancedContent, type)
      setEnhancedContent(enhanced)
    } catch (error) {
      console.error('Enhancement failed:', error)
      alert('Content enhancement failed. Please try again.')
    } finally {
      setIsEnhancing(false)
    }
  }

  const exportFormats = ExportService.getAvailableFormats().map(format => ({
    ...format,
    icon: format.id === 'canva' ? Palette : FileText
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{content.title}</h2>
          <p className="text-gray-600 mt-1">{content.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <DollarSign className="w-3 h-3 mr-1" />
            {content.priceRange}
          </Badge>
          {onSave && (
            <Button onClick={onSave} variant="outline">
              Save to Library
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="preview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="preview">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </TabsTrigger>
          <TabsTrigger value="toc">
            <FileText className="w-4 h-4 mr-2" />
            Table of Contents
          </TabsTrigger>
          <TabsTrigger value="monetization">
            <DollarSign className="w-4 h-4 mr-2" />
            Monetization
          </TabsTrigger>
          <TabsTrigger value="marketing">
            <TrendingUp className="w-4 h-4 mr-2" />
            Marketing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Content Preview</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEnhance('humanize')}
                    disabled={isEnhancing}
                  >
                    <Sparkles className="w-4 h-4 mr-1" />
                    Humanize
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEnhance('professional')}
                    disabled={isEnhancing}
                  >
                    <Edit3 className="w-4 h-4 mr-1" />
                    Professional
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEnhance('engaging')}
                    disabled={isEnhancing}
                  >
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Engaging
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96 w-full rounded-md border p-4">
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown>{enhancedContent}</ReactMarkdown>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="toc">
          <Card>
            <CardHeader>
              <CardTitle>Table of Contents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {content.tableOfContents.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                    <span className="text-sm font-medium text-gray-500 w-8">
                      {index + 1}.
                    </span>
                    <span className="text-sm text-gray-900">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monetization">
          <Card>
            <CardHeader>
              <CardTitle>Monetization Strategies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {content.monetizationSuggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                    <DollarSign className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-900">{suggestion}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketing">
          <Card>
            <CardHeader>
              <CardTitle>Marketing Channels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {content.marketingChannels.map((channel, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                    <Share2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-900">{channel}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Separator />

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Export Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {exportFormats.map((format) => {
              const Icon = format.icon
              const isCurrentlyExporting = isExporting && exportFormat === format.id

              return (
                <Button
                  key={format.id}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => handleExport(format.id)}
                  disabled={isExporting}
                >
                  {isCurrentlyExporting ? (
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                  <div className="text-center">
                    <div className="font-medium">{format.name}</div>
                    <div className="text-xs text-gray-500">{format.description}</div>
                  </div>
                </Button>
              )
            })}
          </div>
          
          {isExporting && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
                <span className="text-sm text-blue-800">
                  Generating {exportFormat.toUpperCase()} export...
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}