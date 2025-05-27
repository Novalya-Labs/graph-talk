import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, BarChart3, Table as TableIcon } from 'lucide-react';
import type { AiChatMessage } from '../aiChatType';
import { useChartRecommendations } from '@/hooks/use-chart-analysis';
import { ChartRenderer } from '@/components/charts/ChartRenderer';
import { ChartSelector } from '@/components/charts/ChartSelector';

interface SqlResultDisplayProps {
  message: AiChatMessage;
}

export const SqlResultDisplay = ({ message }: SqlResultDisplayProps) => {
  const { userPrompt, response } = message;
  const { sqlQuery, result } = response;

  // Handle different result types more robustly
  const isError = result && typeof result === 'object' && 'error' in result;
  const isNullResult = result === null || result === undefined;
  const data = Array.isArray(result) ? result : [];

  const { shouldShowChart, recommendedChart, alternativeCharts, confidence } = useChartRecommendations(data);
  const [selectedChart, setSelectedChart] = useState(recommendedChart);

  const allCharts = recommendedChart ? [recommendedChart, ...alternativeCharts] : [];

  const renderTable = () => (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {Object.keys(data[0]).map((key) => (
              <TableHead key={key} className="font-semibold">
                {key}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, idx) => (
            <TableRow key={idx}>
              {Object.values(row).map((value, i) => (
                <TableCell key={i} className="font-mono text-sm">
                  {String(value)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Code className="size-4" />
          Requête: {userPrompt}
        </CardTitle>
        <div className="text-xs text-muted-foreground font-mono bg-muted p-2 rounded">
          {sqlQuery || 'Aucune requête SQL générée'}
        </div>
      </CardHeader>

      <CardContent>
        {isError ? (
          <div className="text-red-500 text-sm">
            <Badge variant="destructive" className="mb-2">
              Erreur
            </Badge>
            <p>{(result as { error: string }).error}</p>
          </div>
        ) : isNullResult ? (
          <div className="text-red-500 text-sm">
            <Badge variant="destructive" className="mb-2">
              Erreur
            </Badge>
            <p>Aucun résultat retourné. Veuillez reformuler votre question.</p>
          </div>
        ) : data.length === 0 ? (
          <div className="text-muted-foreground text-sm">
            <Badge variant="secondary" className="mb-2">
              Aucun résultat
            </Badge>
            <p>La requête n'a retourné aucun résultat.</p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="default">{data.length} résultat(s)</Badge>
              {shouldShowChart && (
                <Badge variant="outline" className="gap-1">
                  <BarChart3 className="size-3" />
                  Graphique disponible
                </Badge>
              )}
            </div>

            {shouldShowChart && selectedChart ? (
              <div className="space-y-4">
                <ChartSelector
                  suggestedCharts={allCharts}
                  selectedChart={selectedChart}
                  onChartChange={setSelectedChart}
                  confidence={confidence}
                />

                <Tabs defaultValue="chart" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="chart" className="flex items-center gap-2">
                      <BarChart3 className="size-4" />
                      Graphique
                    </TabsTrigger>
                    <TabsTrigger value="table" className="flex items-center gap-2">
                      <TableIcon className="size-4" />
                      Tableau
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="chart" className="mt-4">
                    <ChartRenderer data={data} config={selectedChart} showExportToolbar={true} />
                  </TabsContent>

                  <TabsContent value="table" className="mt-4">
                    {renderTable()}
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              renderTable()
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
