import React from 'react';
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
import { getExportButtonConfig } from '@/lib/universal-export';

interface ChartExportToolbarProps {
  chartRef: React.RefObject<HTMLDivElement | null>;
  data: Record<string, unknown>[];
  chartTitle: string;
}

export function ChartExportToolbar({ chartRef, data, chartTitle }: ChartExportToolbarProps) {
  const { exportChartElement, exportChartData, isExporting } = useChartExport();
  const exportConfigs = getExportButtonConfig();

  const handleExport = async (format: 'pdf' | 'png' | 'svg' | 'csv' | 'json') => {
    if (format === 'csv' || format === 'json') {
      await exportChartData(data, format, chartTitle);
    } else {
      await exportChartElement(chartRef.current, format, chartTitle);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isExporting} className="h-8 gap-1">
          {isExporting ? <Loader2 className="size-3 animate-spin" /> : <Download className="size-3" />}
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {exportConfigs.slice(0, 3).map((config) => (
          <DropdownMenuItem
            key={config.format}
            onClick={() => handleExport(config.format)}
            disabled={isExporting}
            className="flex items-center gap-2"
          >
            <span>{config.icon}</span>
            <span>{config.label}</span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        {exportConfigs.slice(3).map((config) => (
          <DropdownMenuItem
            key={config.format}
            onClick={() => handleExport(config.format)}
            disabled={isExporting}
            className="flex items-center gap-2"
          >
            <span>{config.icon}</span>
            <span>{config.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
