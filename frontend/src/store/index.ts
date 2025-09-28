import type { ClassificationResult } from '@/context/interface';
import historyData from '@/utils/useHistoryData';
import { create } from 'zustand';

export interface HistoryType {
    status: string;
    content: string;
    confidence: number;
    is_urgent: boolean;
    type: string;
}

interface EmailStore {
    result: ClassificationResult | null;
    setResult: (result: ClassificationResult | null) => void;
    loading: boolean;
    setLoading: (value: boolean) => void;
    history: HistoryType[];
    addToHistory: (value: HistoryType) => void;
    clearResult: () => void;
}

export const useEmailStore = create<EmailStore>()(
        (set, get) => ({
            result: null,
            history: historyData,
            loading: false,
            
            setResult: (result) => set(() => ({ result })),
            
            clearResult: () => set(() => ({ 
                result: null, 
                loading: false 
            })),
            
            setLoading: (loading) => set(() => ({ loading })),
            
            addToHistory: (value: HistoryType) => 
                set((state) => ({ 
                    history: [value, ...state.history]
                })),
            
        }
    )
);