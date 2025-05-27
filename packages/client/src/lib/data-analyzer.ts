export type ChartType = 'bar' | 'line' | 'pie' | 'scatter' | 'area' | 'composed' | 'heatmap';
export type ColumnType = 'numeric' | 'categorical' | 'date' | 'text';

export interface ChartConfig {
  type: ChartType;
  title: string;
  xAxis: { key: string; label: string; type: 'category' | 'number' | 'date' };
  yAxis: { key: string; label: string; type: 'number' };
  series: Array<{ key: string; name: string; color?: string }>;
  options?: Record<string, unknown>;
}

export interface DataStructure {
  hasNumericColumns: boolean;
  hasCategoricalColumns: boolean;
  hasDateColumns: boolean;
  hasAggregations: boolean;
  rowCount: number;
  columnTypes: Record<string, ColumnType>;
  numericColumns: string[];
  categoricalColumns: string[];
  dateColumns: string[];
}

export interface DataAnalysis {
  isChartable: boolean;
  confidence: number;
  suggestedCharts: ChartConfig[];
  primaryChart: ChartConfig | null;
  dataStructure: DataStructure;
  dataQuality: {
    completeness: number;
    consistency: number;
    validity: number;
  };
}

const CHART_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

function detectColumnType(values: unknown[]): ColumnType {
  const nonNullValues = values.filter((v) => v !== null && v !== undefined && v !== '');

  if (nonNullValues.length === 0) return 'text';

  // Check for dates
  const dateCount = nonNullValues.filter((v) => {
    if (typeof v === 'string') {
      const date = new Date(v);
      return !Number.isNaN(date.getTime()) && v.match(/\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4}|\d{4}\/\d{2}\/\d{2}/);
    }
    return v instanceof Date && !Number.isNaN(v.getTime());
  }).length;

  if (dateCount / nonNullValues.length > 0.7) return 'date';

  // Check for numbers
  const numericCount = nonNullValues.filter((v) => {
    if (typeof v === 'number') return !Number.isNaN(v);
    if (typeof v === 'string') {
      const num = Number.parseFloat(v);
      return !Number.isNaN(num) && Number.isFinite(num);
    }
    return false;
  }).length;

  if (numericCount / nonNullValues.length > 0.8) return 'numeric';

  // Check if categorical (limited unique values)
  const uniqueValues = new Set(nonNullValues);
  const uniqueRatio = uniqueValues.size / nonNullValues.length;

  if (uniqueRatio < 0.5 && uniqueValues.size < 20) return 'categorical';

  return 'text';
}

function analyzeDataStructure(data: Record<string, unknown>[]): DataStructure {
  if (!data || data.length === 0) {
    return {
      hasNumericColumns: false,
      hasCategoricalColumns: false,
      hasDateColumns: false,
      hasAggregations: false,
      rowCount: 0,
      columnTypes: {},
      numericColumns: [],
      categoricalColumns: [],
      dateColumns: [],
    };
  }

  const columns = Object.keys(data[0]);
  const columnTypes: Record<string, ColumnType> = {};
  const numericColumns: string[] = [];
  const categoricalColumns: string[] = [];
  const dateColumns: string[] = [];

  for (const column of columns) {
    const values = data.map((row) => row[column]);
    const type = detectColumnType(values);
    columnTypes[column] = type;

    switch (type) {
      case 'numeric':
        numericColumns.push(column);
        break;
      case 'categorical':
        categoricalColumns.push(column);
        break;
      case 'date':
        dateColumns.push(column);
        break;
    }
  }

  // Detect aggregations (common patterns)
  const hasAggregations = columns.some(
    (col) =>
      col.toLowerCase().includes('count') ||
      col.toLowerCase().includes('sum') ||
      col.toLowerCase().includes('avg') ||
      col.toLowerCase().includes('total') ||
      col.toLowerCase().includes('max') ||
      col.toLowerCase().includes('min'),
  );

  return {
    hasNumericColumns: numericColumns.length > 0,
    hasCategoricalColumns: categoricalColumns.length > 0,
    hasDateColumns: dateColumns.length > 0,
    hasAggregations,
    rowCount: data.length,
    columnTypes,
    numericColumns,
    categoricalColumns,
    dateColumns,
  };
}

