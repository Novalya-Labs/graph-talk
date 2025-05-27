import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { exportChart, exportData, generateExportFilename, type ExportFormat, type ExportOptions } from '@/lib/universal-export';
import { useToast } from '@/hooks/use-toast';

export function useChartExport() {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation('export');

  const exportChartElement = useCallback(async (
    element: HTMLElement | null,
    format: ExportFormat,
    chartTitle: string,
    options: ExportOptions = {}
  ) => {
    if (!element) {
      toast({
        title: t('error.title'),
        description: t('error.chartNotFound'),
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
        title: chartTitle || t('defaultTitle'),
        generatedOnText: t('generatedOn'),
      });
      
      toast({
        title: t('success.title'),
        description: t('success.chartExported', { format: format.toUpperCase() }),
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: t('failed.title'),
        description: error instanceof Error ? error.message : t('error.unknown'),
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  }, [toast, t]);

  const exportChartData = useCallback(async (
    data: Record<string, unknown>[],
    format: 'csv' | 'json',
    chartTitle: string
  ) => {
    if (!data || data.length === 0) {
      toast({
        title: t('error.title'),
        description: t('error.noData'),
        variant: 'destructive',
      });
      return;
    }

    setIsExporting(true);
    
    try {
      const filename = generateExportFilename(chartTitle, format);
      await exportData(data, format, filename);
      
      toast({
        title: t('success.title'),
        description: t('success.dataExported', { format: format.toUpperCase() }),
      });
    } catch (error) {
      console.error('Data export failed:', error);
      toast({
        title: t('failed.title'),
        description: error instanceof Error ? error.message : t('error.unknown'),
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  }, [toast, t]);

  return {
    exportChartElement,
    exportChartData,
    isExporting,
  };
} 