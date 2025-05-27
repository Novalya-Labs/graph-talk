import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';

export type ExportFormat = 'pdf' | 'png' | 'svg' | 'csv' | 'json';

export interface ExportOptions {
  filename?: string;
  title?: string;
  includeData?: boolean;
  quality?: number;
  width?: number;
  height?: number;
  generatedOnText?: string;
}

export async function exportChart(
  element: HTMLElement,
  format: ExportFormat,
  options: ExportOptions = {},
): Promise<void> {
  const {
    filename = `chart-${Date.now()}`,
    title = 'Chart Export',
    quality = 1,
    width = 800,
    height = 600,
    generatedOnText = 'Generated on:',
  } = options;

  try {
    switch (format) {
      case 'png':
        await exportToPNG(element, filename, quality);
        break;
      case 'pdf':
        await exportToPDF(element, filename, title, width, height, generatedOnText);
        break;
      case 'svg':
        await exportToSVG(element, filename);
        break;
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  } catch (error) {
    console.error('Export failed:', error);
    throw new Error(`Failed to export as ${format.toUpperCase()}`);
  }
}

export async function exportData(
  data: Record<string, unknown>[],
  format: 'csv' | 'json',
  filename = `data-${Date.now()}`,
): Promise<void> {
  try {
    switch (format) {
      case 'csv':
        exportToCSV(data, filename);
        break;
      case 'json':
        exportToJSON(data, filename);
        break;
      default:
        throw new Error(`Unsupported data format: ${format}`);
    }
  } catch (error) {
    console.error('Data export failed:', error);
    throw new Error(`Failed to export data as ${format.toUpperCase()}`);
  }
}

async function exportToPNG(element: HTMLElement, filename: string, quality: number): Promise<void> {
  const canvas = await html2canvas(element, {
    backgroundColor: '#ffffff',
    scale: quality,
    useCORS: true,
    allowTaint: true,
    logging: false,
  });

  canvas.toBlob((blob) => {
    if (blob) {
      saveAs(blob, `${filename}.png`);
    }
  }, 'image/png');
}

async function exportToPDF(
  element: HTMLElement,
  filename: string,
  title: string,
  width: number,
  height: number,
  generatedOnText: string,
): Promise<void> {
  const canvas = await html2canvas(element, {
    backgroundColor: '#ffffff',
    scale: 2,
    useCORS: true,
    allowTaint: true,
    logging: false,
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: width > height ? 'landscape' : 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Add title
  pdf.setFontSize(16);
  pdf.text(title, 20, 20);

  // Add timestamp
  pdf.setFontSize(10);
  pdf.text(`${generatedOnText} ${new Date().toLocaleString()}`, 20, 30);

  // Calculate image dimensions to fit page
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pageWidth - 40; // 20mm margin on each side
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  // biome-ignore lint/style/useConst: <explanation>
  let yPosition = 40;
  if (imgHeight > pageHeight - 60) {
    // If image is too tall, scale it down
    const scaledHeight = pageHeight - 60;
    const scaledWidth = (canvas.width * scaledHeight) / canvas.height;
    pdf.addImage(imgData, 'PNG', 20, yPosition, scaledWidth, scaledHeight);
  } else {
    pdf.addImage(imgData, 'PNG', 20, yPosition, imgWidth, imgHeight);
  }

  pdf.save(`${filename}.pdf`);
}

async function exportToSVG(element: HTMLElement, filename: string): Promise<void> {
  // Find SVG element within the chart container
  const svgElement = element.querySelector('svg');
  if (!svgElement) {
    throw new Error('No SVG element found in the chart');
  }

  const svgData = new XMLSerializer().serializeToString(svgElement);
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  saveAs(svgBlob, `${filename}.svg`);
}

function exportToCSV(data: Record<string, unknown>[], filename: string): void {
  if (!data || data.length === 0) {
    throw new Error('No data to export');
  }

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          // Escape commas and quotes in CSV
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return String(value ?? '');
        })
        .join(','),
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, `${filename}.csv`);
}

function exportToJSON(data: Record<string, unknown>[], filename: string): void {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8' });
  saveAs(blob, `${filename}.json`);
}

export function generateExportFilename(chartTitle: string, _format: ExportFormat, timestamp = true): string {
  const sanitizedTitle = chartTitle
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  const timestampSuffix = timestamp ? `-${Date.now()}` : '';
  return `${sanitizedTitle}${timestampSuffix}`;
}

export const EXPORT_FORMATS = ['pdf', 'png', 'svg', 'csv', 'json'] as const;

export const EXPORT_ICONS: Record<ExportFormat, string> = {
  pdf: '📄',
  png: '🖼️',
  svg: '🎨',
  csv: '📊',
  json: '📋',
};
