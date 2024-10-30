import { position, positionShort } from './position'
import type { PropsAtomicMap } from '../types'

export const sizes: PropsAtomicMap[] = [
  ['width', 'w'],
  ['height', 'h'],
  ['min-width', 'min-w'],
  ['min-height', 'min-h'],
  ['max-width', 'max-w'],
  ['max-height', 'max-h'],
  ['font-size', 'text'],
  ['line-height', ['leading', 'lh']],
  [/^border(?:-(top|bottom|left|right))?(?:-(top|bottom|left|right))?-radius$/, ([, y, x]) => {
    const pos = [y, x].filter(Boolean).map(p => positionShort[position.indexOf(p)])
    const suffix = pos.length > 0 ? `-${pos.join('')}` : ''

    return [
      `rounded${suffix}`,
      `rd${suffix}`,
    ]
  }],

  // ['border-top-left-radius', ['rounded-tl', 'rd-tl']],
  // ['border-top-right-radius', ['rounded-tr', 'rd-tr']],
  // ['border-bottom-right-radius', ['rounded-br', 'rd-br']],
  // ['border-bottom-left-radius', ['rounded-bl', 'rd-bl']],
  ['border-width', ['border', 'b']],
  ['box-shadow', 'shadow'],
  ['letter-spacing', 'tracking'],
]
