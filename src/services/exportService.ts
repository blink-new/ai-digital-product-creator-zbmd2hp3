import { GeneratedContent } from './aiService'
import { PDFService } from './pdfService'
import { SocialMediaContent, BlogPostContent, MemeContent } from './socialMediaService'

export interface ExportOptions {
  format: 'pdf' | 'docx' | 'html' | 'markdown' | 'txt' | 'json' | 'canva' | 'notion' | 'googledocs'
  includeTableOfContents: boolean
  includeCover: boolean
  includeMonetization: boolean
  includeMarketing: boolean
  includeMetadata: boolean
  customBranding?: {
    logo?: string
    colors?: string[]
    fonts?: string[]
    companyName?: string
    website?: string
  }
  template?: 'professional' | 'modern' | 'minimal' | 'creative'
}

export type ExportableContent = GeneratedContent | SocialMediaContent | BlogPostContent | MemeContent

export class ExportService {
  static async exportContent(
    content: ExportableContent, 
    options: ExportOptions
  ): Promise<Blob | string> {
    switch (options.format) {
      case 'pdf':
        return await this.exportToPDF(content, options)
      case 'html':
        return await this.exportToHTML(content, options)
      case 'markdown':
        return await this.exportToMarkdown(content, options)
      case 'txt':
        return await this.exportToText(content, options)
      case 'json':
        return await this.exportToJSON(content, options)
      case 'canva':
        return this.exportToCanva(content as GeneratedContent)
      case 'notion':
        return await this.exportToNotion(content as GeneratedContent)
      case 'googledocs':
        return await this.exportToGoogleDocs(content as GeneratedContent)
      default:
        throw new Error(`Unsupported export format: ${options.format}`)
    }
  }

  private static async exportToPDF(
    content: ExportableContent, 
    options: ExportOptions
  ): Promise<Blob> {
    // Convert social media content to GeneratedContent format for PDF
    const pdfContent = this.normalizeContentForPDF(content)
    
    const pdfOptions = {
      format: 'A4' as const,
      orientation: 'portrait' as const,
      includeTableOfContents: options.includeTableOfContents,
      includeCover: options.includeCover,
      fontFamily: 'helvetica' as const,
      fontSize: 12,
      lineHeight: 1.5,
      margins: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
      }
    }

