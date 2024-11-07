import type { DynamicPropAtomicMap, StaticPropAtomicMap } from '../types'
import { border } from './border'
import { colors } from './color'
import { displays } from './display'
import { positions } from './position'
import { sizes } from './size'
import { spacing } from './spacing'

export const rules = [
  border,
  positions,
  spacing,
  colors,
  sizes,
  displays,
].flat(1)

export const staticRules: StaticPropAtomicMap[] = []
export const dynamicRules: DynamicPropAtomicMap[] = []

export const defaultRuleMeta = {
  separator: '-',
  valueProcessor: (v: string) => v,
}

for (const rule of rules) {
  if (typeof rule[0] === 'string') {
    staticRules.push(rule as StaticPropAtomicMap)
  }
  else {
    dynamicRules.push(rule as DynamicPropAtomicMap)
  }
}
