import { SqlDatabaseChain } from 'langchain/chains/sql_db';
import { SqlDatabase } from 'langchain/sql_db';
import { ChatOpenAI } from '@langchain/openai';
import { AppDataSource } from '@/configs/database';
import { z } from 'zod';

class QueryService {
  private chain: SqlDatabaseChain | null = null;

  async initialize() {
    if (this.chain) return;

    const llm = new ChatOpenAI({
      temperature: 0,
      model: 'gpt-4o',
    });

    const db = await SqlDatabase.fromDataSourceParams({
      appDataSource: AppDataSource,
    });

    this.chain = new SqlDatabaseChain({
      llm,
      database: db,
    });
  }

  async getQueryResult(prompt: string) {
    await this.initialize();

    const promptSchema = z.string().min(2);
    promptSchema.parse(prompt);

    const { sql } = await this.chain!.invoke({
      question: prompt,
    });

    const result = await AppDataSource.query(sql);

    return result.rows;
  }
}

export const queryService = new QueryService();
