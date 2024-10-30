import type { UnoGenerator } from '@unocss/core'
import { EmptyKeyPlaceholder } from '../constants'
import { defaultRuleMeta, dynamicRules, staticRules } from '../rules'
import { guessColorType, isColorProp, transformColor } from '../transformers/color'
import { noop, toArray } from '../utils'
import type { AtomicComposed, AtomicMeta, Colors, CssValueParsed, CssValueParsedMeta, DynamicPropAtomicMap, ProcessorContext, StaticPropAtomicMap, TransfromOptions } from '../types'

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

}

export function analyzePared(parsed: CssValueParsed, uno: UnoGenerator, options: TransfromOptions = {}) {
  const {
    shortify = false,
  } = options
  const { prop, meta } = parsed
  let { key, meta: ruleMeta } = findKeyMeta(prop, shortify)

  if (!key)
    return
  if (ruleMeta?.keyProcessor)
    key = ruleMeta.keyProcessor(key)

  return analyzeMeta({
    prop,
    meta,
    uno,
    key: key === EmptyKeyPlaceholder ? '' : key,
    ruleMeta,
  })
}

function analyzeMeta(bundle: {
  meta: CssValueParsed['meta']
  key: string
  prop: string
  uno: UnoGenerator
  ruleMeta?: AtomicMeta
}): string[] {
  const { meta, key, prop, uno, ruleMeta } = bundle
  const { separator, valueProcessor } = Object.assign({}, defaultRuleMeta, ruleMeta ?? {})
  const atomics: string[] = []

  for (const m of meta) {
    let token: string | undefined

    if (Array.isArray(m.value)) {
      if (m.type === 'Function') {
        if (m.fname === 'var') {
          token = m.value.map(v => (v.value as string).trim()).join('').replace(/^--/, '$')
        }
        else {
          token = `[${m.raw.replace(/\s/g, '_')}]`
        }
      }
    }
    else {
      if (m.unit === 'px' && /^\d+$/.test(m.value as string)) {
        if (nonTransfromPxProps.some(p => prop.includes(p))) {
          token = `${m.value}${m.unit}`
        }
        else {
          token = `${Number(m.value) / 4}`
        }
      }

      else if (isColorProp(prop) || m.type === 'Hash' || guessColorType(m.raw) != null) {
        const themeKey = transformColor(m.value as string, uno)
        if (themeKey) {
          token = themeKey
        }
        else {
          token = m.value
        }
      }

      else if (m.type === 'Identifier') {
        token = m.value
      }
      else if (m.type === 'Percentage') {
        if (m.value === '100') {
          token = 'full'
        }
        else {
          token = `${m.value}%`
        }
      }

      else {
        token = m.raw
      }
    }

    if (token) {
      token = valueProcessor(token, { uno })
      atomics.push(`${key}${separator}${token}`)
    }
  }

  return atomics
}

function findKeyMeta(prop: string, shortify = false) {
  let key: string | undefined
  let atomics: AtomicComposed | undefined
  let rule: StaticPropAtomicMap | DynamicPropAtomicMap | undefined
  let meta: AtomicMeta | undefined

  for (const r of staticRules) {
    if (prop === r[0]) {
      rule = r
      atomics = toArray((r as StaticPropAtomicMap)[1]) as AtomicComposed
      break
    }
  }

  if (!rule) {
    for (const r of dynamicRules) {
      const match = prop.match(r[0])
      if (match) {
        rule = r
        atomics = toArray(r[1](match)) as AtomicComposed
        break
      }
    }
  }

  if (atomics && rule) {
    if (shortify) {
      key = atomics[1] || atomics[0]
    }
    else {
      key = atomics[0]
    }
    meta = rule[2]
  }

  return { key, meta }
}
