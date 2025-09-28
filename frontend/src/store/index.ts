import historyData from '@/utils/useHistoryData';
import { create } from 'zustand';
import type { EmailStore, HistoryType } from './interface';

export const useEmailStore = create<EmailStore>()(set => ({
  result: null,
  history: historyData,
  loading: false,

  setResult: result => set(() => ({ result })),

  clearResult: () =>
    set(() => ({
      result: null,
      loading: false,
    })),

  setLoading: loading => set(() => ({ loading })),

  addToHistory: (value: HistoryType) =>
    set(state => ({
      history: [value, ...state.history],
    })),
}));