function generateChartConfigs(_data: Record<string, unknown>[], structure: DataStructure): ChartConfig[] {
  const configs: ChartConfig[] = [];
  const { numericColumns, categoricalColumns, dateColumns } = structure;

  // Bar Chart: Categorical + Numeric
  if (categoricalColumns.length > 0 && numericColumns.length > 0) {
    const xAxis = categoricalColumns[0];
    const yAxis = numericColumns[0];

    configs.push({
      type: 'bar',
      title: `${yAxis} par ${xAxis}`,
      xAxis: { key: xAxis, label: xAxis, type: 'category' },
      yAxis: { key: yAxis, label: yAxis, type: 'number' },
      series: [{ key: yAxis, name: yAxis, color: CHART_COLORS[0] }],
    });
  }

  // Line Chart: Date + Numeric
  if (dateColumns.length > 0 && numericColumns.length > 0) {
    const xAxis = dateColumns[0];
    const yAxis = numericColumns[0];

    configs.push({
      type: 'line',
      title: `Évolution de ${yAxis} dans le temps`,
      xAxis: { key: xAxis, label: xAxis, type: 'date' },
      yAxis: { key: yAxis, label: yAxis, type: 'number' },
      series: [{ key: yAxis, name: yAxis, color: CHART_COLORS[1] }],
    });
  }

  // Pie Chart: Categorical with aggregated data
  if (categoricalColumns.length > 0 && numericColumns.length > 0 && structure.rowCount <= 10) {
    const categoryCol = categoricalColumns[0];
    const valueCol = numericColumns[0];

    configs.push({
      type: 'pie',
      title: `Répartition de ${valueCol} par ${categoryCol}`,
      xAxis: { key: categoryCol, label: categoryCol, type: 'category' },
      yAxis: { key: valueCol, label: valueCol, type: 'number' },
      series: [{ key: valueCol, name: valueCol }],
    });
  }

  // Scatter Plot: Multiple numeric columns
  if (numericColumns.length >= 2) {
    const xAxis = numericColumns[0];
    const yAxis = numericColumns[1];

    configs.push({
      type: 'scatter',
      title: `Corrélation ${xAxis} vs ${yAxis}`,
      xAxis: { key: xAxis, label: xAxis, type: 'number' },
      yAxis: { key: yAxis, label: yAxis, type: 'number' },
      series: [{ key: yAxis, name: `${xAxis} vs ${yAxis}`, color: CHART_COLORS[2] }],
    });
  }

  // Area Chart: Time series with multiple metrics
  if (dateColumns.length > 0 && numericColumns.length > 1) {
    const xAxis = dateColumns[0];

    configs.push({
      type: 'area',
      title: 'Évolution des métriques dans le temps',
      xAxis: { key: xAxis, label: xAxis, type: 'date' },
      yAxis: { key: numericColumns[0], label: 'Valeurs', type: 'number' },
      series: numericColumns.slice(0, 3).map((col, idx) => ({
        key: col,
        name: col,
        color: CHART_COLORS[idx],
      })),
    });
  }

  // Composed Chart: Mixed data types
  if (categoricalColumns.length > 0 && numericColumns.length > 1) {
    const xAxis = categoricalColumns[0];

    configs.push({
      type: 'composed',
      title: `Analyse comparative par ${xAxis}`,
      xAxis: { key: xAxis, label: xAxis, type: 'category' },
      yAxis: { key: numericColumns[0], label: 'Valeurs', type: 'number' },
      series: numericColumns.slice(0, 2).map((col, idx) => ({
        key: col,
        name: col,
        color: CHART_COLORS[idx],
      })),
    });
  }

  return configs;
}

function calculateDataQuality(data: Record<string, unknown>[]): {
  completeness: number;
  consistency: number;
  validity: number;
} {
  if (!data || data.length === 0) {
    return { completeness: 0, consistency: 0, validity: 0 };
  }

  const totalCells = data.length * Object.keys(data[0]).length;
  // biome-ignore lint/correctness/noUnusedVariables: <explanation>
  let nullCells = 0;
  let validCells = 0;

  for (const row of data) {
    for (const value of Object.values(row)) {
      if (value === null || value === undefined || value === '') {
        nullCells++;
      } else {
        validCells++;
      }
    }
  }

  const completeness = validCells / totalCells;
  const consistency = 0.9; // Simplified - could be enhanced
  const validity = 0.95; // Simplified - could be enhanced

  return { completeness, consistency, validity };
}

export function analyzeData(data: Record<string, unknown>[]): DataAnalysis {
  if (!data || data.length === 0) {
    return {
      isChartable: false,
      confidence: 0,
      suggestedCharts: [],
      primaryChart: null,
      dataStructure: analyzeDataStructure(data),
      dataQuality: { completeness: 0, consistency: 0, validity: 0 },
    };
  }

  const dataStructure = analyzeDataStructure(data);
  const suggestedCharts = generateChartConfigs(data, dataStructure);
  const dataQuality = calculateDataQuality(data);

  // Determine if data is chartable
  const isChartable =
    dataStructure.hasNumericColumns &&
    (dataStructure.hasCategoricalColumns || dataStructure.hasDateColumns) &&
    dataStructure.rowCount > 0 &&
    dataStructure.rowCount <= 1000 && // Reasonable limit for visualization
    dataQuality.completeness > 0.5;

  // Calculate confidence based on data quality and structure
  let confidence = 0;
  if (isChartable) {
    confidence = dataQuality.completeness * 0.4 + dataQuality.consistency * 0.3 + dataQuality.validity * 0.3;

    // Boost confidence for well-structured data
    if (dataStructure.hasDateColumns) confidence += 0.1;
    if (dataStructure.hasAggregations) confidence += 0.1;
    if (dataStructure.rowCount >= 3 && dataStructure.rowCount <= 50) confidence += 0.1;

    confidence = Math.min(confidence, 1);
  }

  const primaryChart = suggestedCharts.length > 0 ? suggestedCharts[0] : null;

  return {
    isChartable,
    confidence,
    suggestedCharts,
    primaryChart,
    dataStructure,
    dataQuality,
  };
}
