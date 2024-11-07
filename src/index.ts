import type { Rule, StyleSheet } from 'css-tree'
import { parse } from 'css-tree'
import MagicString from 'magic-string'

export * from './parser/declaration'

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
