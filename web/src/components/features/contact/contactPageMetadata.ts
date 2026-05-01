import type { Metadata } from 'next'
import { generateContactPageMetadata } from './public/contactPageMetadata'

export async function getContactPageMetadata(): Promise<Metadata> {
  // Alias de compatibilidad: mantener un solo generador real en /public.
  return generateContactPageMetadata()
}
