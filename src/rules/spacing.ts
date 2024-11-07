import type { PropsAtomicMap } from '../types'
import { createPos4Props } from './position'

export const spacing: PropsAtomicMap[] = [
  ['margin', 'm'],
  ['padding', 'p'],
  createPos4Props('margin', 'm'),
  createPos4Props('padding', 'p'),
]
