import { guessType, Magicolor } from '@magic-color/core'
import type { UnoGenerator } from '@unocss/core'
import type { Colors } from '../types'

const HexUnoColorMap = new WeakMap<UnoGenerator, Colors>()

export function transformColor(color: string, uno: UnoGenerator) {
  const hexable = (theme: object) => {
    return Object.entries(theme).reduce((acc, [key, value]) => {
      if (typeof value === 'string') {
        try {
          acc[key] = new Magicolor(value).hex()
        }
        catch {
          acc[key] = value
        }
      }
      else {
        acc[key] = hexable(value)
      }
      return acc
    }, {} as Colors)
  }

  if ((uno.config.theme as any).colors) {
    let colors: Colors
    let hexColor

    if (HexUnoColorMap.has(uno)) {
      colors = HexUnoColorMap.get(uno)!
    }
    else {
      colors = hexable((uno.config.theme as any).colors)
      HexUnoColorMap.set(uno, colors)
    }

    try {
      hexColor = new Magicolor(color).hex()
    }
    catch {
      return
    }

    const paths = findColorPath(colors, hexColor)

    if (paths && paths.length > 0) {
      const last = paths[paths.length - 1]
      if (last === 'DEFAULT') {
        paths.pop()
      }
      return paths.join('-')
    }
  }
}

function findColorPath(colors: Colors, targetValue: string, path: string[] = []): string[] | undefined {
  for (const key in colors) {
    const value = colors[key]
    const currentPath = [...path, key]

    if (value === targetValue) {
      return currentPath
    }

    if (typeof value === 'object' && value !== null) {
      const result = findColorPath(value, targetValue, currentPath)
      if (result) {
        return result
      }
    }
  }

  return undefined
}

export const guessColorType = guessType

export function isColorProp(prop: string): boolean {
  return prop.includes('color') || ['fill', 'stroke'].includes(prop)
}
