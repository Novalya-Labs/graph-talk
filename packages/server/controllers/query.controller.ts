import { Request, Response } from 'express';
import { queryService } from '@/services/query.service';
import { AppDataSource } from '@/configs/database';

class QueryController {
  async handleQuery(req: Request, res: Response) {
    const { prompt } = req.body;

    if (!prompt) return res.status(400).json({ error: 'Prompt manquant.' });

    try {
      const sql = await queryService.getQueryResult(prompt);

      if (!/^select\s/i.test(sql.trim())) {
        return res.status(400).json({ error: 'Requête non autorisée.' });
      }

      const [rows] = await AppDataSource.query(sql);

      res.json({
        rawSql: sql,
        data: rows,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erreur lors de la génération ou l'exécution SQL." });
    }
  }
}

export const queryController = new QueryController();
