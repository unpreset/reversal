import type { AtomicComposed, DynamicPropAtomicMap, PropsAtomicMap, StaticPropAtomicMap } from '../types'

export const position = ['top', 'bottom', 'left', 'right']
export const positionShort = ['t', 'b', 'l', 'r']

export const positions: PropsAtomicMap[] = [
  ...position.map<StaticPropAtomicMap>((p, i) => [p, [p, positionShort[i]]]),
]

export function createPos4Props(prop: string, atom: string, shortAtom?: string): DynamicPropAtomicMap {
  return [
    new RegExp(`^${prop}-(top|bottom|left|right)(?:-\\w+)?$`),
    ([, p]) => {
      const index = position.indexOf(p)
      if (index > -1) {
        return [atom, shortAtom].filter(Boolean).map(s => `${s}-${positionShort[index]}`) as AtomicComposed
      }
    },
  ]
}
