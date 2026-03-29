/**
 * Convierte un string normal en un slug URL-friendly y SEO-friendly.
 * Preserva "ñ", "á", "é", "í", "ó", "ú" eliminando sus acentos (convirtiéndolos a caracteres base)
 * antes de aplicar la limpieza regex.
 * Si el resultado termina siendo vacío (ej: solo emojis), genera un fallback único.
 *
 * Ej: "Maquillaje de Año Nuevo!!!" -> "maquillaje-de-ano-nuevo"
 *     "Sesión Fotográfica"       -> "sesion-fotografica"
 *     "😎😎😎"                   -> "untitled-b2a1..."
 */
export function generateSlug(text: string): string {
  const result = (text || '')
    .normalize('NFD') // Separa las letras de sus acentos (ej: "á" -> "a" + "´")
    .replace(/[\u0300-\u036f]/g, '') // Elimina los acentos (los caracteres diacríticos)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Elimina todo lo que no sea ascii a-z, números, espacios o guiones
    .replace(/\s+/g, '-') // Reemplaza espacios por guiones
    .replace(/-+/g, '-') // Elimina guiones duplicados consecutivos
    .replace(/(^-|-$)/g, '') // Elimina guiones al principio y al final

  if (!result || result === '') {
    return `untitled-${Math.random().toString(36).substring(2, 9)}`
  }

  return result
}
