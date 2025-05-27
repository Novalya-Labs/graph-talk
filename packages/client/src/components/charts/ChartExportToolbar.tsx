import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, Loader2 } from 'lucide-react';
import { useChartExport } from '@/hooks/use-chart-export';
import { EXPORT_FORMATS, EXPORT_ICONS, type ExportFormat } from '@/lib/universal-export';

interface ChartExportToolbarProps {
  chartRef: React.RefObject<HTMLDivElement | null>;
  data: Record<string, unknown>[];
  chartTitle: string;
}

export function ChartExportToolbar({ chartRef, data, chartTitle }: ChartExportToolbarProps) {
  const { exportChartElement, exportChartData, isExporting } = useChartExport();
  const { t } = useTranslation('export');

  const handleExport = async (format: ExportFormat) => {
    if (format === 'csv' || format === 'json') {
      await exportChartData(data, format, chartTitle);
    } else {
      await exportChartElement(chartRef.current, format, chartTitle);
    }
  };

  const chartFormats = EXPORT_FORMATS.slice(0, 3); // pdf, png, svg
  const dataFormats = EXPORT_FORMATS.slice(3); // csv, json

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isExporting} className="h-8 gap-1">
          {isExporting ? <Loader2 className="size-3 animate-spin" /> : <Download className="size-3" />}
          {t('button')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {chartFormats.map((format) => (
          <DropdownMenuItem
            key={format}
            onClick={() => handleExport(format)}
            disabled={isExporting}
            className="flex items-center gap-2"
          >
            <span>{EXPORT_ICONS[format]}</span>
            <span>{t(`formats.${format}`)}</span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        {dataFormats.map((format) => (
          <DropdownMenuItem
            key={format}
            onClick={() => handleExport(format)}
            disabled={isExporting}
            className="flex items-center gap-2"
          >
            <span>{EXPORT_ICONS[format]}</span>
            <span>{t(`formats.${format}`)}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
