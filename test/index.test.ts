import { parse } from 'css-tree'
import { describe, expect, it } from 'vitest'
import type { Declaration } from 'css-tree'
import { handleDeclarationNode, parseCSS } from '../src'

const source = `/**
 * Paste or drop some CSS here and explore
 * the syntax tree created by chosen parser.
 * Enjoy!
 */

@media screen and (min-width: 480px) {
    body {
        background-color: lightgreen;
    }
}

#main {
    border: 1px solid black;
}

ul li {
	padding: 5px;
  color: #fff;
}
`

describe('should', () => {
  it('exported', () => {
    // const css = 'color: red'
    const css = 'border: 1px solid #eee'
    const ast = parse(css, {
      context: 'declaration',
      positions: true,
    }) as Declaration
    const result = handleDeclarationNode(ast)

    expect(result).toMatchInlineSnapshot(`
      {
        "meta": [
          {
            "unit": "px",
            "value": "1",
          },
          {
            "value": "solid",
          },
          {
            "value": "eee",
          },
        ],
        "prop": "border",
      }
    `)
  })
})
