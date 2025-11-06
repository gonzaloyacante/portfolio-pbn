'use client';

import { useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { ToastAction } from '@/components/ui/toast';

export function ServiceWorkerRegistration() {
  const { toast } = useToast();
  useEffect(() => {
    // Solo registrar en producción para evitar comportamientos extraños en dev (caché, pantallas en blanco)
    if (process.env.NODE_ENV !== 'production') return;
    // Verificar si el navegador soporta Service Workers
    if ('serviceWorker' in navigator) {
      let refreshing = false;

      const onControllerChange = () => {
        if (refreshing) return;
        refreshing = true;
        window.location.reload();
      };

      const showUpdateToast = (waiting: ServiceWorker | null) => {
        if (!waiting) return;
        toast({
          title: 'Nueva versión disponible',
          description: 'Hay una actualización lista. ¿Deseas actualizar ahora?',
          action: (
            <ToastAction
              altText="Actualizar"
              onClick={() => waiting.postMessage({ action: 'skipWaiting' })}
            >
              Actualizar
            </ToastAction>
          ),
        });
      };

      navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);

      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then(reg => {
            console.log('Service Worker registrado con éxito:', reg.scope);

            // SW esperando a activarse (actualización lista)
            if (reg.waiting) {
              showUpdateToast(reg.waiting);
            }

            // Detectar nuevas instalaciones
            reg.addEventListener('updatefound', () => {
              const installing = reg.installing;
              if (!installing) return;
              installing.addEventListener('statechange', () => {
                if (
                  installing.state === 'installed' &&
                  navigator.serviceWorker.controller // hay un SW activo -> esto es una update
                ) {
                  showUpdateToast(reg.waiting);
                }
              });
            });
          })
          .catch(error => {
            console.error('Error al registrar Service Worker:', error);
          });
      });

      return () => {
        navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
      };
    }
  }, []);

  return null;
}

export default ServiceWorkerRegistration;
