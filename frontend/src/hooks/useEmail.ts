import { EmailContext } from '@/context/emailContext';
import type { EmailContextType } from '@/context/interface';
import { useContext } from 'react';

export const useEmail = (): EmailContextType => {
  const ctx = useContext(EmailContext);
  if (!ctx) {
    throw new Error('useEmail deve ser usado dentro de <EmailProvider>');
  }
  return ctx;
};
