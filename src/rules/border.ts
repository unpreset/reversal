import type { PropsAtomicMap } from '../types'
import { createPos4Props } from './position'

export const border: PropsAtomicMap[] = [
  ['border', ['border', 'b']],
  createPos4Props('border', 'border', 'b'),
]
