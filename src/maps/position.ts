import type { PropsAtomicMap } from '../types'

export const position = ['top', 'bottom', 'left', 'right']
export const positionShort = ['t', 'b', 'l', 'r']

export const positions: PropsAtomicMap[] = position.map((p, i) => [
  p,
  [p, positionShort[i]],
])
