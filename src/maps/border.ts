import { position, positionShort } from './position'
import type { PropsAtomicMap } from '../types'

export const border: PropsAtomicMap[] = [
  ['border', ['border', 'b']],
  [/^border-(top|bottom|left|right)(?:-\w+)?$/, ([, p]) => {
    const index = position.indexOf(p)
    return [`border-${positionShort[index]}`, `b-${positionShort[index]}`]
  }],
]
