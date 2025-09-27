export interface Stats {
  total: number;
  productive: number;
  unproductive: number;
}
export interface ClassificationResult {
  category: string;
  confidence: number;
  suggested_response: string;
  is_urgent: boolean;
}

export interface EmailContextType {
  classifyByText: (text: string) => void;
  classifyByFile: (file: File) => void;
  loading: boolean;
  result: ClassificationResult | null;
  removeResult: () => void;
}

export interface EmailProviderProps {
  children: React.ReactNode;
}
