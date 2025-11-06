import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';

/**
 * Hook personalizado para precargar rutas comunes
 * Mejora el rendimiento realizando una precarga en segundo plano
 * de las páginas a las que el usuario probablemente navegará
 */
export function useRoutePreloader() {
  const router = useRouter();

  // Función para precargar una ruta
  const preloadRoute = useCallback((href: string) => {
    // En Next.js moderno, la función prefetch está integrada en el router
    try {
      // Intentamos usar el método prefetch si está disponible
      if (router && typeof (router as any).prefetch === 'function') {
        (router as any).prefetch(href);
      }
      // Como fallback, precargamos el JavaScript directamente
      else {
        // Creamos un link con rel=prefetch para el JS de la ruta
        const linkEl = document.createElement('link');
        linkEl.rel = 'prefetch';
        linkEl.href = `${href}`;
        linkEl.as = 'document';
        document.head.appendChild(linkEl);
      }
    } catch (error) {
      console.error('Error al precargar ruta:', error);
    }
  }, [router]);

  useEffect(() => {
    // Solo ejecutar en el cliente
    if (typeof window === 'undefined') return;

    // Pequeño retraso para no interferir con la carga inicial
    const timer = setTimeout(() => {
      // Precargamos las rutas más comunes
      preloadRoute('/');
      preloadRoute('/about-me');
      preloadRoute('/contact');
    }, 2000); // Esperamos 2 segundos después de que la página esté cargada

    return () => clearTimeout(timer);
  }, [preloadRoute]);

  return { preloadRoute };
}

export default useRoutePreloader;
