
export interface Stats {
  total: number;
  productive: number;
  unproductive: number;
}

export interface ClassificationResponse {
  classification: {
    category: "productive" | "unproductive";
    confidence: number;
  };
  [key: string]: any;
}

export interface EmailContextType {
  stats: Stats;
  loading: boolean;
  result: ClassificationResponse | null;
  error: string | null;
  classifyEmail: (emailData: Record<string, any>) => Promise<void>;
  classifyFromFile: (formData: FormData) => Promise<void>;
  resetResult: () => void;
  resetError: () => void;
}

export interface EmailProviderProps {
  children: React.ReactNode;
}
