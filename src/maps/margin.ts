import { position, positionShort } from './position'
import type { PropsAtomicMap } from '../types'

export const margin: PropsAtomicMap[] = [
  ['margin', ['margin', 'm']],
  [/^margin-(top|bottom|left|right)(?:-\w+)?$/, ([, p]) => {
    const index = position.indexOf(p)
    return [`margin-${positionShort[index]}`, `m-${positionShort[index]}`]
  }],
]
