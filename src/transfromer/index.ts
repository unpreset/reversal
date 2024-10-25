import { maps } from '../maps'
import { toArray } from '../utils'
import type { AtomicComposed, CssValueParsed, CssValueParsedMeta, DynamicPropAtomicMap, StaticPropAtomicMap, TransfromOptions } from '../types'

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

export function transfromParsed(parsed: CssValueParsed, options: TransfromOptions = {}) {
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
  })
}

function analyzeMeta(bundle: {
  meta: CssValueParsed['meta']
  key: string
  prop: string
}): string[] {
  const { meta, key, prop } = bundle
  const atomics: string[] = []

  for (const m of meta) {
    if (Array.isArray(m)) {

    }
    else {
      if (m.unit === 'px' && /^\d+$/.test(m.value as string)) {
        if (nonTransfromPxProps.some(p => prop.includes(p))) {
          atomics.push(`${key}-[${m.value}${m.unit}]`)
        }
        else {
          atomics.push(`${key}-${Number(m.value) / 4}`)
        }
      }
    }
  }

  return atomics
}
