'use client';

import { useEffect, useState } from 'react';

/**
 * Componente que muestra un indicador visual del entorno actual
 * Solo visible en entorno de desarrollo
 */
export default function EnvIndicator() {
  const [environment, setEnvironment] = useState<string | null>(null);
  
  useEffect(() => {
    // Asegurarnos de que estamos en el cliente
    if (typeof window !== 'undefined') {
      setEnvironment(process.env.NEXT_PUBLIC_VERCEL_ENV || 'local');
    }
  }, []);

  // No mostrar nada en producción
  if (environment === 'production' || !environment) {
    return null;
  }

  return (
    <div className="fixed bottom-2 right-2 bg-amber-600 text-white text-xs px-2 py-1 rounded-md shadow-md z-50 opacity-80 hover:opacity-100 transition-opacity">
      {environment.toUpperCase()}
    </div>
  );
}
