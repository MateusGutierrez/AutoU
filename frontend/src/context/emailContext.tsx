import { createContext, useCallback } from 'react';
import type { EmailContextType, EmailProviderProps } from './interface';
import { api } from '@/api';
import { toast } from 'sonner';
import { useEmailStore, type HistoryType } from '@/store';

export const EmailContext = createContext({} as EmailContextType);
export const EmailProvider = ({ children }: EmailProviderProps) => {
  const {addToHistory, setLoading, setResult} = useEmailStore()

  const classifyByText = useCallback(async (text: string) => {
    try {
      setLoading(true);
      const response = await api.post('/classify-text', { text });
      setResult(response.data);
      const historyData:HistoryType = {
          status: response.data.category,
          confidence: response.data.confidence,
          content: response.data.suggested_response,
          is_urgent: response.data.is_urgent,
          type: 'text'
      }
      addToHistory(historyData)
    } catch (error) {
      toast.error('Error while classifing text', {
        description: `Please enter text or select a file, error: ${error}`,
      });
    } finally {
      setLoading(false);
    }
  }, [addToHistory, setLoading, setResult]);
  const classifyByFile = useCallback(async (file: File) => {
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
        const historyData:HistoryType = {
          status: response.data.category,
          confidence: response.data.confidence,
          content: response.data.suggested_response,
          is_urgent: response.data.is_urgent,
          type: 'file'
      }
      addToHistory(historyData)
    } catch (error) {
      toast.error('Error while classifing file', {
        description: `Please enter text or select a file:${error}`,
      });
    } finally {
      setLoading(false);
    }
  }, [addToHistory, setLoading, setResult]);
  const removeResult = useCallback(() => {
    setResult(null);
    setLoading(false);
  }, [setResult, setLoading]);
  return (
    <EmailContext.Provider
      value={{
        classifyByText,
        classifyByFile,
        removeResult,
      }}
    >
      {children}
    </EmailContext.Provider>
  );
};
