import { parse } from 'css-tree'
import { describe, expect, it } from 'vitest'
import type { Declaration } from 'css-tree'
import { parseCSS, parseDeclarationNode } from '../src'
import { transfromParsed } from '../src/transfromer'

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
  function generateParsed(code: string) {
    const ast = parse(code, {
      context: 'declaration',
      positions: true,
    }) as Declaration
    return parseDeclarationNode(ast)
  }

  it('declarations', () => {
    expect(generateParsed('content: ""')).toMatchInlineSnapshot(`
      {
        "meta": [
          {
            "type": "String",
            "value": "",
          },
        ],
        "prop": "content",
      }
    `)

    expect(generateParsed('color: red')).toMatchInlineSnapshot(`
      {
        "meta": [
          {
            "type": "Identifier",
            "value": "red",
          },
        ],
        "prop": "color",
      }
    `)

    expect(generateParsed('border: 1px solid #eee')).toMatchInlineSnapshot(`
      {
        "meta": [
          {
            "type": "Dimension",
            "unit": "px",
            "value": "1",
          },
          {
            "type": "Identifier",
            "value": "solid",
          },
          {
            "type": "Hash",
            "value": "#eee",
          },
        ],
        "prop": "border",
      }
    `)

    expect(generateParsed('background-color: hsl(100% var(--foo) 100 / 1)')).toMatchInlineSnapshot(`
      {
        "meta": [
          {
            "fname": "hsl",
            "type": "Function",
            "value": [
              {
                "type": "Percentage",
                "value": "100%",
              },
              {
                "fname": "var",
                "type": "Function",
                "value": [
                  {
                    "type": "Identifier",
                    "value": "--foo",
                  },
                ],
              },
              {
                "type": "Number",
                "value": "100",
              },
              {
                "type": "Operator",
                "value": "/",
              },
              {
                "type": "Number",
                "value": "1",
              },
            ],
          },
        ],
        "prop": "background-color",
      }
    `)

    expect(generateParsed('margin-top: calc(10px + calc(var(--bar, 1)))')).toMatchInlineSnapshot(`
      {
        "meta": [
          {
            "fname": "calc",
            "type": "Function",
            "value": [
              {
                "type": "Dimension",
                "unit": "px",
                "value": "10",
              },
              {
                "type": "Operator",
                "value": " + ",
              },
              {
                "fname": "calc",
                "type": "Function",
                "value": [
                  {
                    "fname": "var",
                    "type": "Function",
                    "value": [
                      {
                        "type": "Identifier",
                        "value": "--bar",
                      },
                      {
                        "type": "Operator",
                        "value": ",",
                      },
                      {
                        "type": "Raw",
                        "value": " 1",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
        "prop": "margin-top",
      }
    `)
  })

  it('transfromParsed', () => {
    expect(transfromParsed(
      generateParsed('border-top: 1px solid #eee')!,
      { shortify: true },
    )).toMatchInlineSnapshot(`
      [
        "b-t-[1px]",
      ]
    `)

    expect(transfromParsed(
      generateParsed('margin: 12px')!,
      { shortify: true },
    )).toMatchInlineSnapshot(`
      [
        "m-3",
      ]
    `)
  })
})
