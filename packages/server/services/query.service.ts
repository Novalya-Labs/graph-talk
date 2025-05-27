import { SqlDatabase } from 'langchain/sql_db';
import { ChatOpenAI } from '@langchain/openai';
import { AppDataSource } from '@/configs/database';
import { z } from 'zod';
import { Env } from '@/configs/env';
import { sqlAgentPrompt } from '@/prompts/sql-agent';
import { analysisService } from '@/services/analysis.service';
import type { EnhancedQueryResponse } from '@/types/analysis.types';

class QueryService {
  private db: SqlDatabase | null = null;

  async initialize() {
    if (this.db) return;

    this.db = await SqlDatabase.fromDataSourceParams({
      appDataSource: AppDataSource,
      includesTables: ['user', 'product', 'order', 'order_item'],
      customDescription: {
        user: 'Table name: "user" (must be quoted). Contains user information with columns: id (integer), name (varchar), email (varchar). Example: SELECT name, email FROM "user" LIMIT 10;',
        product:
          'Table name: "product". Contains product information with columns: id (integer), name (varchar), description (varchar), price (decimal). Example: SELECT name, price FROM "product" WHERE price > 100;',
        order:
          'Table name: "order" (must be quoted). Contains order information with columns: id (integer), userId (integer), createdAt (date). Example: SELECT * FROM "order" LIMIT 10;',
        order_item:
          'Table name: "order_item". Contains order item information with columns: id (integer), orderId (integer), productId (integer), quantity (integer). Example: SELECT * FROM "order_item" LIMIT 10;',
      },
    });
  }

  async getQueryResult(prompt: string): Promise<EnhancedQueryResponse> {
    const startTime = Date.now();

    await this.initialize();

    if (!this.db) throw new Error('Database not initialized');

    const promptSchema = z.string().min(2);
    promptSchema.parse(prompt);

    const llm = new ChatOpenAI({
      temperature: 0,
      model: 'gpt-4o-mini',
      apiKey: Env.OPENAI_API_KEY,
      maxTokens: 1000,
    });

    try {
      const sqlGenerationPrompt = sqlAgentPrompt(prompt);

      const sqlResponse = await llm.invoke(sqlGenerationPrompt);
      let sqlQuery = sqlResponse.content as string;

      sqlQuery = sqlQuery
        .trim()
        .replace(/^```sql\s*/, '')
        .replace(/\s*```$/, '');

      const result = await this.db.run(sqlQuery);
      const parsedResult = JSON.parse(result);

      const executionTime = Date.now() - startTime;

      const enhancedResponse = await analysisService.analyzeQueryResult(prompt, sqlQuery, parsedResult, executionTime);

      return enhancedResponse;
    } catch (error) {
      console.error('Error in getQueryResult:', error);
      const executionTime = Date.now() - startTime;

      return await analysisService.analyzeQueryResult(
        prompt,
        '',
        { error: `Query execution failed: ${error instanceof Error ? error.message : 'Unknown error'}` },
        executionTime,
      );
    }
  }
}

export const queryService = new QueryService();
