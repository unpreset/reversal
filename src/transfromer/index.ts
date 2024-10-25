import { Magicolor } from '@magic-color/core'
import type { UnoGenerator } from '@unocss/core'
import { maps } from '../maps'
import { toArray } from '../utils'
import type { AtomicComposed, Colors, CssValueParsed, CssValueParsedMeta, DynamicPropAtomicMap, StaticPropAtomicMap, TransfromOptions } from '../types'

const atomicCache: Record<string, string[]> = {}

const nonTransfromPxProps = [
  'border',
]

/**
 * 将 CssValueParsedMeta[] 转换为 atomic css
 * @param meta CssValueParsedMeta[]
 * @returns
 */
export function transfrom(metas: CssValueParsedMeta[], options: TransfromOptions = {}): string[] {
  const atomics: string[] = []
}

export function transfromParsed(parsed: CssValueParsed, uno: UnoGenerator, options: TransfromOptions = {}) {
  let key: string | undefined

  const {
    shortify = false,
  } = options
  const { prop, meta } = parsed

  for (const map of maps) {
    let atomics: AtomicComposed | undefined

    if (typeof map[0] === 'string') {
      if (prop === map[0]) {
        atomics = toArray((map as StaticPropAtomicMap)[1]) as AtomicComposed
      }
    }

    else {
      const match = prop.match(map[0])
      if (match) {
        const matched = (map as DynamicPropAtomicMap)[1](match)
        if (matched) {
          atomics = toArray(matched) as AtomicComposed
        }
      }
    }

    if (atomics) {
      if (shortify) {
        key = atomics[1] || atomics[0]
      }
      else {
        key = atomics[0]
      }
      break
    }
  }

  if (!key) {
    return
  }

  return analyzeMeta({
    prop,
    meta,
    key,
    uno,
  })
}

function analyzeMeta(bundle: {
  meta: CssValueParsed['meta']
  key: string
  prop: string
  uno: UnoGenerator
}): string[] {
  const { meta, key, prop, uno } = bundle
  const atomics: string[] = []

  for (const m of meta) {
    if (Array.isArray(m)) {

    }
    else {
      if (m.unit === 'px' && /^\d+$/.test(m.value as string)) {
        if (nonTransfromPxProps.some(p => prop.includes(p))) {
          atomics.push(`${key}-${m.value}${m.unit}`)
        }
        else {
          atomics.push(`${key}-${Number(m.value) / 4}`)
        }
      }
      else if (isColorProp(prop)) {
        const colorKey = analyzeColor(m.value as string, uno)
        if (colorKey) {
          atomics.push(`${key}-${colorKey}`)
        }
        else {
          atomics.push(`${key}-[${m.value}]`)
        }
      }
    }
  }

  return atomics
}

function isColorProp(prop: string): boolean {
  return prop.includes('color') || ['fill', 'stroke'].includes(prop)
}

function analyzeColor(color: string, uno: UnoGenerator): string | undefined {
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
    const colors = hexable((uno.config.theme as any).colors)
    let hexColor
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
  }
}
