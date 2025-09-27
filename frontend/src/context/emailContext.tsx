import { createContext, useState, useCallback } from 'react';
import type { ClassificationResult, EmailContextType, EmailProviderProps } from './interface';
import { api } from '@/api';

export const EmailContext = createContext({} as EmailContextType);
export const EmailProvider = ({ children }: EmailProviderProps) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const classifyByText = useCallback(
    async (text: string) => {
      try {
        setLoading(true);
        const response = await api.post('/classify-text', { text });
        setResult(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    [result]
  );
  const classifyByFile = useCallback(
    async (file: File) => {
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/classify-file', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setResult(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    [result]
  );
  const removeResult = useCallback(() => {
    setResult(null);
  }, [result]);
  return (
    <EmailContext.Provider
      value={{
        classifyByText,
        classifyByFile,
        loading,
        result,
        removeResult,
      }}
    >
      {children}
    </EmailContext.Provider>
  );
};
