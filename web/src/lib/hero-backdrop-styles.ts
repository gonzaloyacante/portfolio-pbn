/**
 * Estilos dinámicos del hero inmersivo (degradado lateral / tint) desde valores CMS.
 * Anchura recomendada en layout: `min(100dvw, 100%)` para evitar overflow por scrollbar vs `100vw`.
 */

export function isHeroBackdropVideoUrl(url: string, kind: string | null | undefined): boolean {
  if (kind === 'video') return true
  if (kind === 'image') return false
  return /\/video\/upload\//.test(url) || /\.(mp4|webm|mov|m4v)(\?[^#]*)?$/i.test(url)
}

function hexToRgba(hex: string, alpha: number): string {
  const m = /^#([A-Fa-f0-9]{6})$/.exec(hex.trim())
  if (!m) return `rgba(0,0,0,${alpha})`
  const n = Number.parseInt(m[1], 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  return `rgba(${r},${g},${b},${alpha})`
}

function mixForeground(opacityPercent: number, alphaMul: number): string {
  const pct = Math.round(Math.min(100, Math.max(0, opacityPercent * alphaMul)))
  return `color-mix(in srgb, var(--foreground) ${pct}%, transparent)`
}

export function buildHeroScrimBackground(opts: {
  edge: string
  extentPercent: number
  opacityPercent: number
  featherPercent: number
  colorLightHex: string | null | undefined
  colorDarkHex: string | null | undefined
  prefersDark: boolean
}): string | undefined {
  const { edge, extentPercent, opacityPercent, featherPercent } = opts
  if (edge === 'none') return undefined

  const extent = Math.min(100, Math.max(5, extentPercent))
  const feather = Math.min(100, Math.max(0, featherPercent))
  const op = Math.min(1, Math.max(0, opacityPercent / 100))

  const colorHex =
    opts.prefersDark && opts.colorDarkHex && opts.colorDarkHex.length === 7
      ? opts.colorDarkHex
      : opts.colorLightHex && opts.colorLightHex.length === 7
        ? opts.colorLightHex
        : null

  const solidStart = colorHex ? hexToRgba(colorHex, op) : mixForeground(opacityPercent, 1)
  const midTone = colorHex ? hexToRgba(colorHex, op * 0.38) : mixForeground(opacityPercent, 0.38)

  const softness = Math.max(0.08, feather / 120)
  const softStop = `${Math.min(extent - 0.25, extent * softness)}%`

  if (edge === 'left') {
    return `linear-gradient(90deg, ${solidStart} 0%, ${midTone} ${softStop}, transparent ${extent}%)`
  }
  if (edge === 'right') {
    return `linear-gradient(270deg, ${solidStart} 0%, ${midTone} ${softStop}, transparent ${extent}%)`
  }
  if (edge === 'both') {
    const half = extent / 2
    const softHalf = `${Math.min(half - 0.25, half * softness)}%`
    const edgeMid = colorHex ? hexToRgba(colorHex, op * 0.42) : mixForeground(opacityPercent, 0.42)
    return `linear-gradient(90deg, ${solidStart} 0%, ${edgeMid} ${softHalf}, transparent ${half}%, transparent ${100 - half}%, ${edgeMid} calc(100% - ${softHalf}), ${solidStart} 100%)`
  }
  return undefined
}

export function buildHeroBackdropTint(opacityPercent: number): string | undefined {
  if (opacityPercent <= 0) return undefined
  const o = Math.min(1, Math.max(0, opacityPercent / 100))
  return `rgba(0,0,0,${o})`
}
