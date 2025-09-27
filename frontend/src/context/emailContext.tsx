import { createContext, useState, useCallback } from 'react';
import type { ClassificationResult, EmailContextType, EmailProviderProps } from './interface';
import { api } from '@/api';

export const EmailContext = createContext({} as EmailContextType);
export const EmailProvider = ({ children }: EmailProviderProps) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const classifyByText = useCallback(async (text: string) => {
    try {
      setLoading(true);
      const response = await api.post('/classify-text', { text });
      setResult(response.data);
      console.log(result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <EmailContext.Provider
      value={{
        classifyByText,
        loading,
        result,
      }}
    >
      {children}
    </EmailContext.Provider>
  );
};
