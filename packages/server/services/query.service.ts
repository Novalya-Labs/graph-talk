import { SqlDatabase } from 'langchain/sql_db';
import { createSqlAgent, SqlToolkit } from 'langchain/agents/toolkits/sql';
import { ChatOpenAI } from '@langchain/openai';
import { AppDataSource } from '@/configs/database';
import { z } from 'zod';
import { Env } from '@/configs/env';
import { AgentExecutor } from 'langchain/dist/agents/executor';

class QueryService {
  private agent: AgentExecutor | null = null;

  async initialize() {
    if (this.agent) return;

    const llm = new ChatOpenAI({
      temperature: 0,
      model: 'gpt-4o-mini',
      apiKey: Env.OPENAI_API_KEY,
      maxTokens: 1000,
    });

    const db = await SqlDatabase.fromDataSourceParams({
      appDataSource: AppDataSource,
    });

    const toolkit = new SqlToolkit(db);

    const agent = createSqlAgent(llm, toolkit);

    this.agent = agent;
  }

  async getQueryResult(prompt: string): Promise<{
    prompt: string;
    sqlQuery: string;
    result: unknown;
  }> {
    await this.initialize();

    if (!this.agent) throw new Error('Agent not initialized');

    const promptSchema = z.string().min(2);
    promptSchema.parse(prompt);

    try {
      const result = await this.agent.invoke({ input: prompt });

      const response = {
        prompt,
        sqlQuery: '',
        result: null,
      };

      for (const step of result.intermediateSteps) {
        console.log(step);
        if (step.action.tool === 'query-sql') {
          response.sqlQuery = step.action.toolInput;
          try {
            response.result = JSON.parse(step.observation);
          } catch {
            response.result = step.observation;
          }
        }
      }

      console.log(`Intermediate steps ${JSON.stringify(result.intermediateSteps, null, 2)}`);

      return response;
    } catch (error) {
      console.error('Error in getQueryResult:', error);

      // If it's an output parsing error, try to handle it gracefully
      if (error instanceof Error && error.message.includes('Could not parse LLM output')) {
        return {
          prompt,
          sqlQuery: '',
          result: { error: 'Unable to process the query. Please try rephrasing your question.' },
        };
      }

      throw error;
    }
  }
}

export const queryService = new QueryService();
