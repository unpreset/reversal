import type { CssNode, Declaration, Dimension, List, Url } from 'css-tree'
import { toArray } from '../utils'
import type { CssValueParsed, CssValueParsedMeta } from '../types'

export function parseDeclarationNode(node: Declaration): CssValueParsed | undefined {
  if (node.type !== 'Declaration') {
    return
  }

  const prop = node.property
  let meta: CssValueParsedMeta[]

  if (node.value.type === 'Raw') {
    meta = toArray<CssValueParsedMeta>({ value: node.value.value })
  }
  else {
    meta = node.value.children.map(child => parseChildNode(child)) as unknown as CssValueParsedMeta[]
  }

  return {
    prop,
    meta,
  }
}

function parseChildNode(child: CssNode): CssValueParsedMeta | undefined {
  switch (child.type) {
    case 'Dimension':
    case 'Number':
    case 'String':
    case 'Percentage':
    case 'Hash':
    case 'Url':
    case 'Raw':
    case 'Operator': {
      let _v: any = child.value
      if (child.type === 'Hash') {
        _v = `#${child.value}`
      }
      else if (child.type === 'Percentage') {
        _v = `${child.value}%`
      }

      const meta: CssValueParsedMeta = { value: _v, type: child.type }

      if ((child as Dimension).unit)
        meta.unit = (child as Dimension).unit

      if ((child as Url).type === 'Url')
        meta.fname = 'url'

      return meta
    }

    case 'Identifier':
      return {
        value: child.name,
        type: child.type,
      }

    case 'Function':
      return {
        value: child.children.map(child => parseChildNode(child)!).toArray(),
        fname: child.name,
        type: child.type,
      }

    default:
      return undefined
  }
}
