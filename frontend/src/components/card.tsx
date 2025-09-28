import { BrushCleaning, CheckCircle, ShieldAlert } from 'lucide-react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

interface Props {
  status: string;
  content: string;
  confidence?: number;
  isUrgent: boolean;
  clear?: () => void;
}

const SparkCard: React.FC<Props> = ({ status, content, confidence, clear, isUrgent }) => {
  return (
    <div className="relative shadow-2xl">
      <div className="rounded-2xl border border-neutral-700 bg-neutral-900 p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500"></div>
            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
          </div>
          <div className="text-sm text-slate-400">SparkAI Pro</div>
        </div>
        <div className="space-y-3 rounded-lg bg-neutral-800">
          <div className="flex items-center justify-between rounded-lg bg-neutral-800 p-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="font-light">
                Email classificado como:{' '}
                <span
                  className={cn(
                    'font-semibold',
                    { 'text-green-400': status === 'Produtivo' },
                    { 'text-amber-300': status === 'Improdutivo' }
                  )}
                >
                  {status}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              {isUrgent && (
                <Badge className="bg-red-500/10 text-red-400">
                  <ShieldAlert className="text-destructive h-5 w-5" />
                  <p>urgente</p>
                </Badge>
              )}
              {confidence && (
                <Badge
                  className={cn(
                    'text-destructive bg-green-500/10',
                    { 'text-green-400': confidence >= 0.7 },
                    { 'text-amber-300': confidence < 0.7 && confidence >= 0.5 }
                  )}
                >
                  {confidence * 100}% confiabilidade
                </Badge>
              )}
            </div>
            <div className="absolute top-2 right-2 flex gap-2">
              <Button type="button" onClick={clear} variant="ghost" size="icon">
                <BrushCleaning className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Separator />
          <div className="relative rounded-lg bg-neutral-800 p-3">
            <div className="rounded p-3 text-sm font-light">{content}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SparkCard;
