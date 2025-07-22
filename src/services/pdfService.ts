import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { GeneratedContent } from './aiService'

export interface PDFOptions {
  format: 'A4' | 'Letter' | 'Legal'
  orientation: 'portrait' | 'landscape'
  includeTableOfContents: boolean
  includeCover: boolean
  fontFamily: 'helvetica' | 'times' | 'courier'
  fontSize: number
  lineHeight: number
  margins: {
    top: number
    right: number
    bottom: number
    left: number
  }
}

export class PDFService {
  private static defaultOptions: PDFOptions = {
    format: 'A4',
    orientation: 'portrait',
    includeTableOfContents: true,
    includeCover: true,
    fontFamily: 'helvetica',
    fontSize: 12,
    lineHeight: 1.5,
    margins: {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20
    }
  }

  static async generatePDF(content: GeneratedContent, options: Partial<PDFOptions> = {}): Promise<Blob> {
    const opts = { ...this.defaultOptions, ...options }
    const pdf = new jsPDF({
      orientation: opts.orientation,
      unit: 'mm',
      format: opts.format
    })

    let currentPage = 1
    let yPosition = opts.margins.top

    // Set font
    pdf.setFont(opts.fontFamily)
    pdf.setFontSize(opts.fontSize)

    // Add cover page
    if (opts.includeCover) {
      this.addCoverPage(pdf, content, opts)
      pdf.addPage()
      currentPage++
      yPosition = opts.margins.top
    }

    // Add table of contents
    if (opts.includeTableOfContents && content.tableOfContents.length > 0) {
      yPosition = this.addTableOfContents(pdf, content.tableOfContents, opts, yPosition)
      pdf.addPage()
      currentPage++
      yPosition = opts.margins.top
    }

    // Add main content
    yPosition = this.addContent(pdf, content.content, opts, yPosition)

    // Add monetization suggestions
    if (content.monetizationSuggestions.length > 0) {
      yPosition = this.addSection(pdf, 'Monetization Strategies', content.monetizationSuggestions, opts, yPosition)
    }

    // Add marketing channels
    if (content.marketingChannels.length > 0) {
      yPosition = this.addSection(pdf, 'Marketing Channels', content.marketingChannels, opts, yPosition)
    }

    // Add footer to all pages
    this.addFooters(pdf, content.title)

    return pdf.output('blob')
  }

  private static addCoverPage(pdf: jsPDF, content: GeneratedContent, options: PDFOptions): void {
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()

    // Background color
    pdf.setFillColor(99, 102, 241) // Primary color
    pdf.rect(0, 0, pageWidth, pageHeight, 'F')

    // Title
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(28)
    pdf.setFont(options.fontFamily, 'bold')
    
    const titleLines = pdf.splitTextToSize(content.title, pageWidth - 40)
    const titleHeight = titleLines.length * 10
    const titleY = (pageHeight - titleHeight) / 2 - 20
    
    pdf.text(titleLines, pageWidth / 2, titleY, { align: 'center' })

    // Subtitle
    pdf.setFontSize(16)
    pdf.setFont(options.fontFamily, 'normal')
    
    const subtitleLines = pdf.splitTextToSize(content.subtitle, pageWidth - 40)
    const subtitleY = titleY + titleHeight + 20
    
    pdf.text(subtitleLines, pageWidth / 2, subtitleY, { align: 'center' })

    // Price range
    pdf.setFontSize(14)
    pdf.setTextColor(245, 158, 11) // Accent color
    pdf.text(`Value: ${content.priceRange}`, pageWidth / 2, pageHeight - 40, { align: 'center' })

    // Reset colors
    pdf.setTextColor(0, 0, 0)
  }

  private static addTableOfContents(pdf: jsPDF, toc: string[], options: PDFOptions, startY: number): number {
    let yPosition = startY

    // Title
    pdf.setFontSize(18)
    pdf.setFont(options.fontFamily, 'bold')
    pdf.text('Table of Contents', options.margins.left, yPosition)
    yPosition += 15

    // TOC items
    pdf.setFontSize(options.fontSize)
    pdf.setFont(options.fontFamily, 'normal')

    toc.forEach((item, index) => {
      if (yPosition > pdf.internal.pageSize.getHeight() - options.margins.bottom) {
        pdf.addPage()
        yPosition = options.margins.top
      }

      const pageNumber = index + 3 // Adjust based on cover and TOC pages
      pdf.text(`${index + 1}. ${item}`, options.margins.left, yPosition)
      pdf.text(`${pageNumber}`, pdf.internal.pageSize.getWidth() - options.margins.right, yPosition, { align: 'right' })
      yPosition += options.fontSize * options.lineHeight
    })

    return yPosition
  }

