import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, BarChart3, Table as TableIcon, Clock, Lightbulb } from 'lucide-react';
import type { AiChatMessage, ChartRecommendation } from '../aiChatType';
import { ChartRenderer } from '@/components/charts/ChartRenderer';
import { convertToChartConfig } from '@/lib/chart-utils';

interface SqlResultDisplayProps {
  message: AiChatMessage;
}

export const SqlResultDisplay = ({ message }: SqlResultDisplayProps) => {
  const { userPrompt, response } = message;
  const { sqlQuery, result, chartRecommendation, conversationalResponse, insights, executionTime } = response;

  const isError = result && typeof result === 'object' && 'error' in result;
  const isNullResult = result === null || result === undefined;
  const data = Array.isArray(result) ? result : [];

  const shouldShowChart = chartRecommendation !== null && chartRecommendation.type !== 'table';

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
        {executionTime && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="size-3" />
            Exécuté en {executionTime}ms
          </div>
        )}
      </CardHeader>

      <CardContent>
        {conversationalResponse && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-md">
            <p className="text-sm text-blue-900 dark:text-blue-100">{conversationalResponse}</p>
          </div>
        )}

        {insights && insights.length > 0 && (
          <div className="mb-4 space-y-2">
            {insights.map((insight, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <Lightbulb className="size-3 text-yellow-500" />
                <span className="text-muted-foreground">{insight.message}</span>
                {insight.value && <Badge variant="outline">{insight.value}</Badge>}
              </div>
            ))}
          </div>
        )}

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
              {shouldShowChart && chartRecommendation && (
                <Badge variant="outline" className="gap-1">
                  <BarChart3 className="size-3" />
                  {chartRecommendation.title} ({Math.round(chartRecommendation.confidence * 100)}%)
                </Badge>
              )}
            </div>

            {shouldShowChart && chartRecommendation ? (
              <div className="space-y-4">
                <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
                  <strong>Recommandation:</strong> {chartRecommendation.reasoning}
                </div>

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
                    <ChartRenderer
                      data={data}
                      config={convertToChartConfig(chartRecommendation)}
                      showExportToolbar={true}
                    />
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
