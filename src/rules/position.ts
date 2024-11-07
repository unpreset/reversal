import type { AtomicComposed, DynamicPropAtomicMap, PropsAtomicMap, StaticPropAtomicMap } from '../types'
import { EmptyKeyPlaceholder } from '../constants'

export const position = ['top', 'bottom', 'left', 'right']
export const positionShort = ['t', 'b', 'l', 'r']

export const positions: PropsAtomicMap[] = [
  ...position.map<StaticPropAtomicMap>(p => [p, p]),
  ['position', EmptyKeyPlaceholder, { separator: '' }],
  ['z-index', 'z'],
]

export function createPos4Props(prop: string, atom: string, shortAtom?: string): DynamicPropAtomicMap {
  return [
    new RegExp(`^${prop}-(top|bottom|left|right)(?:-\\w+)?$`),
    ([, p]) => {
      const index = position.indexOf(p)
      return [atom, shortAtom].filter(Boolean).map(s => `${s}-${positionShort[index]}`) as AtomicComposed
    },
  ]
}
