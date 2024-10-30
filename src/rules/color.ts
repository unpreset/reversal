import type { StaticPropAtomicMap } from '../types'

export const colors: StaticPropAtomicMap[] = [
  ['color', 'c'],
  ['background', 'bg'],
  ['background-color', 'bg'],
  ['background-image', 'bg'],
  ['border-color', ['border', 'b']],

  ['opacity', ['opacity', 'op'], {
    separator: '-',
    valueProcessor: (v: string) => {
      return (Number.parseFloat(v) * 100).toString()
    },
  }],
]
