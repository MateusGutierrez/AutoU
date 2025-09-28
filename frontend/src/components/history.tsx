import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Check, FileText, TextInitial, X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useEmailStore } from '@/store';
import { useState } from 'react';

const History = () => {
  const { history } = useEmailStore();
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const toggleRowExpansion = (index: number) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(index)) {
      newExpandedRows.delete(index);
    } else {
      newExpandedRows.add(index);
    }
    setExpandedRows(newExpandedRows);
  };

  return (
    <div className="rounded-xl border p-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Classificação</TableHead>
            <TableHead className="text-start">É urgente ?</TableHead>
            <TableHead className="min-w-[400px]">Conteúdo</TableHead>
            <TableHead className="text-center">Confiabilidade</TableHead>
            <TableHead className="text-center"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map((message, index) => (
            <TableRow key={index} className="h-auto">
              <TableCell
                className={cn(
                  'py-4 text-start align-top font-medium',
                  { 'text-emerald-600': message.status === 'Produtivo' },
                  { 'text-amber-300': message.status === 'Improdutivo' }
                )}
              >
                {message.status}
              </TableCell>
              <TableCell className="py-4 text-start align-top">
                {String(message.is_urgent) === 'true' ? (
                  <Check className="text-emerald-600" />
                ) : (
                  <X className="text-destructive" />
                )}
              </TableCell>
              <TableCell className="max-w-[400px] py-4">
                <div className="space-y-2">
                  <div
                    className={cn(
                      'text-sm leading-relaxed break-words whitespace-pre-wrap',
                      !expandedRows.has(index) && message.content.length > 200 && 'line-clamp-4'
                    )}
                  >
                    {expandedRows.has(index)
                      ? message.content
                      : message.content.length > 200
                        ? message.content
                        : message.content}
                  </div>
                  {message.content.length > 200 && (
                    <button
                      onClick={() => toggleRowExpansion(index)}
                      className="text-primary hover:text-primary-800 text-xs font-medium underline"
                    >
                      {expandedRows.has(index) ? 'Ver menos' : 'Ver mais'}
                    </button>
                  )}
                </div>
              </TableCell>
              <TableCell
                className={cn(
                  'text-destructive text-center',
                  { 'text-green-400': message.confidence >= 0.7 },
                  { 'text-amber-300': message.confidence < 0.7 && message.confidence >= 0.5 }
                )}
              >
                {message.confidence * 100}%
              </TableCell>
              <TableCell className="text-center">
                <Tooltip>
                  <TooltipTrigger>
                    {message.type === 'text' ? <TextInitial /> : <FileText />}
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{message.type}</p>
                  </TooltipContent>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default History;
