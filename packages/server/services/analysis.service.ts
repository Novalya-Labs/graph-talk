import { ChatOpenAI } from '@langchain/openai';
import { Env } from '@/configs/env';
import { analysisAgentPrompt } from '@/prompts/analysis-agent';
import type { ChartRecommendation, DataInsight, EnhancedQueryResponse } from '@/types/analysis.types';

class AnalysisService {
  private llm: ChatOpenAI;

  constructor() {
    this.llm = new ChatOpenAI({
      temperature: 0.3,
      model: 'gpt-4o-mini',
      apiKey: Env.OPENAI_API_KEY,
      maxTokens: 1500,
    });
  }

  async analyzeQueryResult(
    userPrompt: string,
    sqlQuery: string,
    result: unknown,
    executionTime?: number,
  ): Promise<EnhancedQueryResponse> {
    try {
      if (!result || (typeof result === 'object' && 'error' in result)) {
        return this.createErrorResponse(userPrompt, sqlQuery, result, executionTime);
      }

      const data = Array.isArray(result) ? result : [];
      if (data.length === 0) {
        return this.createEmptyResponse(userPrompt, sqlQuery, result, executionTime);
      }

      const analysis = await this.performLLMAnalysis(userPrompt, sqlQuery, data);

      return {
        prompt: userPrompt,
        sqlQuery,
        result,
        chartRecommendation: analysis.chartRecommendation,
        conversationalResponse: analysis.conversationalResponse,
        insights: analysis.insights,
        executionTime,
      };
    } catch (error) {
      console.error('Analysis service error:', error);
      return this.createErrorResponse(userPrompt, sqlQuery, result, executionTime);
    }
  }

  private async performLLMAnalysis(
    userPrompt: string,
    sqlQuery: string,
    data: Record<string, unknown>[],
  ): Promise<{
    chartRecommendation: ChartRecommendation | null;
    conversationalResponse: string;
    insights: DataInsight[];
  }> {
    const dataSummary = this.createDataSummary(data);

    const analysisPrompt = `${analysisAgentPrompt}

    USER QUESTION: "${userPrompt}"

    SQL QUERY: ${sqlQuery}

    DATA STRUCTURE:
    - Columns: ${Object.keys(data[0] || {}).join(', ')}
    - Row count: ${data.length}
    - Sample data: ${JSON.stringify(data.slice(0, 3), null, 2)}

    DATA SUMMARY:
    ${dataSummary}

    Analyze this and provide your recommendation as a valid JSON object:`;

    const response = await this.llm.invoke(analysisPrompt);
    const content = response.content as string;

    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const analysis = JSON.parse(jsonMatch[0]);

      return {
        chartRecommendation: analysis.chartRecommendation || null,
        conversationalResponse: analysis.conversationalResponse || 'Here are the results of your query.',
        insights: analysis.insights || [],
      };
    } catch (parseError) {
      console.error('Failed to parse LLM analysis:', parseError);
      return this.createFallbackAnalysis(userPrompt, data);
    }
  }

  private createDataSummary(data: Record<string, unknown>[]): string {
    if (data.length === 0) return 'No data available';

    const columns = Object.keys(data[0]);
    const summary: string[] = [];

    for (const column of columns) {
      const values = data.map((row) => row[column]).filter((v) => v !== null && v !== undefined);

      if (values.length === 0) continue;

      const firstValue = values[0];

      if (typeof firstValue === 'number') {
        const numbers = values as number[];
        const min = Math.min(...numbers);
        const max = Math.max(...numbers);
        const avg = numbers.reduce((a, b) => a + b, 0) / numbers.length;
        summary.push(`${column}: numeric (min: ${min}, max: ${max}, avg: ${avg.toFixed(2)})`);
      } else {
        const uniqueCount = new Set(values).size;
        summary.push(`${column}: ${typeof firstValue} (${uniqueCount} unique values)`);
      }
    }

    return summary.join('\n');
  }

  private createFallbackAnalysis(
    userPrompt: string,
    data: Record<string, unknown>[],
  ): {
    chartRecommendation: ChartRecommendation | null;
    conversationalResponse: string;
    insights: DataInsight[];
  } {
    // Simple fallback logic
    const columns = Object.keys(data[0] || {});
    const hasNumericColumn = columns.some((col) => data.some((row) => typeof row[col] === 'number'));

    let chartType: 'bar' | 'table' = 'table';
    let title = 'Résultats de la requête';

    // Basic heuristics
    if (hasNumericColumn && data.length <= 20) {
      if (userPrompt.toLowerCase().includes('plus') || userPrompt.toLowerCase().includes('classement')) {
        chartType = 'bar';
        title = 'Classement des résultats';
      }
    }

    return {
      chartRecommendation:
        chartType === 'bar'
          ? {
              type: 'bar',
              title,
              confidence: 0.6,
              reasoning: 'Analyse automatique basée sur la structure des données',
              xAxis: {
                key: columns[0],
                label: columns[0],
                type: 'category',
              },
              yAxis: {
                key: columns.find((col) => data.some((row) => typeof row[col] === 'number')) || columns[1],
                label: 'Valeur',
                type: 'number',
              },
              series: [
                {
                  key: columns.find((col) => data.some((row) => typeof row[col] === 'number')) || columns[1],
                  name: 'Valeur',
                  color: '#3b82f6',
                },
              ],
            }
          : null,
      conversationalResponse: `Voici les résultats pour votre question "${userPrompt}". J'ai trouvé ${data.length} résultat(s).`,
      insights: [
        {
          type: 'summary',
          message: `${data.length} résultat(s) trouvé(s)`,
          value: data.length.toString(),
        },
      ],
    };
  }

  private createErrorResponse(
    userPrompt: string,
    sqlQuery: string,
    result: unknown,
    executionTime?: number,
  ): EnhancedQueryResponse {
    const errorMessage =
      typeof result === 'object' && result && 'error' in result
        ? (result as { error: string }).error
        : "Une erreur est survenue lors de l'exécution de la requête";

    return {
      prompt: userPrompt,
      sqlQuery,
      result,
      chartRecommendation: null,
      conversationalResponse: `Désolé, je n'ai pas pu traiter votre demande "${userPrompt}". ${errorMessage}`,
      insights: [
        {
          type: 'summary',
          message: "Erreur lors de l'exécution",
          value: errorMessage,
        },
      ],
      executionTime,
    };
  }

  private createEmptyResponse(
    userPrompt: string,
    sqlQuery: string,
    result: unknown,
    executionTime?: number,
  ): EnhancedQueryResponse {
    return {
      prompt: userPrompt,
      sqlQuery,
      result,
      chartRecommendation: null,
      conversationalResponse: `Je n'ai trouvé aucun résultat pour votre question "${userPrompt}". Vous pourriez essayer de reformuler votre demande ou vérifier que les données existent.`,
      insights: [
        {
          type: 'summary',
          message: 'Aucun résultat trouvé',
          value: '0',
        },
      ],
      executionTime,
    };
  }
}

export const analysisService = new AnalysisService();
