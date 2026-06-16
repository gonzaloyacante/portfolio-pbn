import { NEUTRAL, STATUS_COLORS } from '@/lib/design-tokens'

export const MAP_DEFAULT_ROUTE_COLOR = STATUS_COLORS.info
export const MAP_DEFAULT_CLUSTER_COLORS: [string, string, string] = [
  STATUS_COLORS.success,
  STATUS_COLORS.warning,
  STATUS_COLORS.danger,
]
export const MAP_DEFAULT_POINT_COLOR = STATUS_COLORS.info
export const MAP_CONTRAST_STROKE = NEUTRAL.white

export const defaultStyles = {
  dark: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
  light: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
}
