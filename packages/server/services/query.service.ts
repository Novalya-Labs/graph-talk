import { SqlDatabase } from 'langchain/sql_db';
import { createSqlAgent, SqlToolkit } from 'langchain/agents/toolkits/sql';
import { ChatOpenAI } from '@langchain/openai';
import { AppDataSource } from '@/configs/database';
import { z } from 'zod';
import { Env } from '@/configs/env';
import { AgentExecutor } from 'langchain/dist/agents/executor';
import { sqlAgentPrompt } from '@/prompts/sql-agent';

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
      includesTables: ['user', 'product', 'order', 'order_item'],
      customDescription: {
        user: 'Table name: "user" (must be quoted). Contains user information with columns: id (integer), name (varchar), email (varchar). Example: SELECT name, email FROM "user" LIMIT 10;',
        product:
          'Table name: "product". Contains product information with columns: id (integer), name (varchar), description (varchar), price (decimal). Example: SELECT name, price FROM "product" WHERE price > 100;',
        order:
          'Table name: "order" (must be quoted). Contains order information with columns: id (integer), userid (integer), createdat (date). Example: SELECT * FROM "order" LIMIT 10;',
        order_item:
          'Table name: "order_item". Contains order item information with columns: id (integer), orderid (integer), productid (integer), quantity (integer). Example: SELECT * FROM "order_item" LIMIT 10;',
      },
    });

    const toolkit = new SqlToolkit(db);

    const agent = createSqlAgent(llm, toolkit, {
      prefix: sqlAgentPrompt,
    });

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
        if (step.action.tool === 'query-sql') {
          response.sqlQuery = step.action.toolInput;
          try {
            response.result = JSON.parse(step.observation);
          } catch {
            response.result = step.observation;
          }
        }
      }

      return response;
    } catch (error) {
      console.error('Error in getQueryResult:', error);

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
