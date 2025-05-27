import { useCallback, useState } from 'react';
import { exportChart, exportData, generateExportFilename, type ExportFormat, type ExportOptions } from '@/lib/universal-export';
import { useToast } from '@/hooks/use-toast';

export function useChartExport() {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const exportChartElement = useCallback(async (
    element: HTMLElement | null,
    format: ExportFormat,
    chartTitle: string,
    options: ExportOptions = {}
  ) => {
    if (!element) {
      toast({
        title: 'Export Error',
        description: 'Chart element not found',
        variant: 'destructive',
      });
      return;
    }

    setIsExporting(true);
    
    try {
      const filename = generateExportFilename(chartTitle, format);
      await exportChart(element, format, {
        ...options,
        filename,
        title: chartTitle,
      });
      
      toast({
        title: 'Export Successful',
        description: `Chart exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: 'Export Failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  }, [toast]);

  const exportChartData = useCallback(async (
    data: Record<string, unknown>[],
    format: 'csv' | 'json',
    chartTitle: string
  ) => {
    if (!data || data.length === 0) {
      toast({
        title: 'Export Error',
        description: 'No data to export',
        variant: 'destructive',
      });
      return;
    }

    setIsExporting(true);
    
    try {
      const filename = generateExportFilename(chartTitle, format);
      await exportData(data, format, filename);
      
      toast({
        title: 'Export Successful',
        description: `Data exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      console.error('Data export failed:', error);
      toast({
        title: 'Export Failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  }, [toast]);

  return {
    exportChartElement,
    exportChartData,
    isExporting,
  };
} 