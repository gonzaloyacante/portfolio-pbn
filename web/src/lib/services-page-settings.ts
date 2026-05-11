/** Texto por defecto del subtítulo en `/servicios` (antes estaba hardcodeado en la página). */
export const DEFAULT_SERVICES_PAGE_LIST_INTRO =
  'Servicios profesionales de maquillaje para cada ocasión. Desde novias hasta producciones editoriales, cada look es único y personalizado.'

export interface ServicesPageSettingsData {
  id: string
  listTitle: string | null
  listIntro: string | null
  listTitleFont: string | null
  listTitleFontUrl: string | null
  listTitleFontSize: number | null
  listTitleMobileFontSize: number | null
  listTitleColor: string | null
  listTitleColorDark: string | null
  isActive: boolean
}
