'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

/**
 * Componente que inicializa los stores de Zustand
 * al cargar la aplicación
 */
export function StoreInitializer() {
  const fetchTitle = useAppStore(state => state.fetchTitle);
  
  useEffect(() => {
    // Inicializar el store de la aplicación
    fetchTitle();
  }, [fetchTitle]);
  
  // Este componente no renderiza nada
  return null;
}

export default StoreInitializer;