  private static addContent(pdf: jsPDF, content: string, options: PDFOptions, startY: number): number {
    let yPosition = startY
    const pageWidth = pdf.internal.pageSize.getWidth()
    const maxWidth = pageWidth - options.margins.left - options.margins.right

    pdf.setFontSize(options.fontSize)
    pdf.setFont(options.fontFamily, 'normal')

    // Split content into paragraphs
    const paragraphs = content.split('\n\n').filter(p => p.trim())

    paragraphs.forEach(paragraph => {
      // Check if it's a heading (starts with #)
      if (paragraph.startsWith('#')) {
        const level = paragraph.match(/^#+/)?.[0].length || 1
        const text = paragraph.replace(/^#+\s*/, '')
        
        yPosition += 10 // Space before heading
        
        if (yPosition > pdf.internal.pageSize.getHeight() - options.margins.bottom) {
          pdf.addPage()
          yPosition = options.margins.top
        }

        // Set heading style
        const headingSize = Math.max(options.fontSize + (4 - level) * 2, options.fontSize)
        pdf.setFontSize(headingSize)
        pdf.setFont(options.fontFamily, 'bold')
        
        const headingLines = pdf.splitTextToSize(text, maxWidth)
        pdf.text(headingLines, options.margins.left, yPosition)
        yPosition += headingLines.length * headingSize * options.lineHeight + 5

        // Reset to normal text
        pdf.setFontSize(options.fontSize)
        pdf.setFont(options.fontFamily, 'normal')
      } else {
        // Regular paragraph
        const lines = pdf.splitTextToSize(paragraph, maxWidth)
        
        lines.forEach(line => {
          if (yPosition > pdf.internal.pageSize.getHeight() - options.margins.bottom) {
            pdf.addPage()
            yPosition = options.margins.top
          }
          
          pdf.text(line, options.margins.left, yPosition)
          yPosition += options.fontSize * options.lineHeight
        })
        
        yPosition += 5 // Space after paragraph
      }
    })

    return yPosition
  }

  private static addSection(pdf: jsPDF, title: string, items: string[], options: PDFOptions, startY: number): number {
    let yPosition = startY + 15

    if (yPosition > pdf.internal.pageSize.getHeight() - options.margins.bottom) {
      pdf.addPage()
      yPosition = options.margins.top
    }

    // Section title
    pdf.setFontSize(16)
    pdf.setFont(options.fontFamily, 'bold')
    pdf.text(title, options.margins.left, yPosition)
    yPosition += 10

    // Section items
    pdf.setFontSize(options.fontSize)
    pdf.setFont(options.fontFamily, 'normal')

    items.forEach(item => {
      if (yPosition > pdf.internal.pageSize.getHeight() - options.margins.bottom) {
        pdf.addPage()
        yPosition = options.margins.top
      }

      const maxWidth = pdf.internal.pageSize.getWidth() - options.margins.left - options.margins.right - 10
      const lines = pdf.splitTextToSize(`• ${item}`, maxWidth)
      
      lines.forEach(line => {
        pdf.text(line, options.margins.left + 5, yPosition)
        yPosition += options.fontSize * options.lineHeight
      })
    })

    return yPosition
  }

  private static addFooters(pdf: jsPDF, title: string): void {
    const pageCount = pdf.getNumberOfPages()
    
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i)
      
      // Footer line
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      
      pdf.setDrawColor(200, 200, 200)
      pdf.line(20, pageHeight - 15, pageWidth - 20, pageHeight - 15)
      
      // Page number
      pdf.setFontSize(10)
      pdf.setTextColor(100, 100, 100)
      pdf.text(`${i}`, pageWidth / 2, pageHeight - 10, { align: 'center' })
      
      // Document title (except on cover page)
      if (i > 1) {
        const shortTitle = title.length > 50 ? title.substring(0, 47) + '...' : title
        pdf.text(shortTitle, 20, pageHeight - 10)
      }
    }
    
    // Reset colors
    pdf.setTextColor(0, 0, 0)
  }

  static async generateFromHTML(htmlContent: string, filename: string): Promise<Blob> {
    // Create a temporary div to render HTML
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = htmlContent
    tempDiv.style.width = '210mm' // A4 width
    tempDiv.style.padding = '20mm'
    tempDiv.style.fontFamily = 'Arial, sans-serif'
    tempDiv.style.fontSize = '12pt'
    tempDiv.style.lineHeight = '1.5'
    tempDiv.style.backgroundColor = 'white'
    tempDiv.style.position = 'absolute'
    tempDiv.style.left = '-9999px'
    
    document.body.appendChild(tempDiv)

    try {
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      
      const imgWidth = 210
      const pageHeight = 297
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      let position = 0

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      return pdf.output('blob')
    } finally {
      document.body.removeChild(tempDiv)
    }
  }
}