import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Code } from 'lucide-react';
import type { AiChatMessage } from '../aiChatType';

interface SqlResultDisplayProps {
  message: AiChatMessage;
}

export const SqlResultDisplay = ({ message }: SqlResultDisplayProps) => {
  const { userPrompt, response } = message;
  const { sqlQuery, result } = response;

  const isError = !Array.isArray(result);
  const data = Array.isArray(result) ? result : [];

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Code className="size-4" />
          Requête: {userPrompt}
        </CardTitle>
        <div className="text-xs text-muted-foreground font-mono bg-muted p-2 rounded">{sqlQuery}</div>
      </CardHeader>

      <CardContent>
        {isError ? (
          <div className="text-red-500 text-sm">
            <Badge variant="destructive" className="mb-2">
              Erreur
            </Badge>
            <p>{(result as { error: string }).error}</p>
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
            </div>

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
          </div>
        )}
      </CardContent>
    </Card>
  );
};
