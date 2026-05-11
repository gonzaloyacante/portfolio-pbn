/**
 * ISR para rutas públicas segmentadas (`page.tsx`, portfolio lista/detalle, servicio detalle).
 *
 * - Tras guardar en CMS, las Server Actions / API deben seguir llamando `revalidatePath` /
 *   `revalidateTag` para invalidar lo necesario.
 * - Sin preview draft: un visitante puede ver contenido cacheado hasta **este intervalo**
 *   salvo invalidación explícita.
 *
 * Valor único aquí para documentación y referencia. En `page.tsx` públicos usar literal
 * `export const revalidate = 60` (Next 16 exige valor estático analizable; importar esta
 * constante rompe el build con error de segment config).
 */
export const PUBLIC_SEGMENT_REVALIDATE_SECONDS = 60
