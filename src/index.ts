import { parse } from 'css-tree'
import MagicString from 'magic-string'
import type { Declaration, Rule, StyleSheet } from 'css-tree'

export function toArray<T>(value: T | T[] = []): T[] {
  return Array.isArray(value) ? value : [value]
}

function blockSource(source: string) {
  if (source.includes('{') && source.includes('}')) {
    return source
  }
  return `{ ${source} }`
}

export function parseCSS(css: string) {
  const source = new MagicString(css)
  const ast = parse(blockSource(source.original)) as StyleSheet

  for (const node of ast.children) {
    if (node.type === 'Rule') {
      handleRuleNode(source, node)
    }
  }
}

function handleRuleNode(source: MagicString, node: Rule) {
//   console.dir(node)
//   const selector = node.prelude.children
}

interface CssValueParsedMeta {
  value: number | string
  unit?: string
}

interface CssValueParsed {
  prop: string
  meta: CssValueParsedMeta[]
}

export function handleDeclarationNode(node: Declaration): CssValueParsed | undefined {
  if (node.type !== 'Declaration') {
    return
  }

  const prop = node.property
  let meta: CssValueParsedMeta[]
  if (node.value.type === 'Raw') {
    meta = toArray<CssValueParsedMeta>({ value: node.value.value })
  }
  else {
    meta = node.value.children.map((child) => {
      switch (child.type) {
        case 'Dimension':
          return {
            value: child.value,
            unit: child.unit,
          }

        case 'Hash':
          return {
            value: child.value,
          }

        case 'Identifier':
          return {
            value: child.name,
          }
      }
    }) as unknown as CssValueParsedMeta[]
  }

  return {
    prop,
    meta,
  }
}
