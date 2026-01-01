import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useSagesStore = create(
  persist(
    (set, get) => ({
      currentSage: null,
      sageHistory: [],

      selectSage: (sageId) => set({ currentSage: sageId }),
      addHistory: (sageId) => set((state) => ({
        sageHistory: [sageId, ...state.sageHistory.slice(0, 9)]
      })),

      // Sync hooks
      importData: (data) => set(data),
      exportData: () => get()
    }),
    {
      name: 'irim-sages-store',
      version: 1
    }
  )
);

export default useSagesStore;
