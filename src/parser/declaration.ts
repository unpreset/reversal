import type { CssLocation, CssNode, Declaration, Dimension, List, Url } from 'css-tree'
import type MagicString from 'magic-string'
import { toArray } from '../utils'
import type { CssValueParsed, CssValueParsedMeta } from '../types'

export function parseDeclarationNode(node: Declaration, source: MagicString): CssValueParsed | undefined {
  if (node.type !== 'Declaration') {
    return
  }

  const prop = node.property
  let meta: CssValueParsedMeta[]

  if (node.value.type === 'Raw') {
    meta = toArray<CssValueParsedMeta>({
      value: node.value.value,
      type: 'Raw',
      raw: getRawString(node.value.loc!, source),
    })
  }
  else {
    meta = node.value.children.toArray().map(child => parseChildNode(child, source)) as unknown as CssValueParsedMeta[]
  }

  return {
    prop,
    meta,
  }
}

function parseChildNode(child: CssNode, source: MagicString): CssValueParsedMeta | undefined {
  const meta: Partial<CssValueParsedMeta> = {
    type: child.type as any,
    raw: getRawString(child.loc!, source),
  }

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
      meta.value = _v

      if ((child as Dimension).unit)
        meta.unit = (child as Dimension).unit

      if ((child as Url).type === 'Url')
        meta.fname = 'url'

      break
    }

    case 'Identifier': {
      meta.value = child.name
      break
    }

    case 'Function':{
      meta.fname = child.name
      meta.value = child.children.toArray().map(c => parseChildNode(c, source)) as any
      break
    }

    default:
      return undefined
  }

  return meta as CssValueParsedMeta
}

function getRawString(loc: CssLocation, source: MagicString): string {
  return source.original.slice(loc.start.offset, loc.end.offset)
}
