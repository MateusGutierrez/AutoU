import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type {
  ClassificationResponse,
  EmailContextType,
  EmailProviderProps,
  Stats,
} from './interface';

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8000/api/v1';

const EmailContext = createContext<EmailContextType | undefined>(undefined);
export const EmailProvider = ({ children }: EmailProviderProps) => {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    productive: 0,
    unproductive: 0,
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ClassificationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateStats = useCallback((category: 'productive' | 'unproductive') => {
    setStats(prev => ({
      total: prev.total + 1,
      productive: prev.productive + (category === 'productive' ? 1 : 0),
      unproductive: prev.unproductive + (category === 'unproductive' ? 1 : 0),
    }));
  }, []);

  const classifyEmail = useCallback(
    async (emailData: Record<string, any>) => {
      setLoading(true);
      setError(null);
      setResult(null);

      try {
        const res = await fetch(`${API_BASE}/classify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(emailData),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.detail || 'Erro ao classificar email');
        }

        const data: ClassificationResponse = await res.json();
        setResult(data);
        updateStats(data.classification.category);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro inesperado');
      } finally {
        setLoading(false);
      }
    },
    [API_BASE, updateStats]
  );

  const classifyFromFile = useCallback(
    async (formData: FormData) => {
      setLoading(true);
      setError(null);
      setResult(null);

      try {
        const res = await fetch(`${API_BASE}/classify-file`, {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.detail || 'Erro ao processar arquivo');
        }

        const data: ClassificationResponse = await res.json();
        setResult(data);
        updateStats(data.classification.category);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro inesperado');
      } finally {
        setLoading(false);
      }
    },
    [API_BASE, updateStats]
  );

  const value: EmailContextType = useMemo(
    () => ({
      stats,
      loading,
      result,
      error,
      classifyEmail,
      classifyFromFile,
      resetResult: () => setResult(null),
      resetError: () => setError(null),
    }),
    [stats, loading, result, error, classifyEmail, classifyFromFile]
  );

  return <EmailContext.Provider value={value}>{children}</EmailContext.Provider>;
};
export const useEmail = (): EmailContextType => {
  const ctx = useContext(EmailContext);
  if (!ctx) {
    throw new Error('useEmail deve ser usado dentro de <EmailProvider>');
  }
  return ctx;
};
