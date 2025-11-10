import { create } from 'zustand';
import { settingsService } from '@/lib/services/settings';

// Definir el tipo del estado
interface AppState {
  title: string;
  isLoading: boolean;
  error: string | null;
  
  // Acciones
  setTitle: (title: string) => void;
  fetchTitle: () => Promise<void>;
}

// Crear el store con Zustand
export const useAppStore = create<AppState>((set) => ({
  title: 'Portfolio',
  isLoading: false,
  error: null,
  
  // Establecer el título
  setTitle: (title) => set({ title }),
  
  // Cargar el título desde Firestore
  fetchTitle: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const s = await settingsService.get();
      if (s) set({ title: s.title, isLoading: false });
      else set({ isLoading: false });
    } catch (error) {
      console.error('Error fetching title:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Unknown error fetching title',
        isLoading: false 
      });
    }
  },
}));
