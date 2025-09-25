import { Check, CheckCircle, Copy } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';

interface Props {
  status: string;
  content: string;
  confidence?: string;
}

const SparkCard: React.FC<Props> = ({ status, content, confidence }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(
      '"Hello! We have received your request and it is being processed. You will receive an update within 24 hours..."'
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative shadow-2xl">
      <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="text-slate-400 text-sm">EmailAI Pro</div>
        </div>
        <div className="space-y-3 bg-neutral-800 rounded-lg">
          <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-800">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="font-light">
                Email classified as: <span className="text-green-400 font-semibold">{status}</span>
              </span>
            </div>
            {confidence && (
              <Badge className="bg-green-500/10 text-green-400">{confidence}% confidence</Badge>
            )}
          </div>
          <Separator />

          <div className="p-3 bg-neutral-800 rounded-lg relative">
            <div className="font-light text-sm p-3 rounded">{content}</div>
            <Button
              onClick={handleCopy}
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
            >
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SparkCard;
