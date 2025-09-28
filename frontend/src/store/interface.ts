import type { ClassificationResult } from '@/context/interface';

export interface HistoryType {
  status: string;
  content: string;
  confidence: number;
  is_urgent: boolean;
  type: string;
}

export interface EmailStore {
  result: ClassificationResult | null;
  setResult: (result: ClassificationResult | null) => void;
  loading: boolean;
  setLoading: (value: boolean) => void;
  history: HistoryType[];
  addToHistory: (value: HistoryType) => void;
  clearResult: () => void;
}