    return await PDFService.generatePDF(pdfContent, pdfOptions)
  }

  private static async exportToHTML(
    content: ExportableContent, 
    options: ExportOptions
  ): Promise<Blob> {
    const template = options.template || 'professional'
    const styles = this.getHTMLStyles(template, options.customBranding)
    
    let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${content.title}</title>
    <style>${styles}</style>
</head>
<body>`

    // Cover page
    if (options.includeCover) {
      html += this.generateHTMLCover(content, options)
    }

    // Table of contents (for digital products)
    if (options.includeTableOfContents && 'tableOfContents' in content && content.tableOfContents?.length > 0) {
      html += `
    <div class="toc">
        <h2>Table of Contents</h2>
        <ul>
            ${content.tableOfContents.map((item, index) => `<li><span class="toc-number">${index + 1}.</span> ${item}</li>`).join('')}
        </ul>
    </div>`
    }

    // Main content
    html += `
    <div class="content">
        ${this.formatContentForHTML(content.content)}
    </div>`

    // Additional sections based on content type
    html += this.generateAdditionalSections(content, options)

    // Metadata
    if (options.includeMetadata) {
      html += this.generateMetadataSection(content)
    }

    // Footer
    if (options.customBranding?.companyName) {
      html += `
    <footer class="footer">
        <p>© ${new Date().getFullYear()} ${options.customBranding.companyName}. All rights reserved.</p>
        ${options.customBranding.website ? `<p>Visit us at: <a href="${options.customBranding.website}">${options.customBranding.website}</a></p>` : ''}
    </footer>`
    }

    html += `
</body>
</html>`

    return new Blob([html], { type: 'text/html' })
  }

  private static async exportToMarkdown(
    content: ExportableContent, 
    options: ExportOptions
  ): Promise<Blob> {
    let markdown = ''

    // Cover
    if (options.includeCover) {
      markdown += `# ${content.title}\n\n`
      if ('subtitle' in content && content.subtitle) {
        markdown += `## ${content.subtitle}\n\n`
      }
      if ('priceRange' in content && content.priceRange) {
        markdown += `**Price Range:** ${content.priceRange}\n\n`
      }
      if ('platform' in content && content.platform) {
        markdown += `**Platform:** ${content.platform}\n\n`
      }
      markdown += `---\n\n`
    }

    // Table of contents
    if (options.includeTableOfContents && 'tableOfContents' in content && content.tableOfContents?.length > 0) {
      markdown += `## Table of Contents\n\n`
      content.tableOfContents.forEach((item, index) => {
        markdown += `${index + 1}. ${item}\n`
      })
      markdown += `\n---\n\n`
    }

    // Main content
    markdown += content.content + '\n\n'

    // Additional sections
    markdown += this.generateMarkdownSections(content, options)

    // Metadata
    if (options.includeMetadata) {
      markdown += this.generateMarkdownMetadata(content)
    }

    return new Blob([markdown], { type: 'text/markdown' })
  }

  private static async exportToText(
    content: ExportableContent, 
    options: ExportOptions
  ): Promise<Blob> {
    let text = ''

    // Cover
    if (options.includeCover) {
      text += `${content.title}\n`
      if ('subtitle' in content && content.subtitle) {
        text += `${content.subtitle}\n`
      }
      if ('priceRange' in content && content.priceRange) {
        text += `\nPrice Range: ${content.priceRange}\n`
      }
      if ('platform' in content && content.platform) {
        text += `Platform: ${content.platform}\n`
      }
      text += `\n${'='.repeat(50)}\n\n`
    }

    // Table of contents
    if (options.includeTableOfContents && 'tableOfContents' in content && content.tableOfContents?.length > 0) {
      text += `TABLE OF CONTENTS\n\n`
      content.tableOfContents.forEach((item, index) => {
        text += `${index + 1}. ${item}\n`
      })
      text += `\n${'='.repeat(50)}\n\n`
    }

    // Main content (strip markdown)
    text += this.stripMarkdown(content.content) + '\n\n'

    // Additional sections
    text += this.generateTextSections(content, options)

    return new Blob([text], { type: 'text/plain' })
  }

  private static async exportToJSON(
    content: ExportableContent, 
    options: ExportOptions
  ): Promise<Blob> {
    const exportData = {
      metadata: {
        exportedAt: new Date().toISOString(),
        format: 'json',
        version: '1.0',
        options: options
      },
      content: content,
      ...(options.customBranding && { branding: options.customBranding })
    }

    return new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
  }

  static async exportToCanva(content: GeneratedContent): Promise<string> {
    // Generate Canva-compatible template URL
    const canvaTemplate = {
      title: content.title,
      subtitle: content.subtitle,
      content: content.content,
      colors: content.coverDesign.colors,
      tableOfContents: content.tableOfContents
    }

    // Create a Canva design URL with pre-filled content
    const canvaUrl = new URL('https://www.canva.com/design')
    canvaUrl.searchParams.set('template', 'ebook')
    canvaUrl.searchParams.set('title', content.title)
    canvaUrl.searchParams.set('colors', content.coverDesign.colors.join(','))
    
    return canvaUrl.toString()
  }

  static async exportToNotion(content: GeneratedContent): Promise<string> {
    // Generate Notion page content in markdown format
    const notionContent = `# ${content.title}

## ${content.subtitle}

---

## Table of Contents

${content.tableOfContents.map((item, index) => `${index + 1}. ${item}`).join('\n')}

---

## Content

${content.content}

---

## Monetization Strategies

${content.monetizationSuggestions.map(item => `• ${item}`).join('\n')}

---

## Marketing Channels

${content.marketingChannels.map(item => `• ${item}`).join('\n')}

---

## Price Range

${content.priceRange}

---

*Generated by AI Digital Product Creator*`

    // Create a data URL for easy import to Notion
    const blob = new Blob([notionContent], { type: 'text/markdown' })
    return URL.createObjectURL(blob)
  }

  static async exportToGoogleDocs(content: GeneratedContent): Promise<string> {
    // Generate Google Docs compatible HTML
    const googleDocsHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${content.title}</title>
    <style>
        body {
            font-family: 'Times New Roman', serif;
            line-height: 1.6;
            max-width: 8.5in;
            margin: 0 auto;
            padding: 1in;
        }
        h1 {
            color: #1a73e8;
            font-size: 24pt;
            text-align: center;
            margin-bottom: 0.5in;
        }
        h2 {
            color: #1a73e8;
            font-size: 18pt;
            margin-top: 0.3in;
            margin-bottom: 0.2in;
        }
        h3 {
            color: #1a73e8;
            font-size: 14pt;
            margin-top: 0.2in;
            margin-bottom: 0.1in;
        }
        .subtitle {
            text-align: center;
            font-style: italic;
            font-size: 14pt;
            margin-bottom: 0.5in;
        }
        .toc {
            border: 1px solid #ddd;
            padding: 0.2in;
            margin: 0.3in 0;
        }
        .toc h2 {
            margin-top: 0;
        }
        .toc ol {
            margin: 0;
            padding-left: 0.3in;
        }
        .section {
            margin: 0.3in 0;
        }
        ul {
            padding-left: 0.3in;
        }
        .price-range {
            background-color: #f8f9fa;
            padding: 0.2in;
            border-left: 4px solid #1a73e8;
            margin: 0.3in 0;
        }
    </style>
</head>
<body>
    <h1>${content.title}</h1>
    <div class="subtitle">${content.subtitle}</div>
    
    <div class="toc">
        <h2>Table of Contents</h2>
        <ol>
            ${content.tableOfContents.map(item => `<li>${item}</li>`).join('')}
        </ol>
    </div>
    
    <div class="section">
        <h2>Content</h2>
        ${this.formatContentForHtml(content.content)}
    </div>
    
    <div class="section">
        <h2>Monetization Strategies</h2>
        <ul>
            ${content.monetizationSuggestions.map(item => `<li>${item}</li>`).join('')}
        </ul>
    </div>
    
    <div class="section">
        <h2>Marketing Channels</h2>
        <ul>
            ${content.marketingChannels.map(item => `<li>${item}</li>`).join('')}
        </ul>
    </div>
    
    <div class="price-range">
        <strong>Suggested Price Range:</strong> ${content.priceRange}
    </div>
</body>
</html>`

    const blob = new Blob([googleDocsHtml], { type: 'text/html' })
    return URL.createObjectURL(blob)
  }

  private static normalizeContentForPDF(content: ExportableContent): GeneratedContent {
    if ('tableOfContents' in content && content.tableOfContents) {
      // Already a GeneratedContent
      return content as GeneratedContent
    }

    // Convert social media content to GeneratedContent format
    return {
      title: content.title,
      subtitle: 'subtitle' in content ? content.subtitle || '' : '',
      content: content.content,
      tableOfContents: [],
      monetizationSuggestions: [],
      marketingChannels: [],
      priceRange: 'priceRange' in content ? content.priceRange || '$19.99 - $97.00' : '$19.99 - $97.00',
      coverDesign: {
        title: content.title,
        subtitle: 'subtitle' in content ? content.subtitle || '' : '',
        colors: ['#6366F1', '#F59E0B', '#FFFFFF']
      }
    }
  }

  private static getHTMLStyles(template: string, branding?: ExportOptions['customBranding']): string {
    const primaryColor = branding?.colors?.[0] || '#6366F1'
    const accentColor = branding?.colors?.[1] || '#F59E0B'
    const fontFamily = branding?.fonts?.[0] || 'Inter, system-ui, sans-serif'

    const baseStyles = `
      * { box-sizing: border-box; }
      body {
        font-family: ${fontFamily};
        line-height: 1.6;
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
        color: #333;
        background: #fff;
      }
      h1, h2, h3, h4, h5, h6 { 
        color: ${primaryColor}; 
        margin-top: 2em; 
        margin-bottom: 0.5em;
      }
      h1 { font-size: 2.5em; }
      h2 { font-size: 2em; }
      h3 { font-size: 1.5em; }
      p { margin: 1em 0; }
      ul, ol { padding-left: 1.5em; }
      li { margin: 0.5em 0; }
      strong { color: ${primaryColor}; }
      a { color: ${accentColor}; text-decoration: none; }
      a:hover { text-decoration: underline; }
      .footer {
        margin-top: 3em;
        padding-top: 2em;
        border-top: 2px solid #eee;
        text-align: center;
        color: #666;
        font-size: 0.9em;
      }
    `

    const templateStyles = {
      professional: `
        .cover {
          text-align: center;
          padding: 60px 0;
          border-bottom: 3px solid ${primaryColor};
          margin-bottom: 40px;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }
        .toc {
          background: #f8fafc;
          padding: 30px;
          border-radius: 12px;
          margin: 30px 0;
          border-left: 4px solid ${primaryColor};
        }
        .toc-number { color: ${primaryColor}; font-weight: bold; }
        .section {
          background: #f0f9ff;
          padding: 25px;
          border-radius: 12px;
          margin: 25px 0;
          border-left: 4px solid ${accentColor};
        }
      `,
      modern: `
        .cover {
          text-align: center;
          padding: 80px 0;
          background: linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%);
          color: white;
          border-radius: 20px;
          margin-bottom: 40px;
        }
        .cover h1, .cover h2 { color: white; }
        .toc {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          padding: 30px;
          border-radius: 20px;
          margin: 30px 0;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        .section {
          background: linear-gradient(135deg, #fefefe 0%, #f8fafc 100%);
          padding: 30px;
          border-radius: 20px;
          margin: 30px 0;
          box-shadow: 0 5px 15px rgba(0,0,0,0.08);
        }
      `,
      minimal: `
        .cover {
          text-align: center;
          padding: 40px 0;
          border-bottom: 1px solid #e5e7eb;
          margin-bottom: 40px;
        }
        .toc {
          border: 1px solid #e5e7eb;
          padding: 20px;
          margin: 20px 0;
        }
        .section {
          border-top: 1px solid #e5e7eb;
          padding: 20px 0;
          margin: 20px 0;
        }
      `,
      creative: `
        .cover {
          text-align: center;
          padding: 60px 0;
          background: radial-gradient(circle at center, ${primaryColor}20 0%, transparent 70%);
          border: 3px dashed ${primaryColor};
          margin-bottom: 40px;
          position: relative;
        }
        .toc {
          background: linear-gradient(45deg, ${primaryColor}10, ${accentColor}10);
          padding: 30px;
          border-radius: 25px;
          margin: 30px 0;
          border: 2px solid ${primaryColor};
          transform: rotate(-1deg);
        }
        .section {
          background: linear-gradient(135deg, ${accentColor}15 0%, ${primaryColor}15 100%);
          padding: 25px;
          border-radius: 15px;
          margin: 25px 0;
          transform: rotate(0.5deg);
          border: 1px solid ${accentColor};
        }
      `
    }

    return baseStyles + (templateStyles[template as keyof typeof templateStyles] || templateStyles.professional)
  }

  private static generateHTMLCover(content: ExportableContent, options: ExportOptions): string {
    let cover = `<div class="cover">`
    
    if (options.customBranding?.logo) {
      cover += `<img src="${options.customBranding.logo}" alt="Logo" style="max-height: 60px; margin-bottom: 20px;">`
    }
    
    cover += `<h1>${content.title}</h1>`
    
    if ('subtitle' in content && content.subtitle) {
      cover += `<h2>${content.subtitle}</h2>`
    }
    
    if ('priceRange' in content && content.priceRange) {
      cover += `<p><strong>Value:</strong> ${content.priceRange}</p>`
    }
    
    if ('platform' in content && content.platform) {
      cover += `<p><strong>Platform:</strong> ${content.platform}</p>`
    }
    
    cover += `<p><em>Generated on ${new Date().toLocaleDateString()}</em></p>`
    cover += `</div>`
    
    return cover
  }

  private static generateAdditionalSections(content: ExportableContent, options: ExportOptions): string {
    let sections = ''

    // Monetization section
    if (options.includeMonetization && 'monetizationSuggestions' in content && content.monetizationSuggestions?.length > 0) {
      sections += `
    <div class="section monetization">
        <h2>💰 Monetization Strategies</h2>
        <ul>
            ${content.monetizationSuggestions.map(item => `<li>${item}</li>`).join('')}
        </ul>
    </div>`
    }

    // Marketing section
    if (options.includeMarketing && 'marketingChannels' in content && content.marketingChannels?.length > 0) {
      sections += `
    <div class="section marketing">
        <h2>📢 Marketing Channels</h2>
        <ul>
            ${content.marketingChannels.map(item => `<li>${item}</li>`).join('')}
        </ul>
    </div>`
    }

    // Social media specific sections
    if ('hashtags' in content && content.hashtags?.length > 0) {
      sections += `
    <div class="section hashtags">
        <h2>#️⃣ Hashtags</h2>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${content.hashtags.map(tag => `<span style="background: #e5e7eb; padding: 4px 8px; border-radius: 12px; font-size: 0.9em;">${tag}</span>`).join('')}
        </div>
    </div>`
    }

    if ('engagementTips' in content && content.engagementTips?.length > 0) {
      sections += `
    <div class="section engagement">
        <h2>🚀 Engagement Tips</h2>
        <ul>
            ${content.engagementTips.map(tip => `<li>${tip}</li>`).join('')}
        </ul>
    </div>`
    }

    if ('bestPostingTimes' in content && content.bestPostingTimes?.length > 0) {
      sections += `
    <div class="section timing">
        <h2>⏰ Best Posting Times</h2>
        <ul>
            ${content.bestPostingTimes.map(time => `<li>${time}</li>`).join('')}
        </ul>
    </div>`
    }

    return sections
  }

  private static generateMetadataSection(content: ExportableContent): string {
    const metadata = []
    
    if ('estimatedReach' in content && content.estimatedReach) {
      metadata.push(`<strong>Estimated Reach:</strong> ${content.estimatedReach}`)
    }
    
    if ('viralPotential' in content && content.viralPotential) {
      metadata.push(`<strong>Viral Potential:</strong> ${content.viralPotential}`)
    }
    
    if ('readingTime' in content && content.readingTime) {
      metadata.push(`<strong>Reading Time:</strong> ${content.readingTime}`)
    }
    
    if ('seoScore' in content && content.seoScore) {
      metadata.push(`<strong>SEO Score:</strong> ${content.seoScore}`)
    }

    metadata.push(`<strong>Generated:</strong> ${new Date().toLocaleString()}`)

    return `
    <div class="section metadata">
        <h2>📊 Metadata</h2>
        <p>${metadata.join('<br>')}</p>
    </div>`
  }

  private static generateMarkdownSections(content: ExportableContent, options: ExportOptions): string {
    let sections = ''

    if (options.includeMonetization && 'monetizationSuggestions' in content && content.monetizationSuggestions?.length > 0) {
      sections += `## 💰 Monetization Strategies\n\n`
      content.monetizationSuggestions.forEach(item => {
        sections += `- ${item}\n`
      })
      sections += '\n'
    }

    if (options.includeMarketing && 'marketingChannels' in content && content.marketingChannels?.length > 0) {
      sections += `## 📢 Marketing Channels\n\n`
      content.marketingChannels.forEach(item => {
        sections += `- ${item}\n`
      })
      sections += '\n'
    }

    if ('hashtags' in content && content.hashtags?.length > 0) {
      sections += `## #️⃣ Hashtags\n\n`
      sections += content.hashtags.join(' ') + '\n\n'
    }

    if ('engagementTips' in content && content.engagementTips?.length > 0) {
      sections += `## 🚀 Engagement Tips\n\n`
      content.engagementTips.forEach(tip => {
        sections += `- ${tip}\n`
      })
      sections += '\n'
    }

    return sections
  }

  private static generateTextSections(content: ExportableContent, options: ExportOptions): string {
    let sections = ''

    if (options.includeMonetization && 'monetizationSuggestions' in content && content.monetizationSuggestions?.length > 0) {
      sections += `MONETIZATION STRATEGIES\n\n`
      content.monetizationSuggestions.forEach((item, index) => {
        sections += `${index + 1}. ${item}\n`
      })
      sections += '\n'
    }

    if (options.includeMarketing && 'marketingChannels' in content && content.marketingChannels?.length > 0) {
      sections += `MARKETING CHANNELS\n\n`
      content.marketingChannels.forEach((item, index) => {
        sections += `${index + 1}. ${item}\n`
      })
      sections += '\n'
    }

    if ('hashtags' in content && content.hashtags?.length > 0) {
      sections += `HASHTAGS\n\n${content.hashtags.join(' ')}\n\n`
    }

    return sections
  }

  private static generateMarkdownMetadata(content: ExportableContent): string {
    let metadata = `## 📊 Metadata\n\n`
    
    if ('estimatedReach' in content && content.estimatedReach) {
      metadata += `**Estimated Reach:** ${content.estimatedReach}\n`
    }
    
    if ('viralPotential' in content && content.viralPotential) {
      metadata += `**Viral Potential:** ${content.viralPotential}\n`
    }
    
    metadata += `**Generated:** ${new Date().toLocaleString()}\n\n`
    
    return metadata
  }

  private static formatContentForHTML(content: string): string {
    return content
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code>$1</code>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(.+)$/gm, '<p>$1</p>')
      .replace(/<p><h/g, '<h')
      .replace(/<\/h([1-6])><\/p>/g, '</h$1>')
      .replace(/<p><\/p>/g, '')
  }

  private static formatContentForHtml(content: string): string {
    return content
      .replace(/\n\n/g, '</p><p>')
      .replace(/^/, '<p>')
      .replace(/$/, '</p>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
  }

  private static stripMarkdown(content: string): string {
    return content
      .replace(/^#+\s*/gm, '')
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/`(.+?)`/g, '$1')
      .replace(/\[(.+?)\]\(.+?\)/g, '$1')
      .replace(/!\[.*?\]\(.+?\)/g, '')
  }

  static getExportFilename(content: ExportableContent, format: string): string {
    const title = content.title
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .toLowerCase()
      .substring(0, 50)
    
    const timestamp = new Date().toISOString().split('T')[0]
    return `${title}-${timestamp}.${format}`
  }

  static async downloadFile(blob: Blob, filename: string): Promise<void> {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  static getAvailableFormats(): Array<{id: string, name: string, description: string}> {
    return [
      { id: 'pdf', name: 'PDF', description: 'Professional PDF document' },
      { id: 'html', name: 'HTML', description: 'Web page format' },
      { id: 'markdown', name: 'Markdown', description: 'Markdown text format' },
      { id: 'txt', name: 'Text', description: 'Plain text format' },
      { id: 'json', name: 'JSON', description: 'Structured data format' },
      { id: 'canva', name: 'Canva', description: 'Open in Canva for design' },
      { id: 'notion', name: 'Notion', description: 'Import to Notion' },
      { id: 'googledocs', name: 'Google Docs', description: 'Import to Google Docs' }
    ]
  }

  static getAvailableTemplates(): Array<{id: string, name: string, description: string}> {
    return [
      { id: 'professional', name: 'Professional', description: 'Clean, business-focused design' },
      { id: 'modern', name: 'Modern', description: 'Contemporary with gradients and shadows' },
      { id: 'minimal', name: 'Minimal', description: 'Simple, clean lines' },
      { id: 'creative', name: 'Creative', description: 'Artistic with unique styling' }
    ]
  }

  static getExportInstructions(format: string): string {
    const instructions = {
      canva: 'Click the link to open Canva with your content pre-filled. You can then customize the design, add images, and download as PDF.',
      notion: 'Download the file and import it into Notion by creating a new page and selecting "Import" from the menu.',
      googledocs: 'Download the HTML file and open it in Google Docs by going to File > Open > Upload and selecting the downloaded file.',
      markdown: 'Download the Markdown file and open it in any Markdown editor or import it into your preferred documentation platform.',
      html: 'Download the HTML file and open it in any web browser. You can also host it on any web server.',
      pdf: 'The PDF will be generated with professional formatting and can be used immediately for distribution or printing.',
      txt: 'Download the plain text file for use in any text editor or word processor.',
      json: 'Download the structured data file for programmatic use or backup purposes.'
    }

    return instructions[format as keyof typeof instructions] || 'Download the file and use it according to your needs.'
  }
}