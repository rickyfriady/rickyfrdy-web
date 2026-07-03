const GRADIENT_PRESETS = ['Prism', 'Lava', 'Plasma', 'Pulse', 'Vortex', 'Mist'] as const

export type GradientPreset = (typeof GRADIENT_PRESETS)[number]

export function gradientPresetFor(slug: string): GradientPreset {
  let hash = 0
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0
  }
  return GRADIENT_PRESETS[hash % GRADIENT_PRESETS.length]
}
