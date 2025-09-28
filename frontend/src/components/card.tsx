import { BrushCleaning, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';

interface Props {
  status: string;
  content: string;
  confidence?: number;
  clear?: () => void;
}

const SparkCard: React.FC<Props> = ({ status, content, confidence, clear }) => {
  return (
    <div className="relative shadow-2xl">
      <div className="rounded-2xl border border-neutral-700 bg-neutral-900 p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500"></div>
            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
          </div>
          <div className="text-sm text-slate-400">EmailAI Pro</div>
        </div>
        <div className="space-y-3 rounded-lg bg-neutral-800">
          <div className="flex items-center justify-between rounded-lg bg-neutral-800 p-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="font-light">
                Email classified as: <span className="font-semibold text-green-400">{status}</span>
              </span>
            </div>
            {confidence && (
              <Badge className="bg-green-500/10 text-green-400">
                {confidence * 100}% confidence
              </Badge>
            )}
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
