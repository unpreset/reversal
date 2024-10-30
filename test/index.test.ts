import { Magicolor } from '@magic-color/core'
import { createGenerator } from '@unocss/core'
import { parse } from 'css-tree'
import MagicString from 'magic-string'
import { describe, expect, it } from 'vitest'
import type { Declaration } from 'css-tree'
import { parseCSS, parseDeclarationNode } from '../src'
import { analyzePared } from '../src/analysis'

const uno = createGenerator({
  theme: {
    colors: {
      white: '#fff',
      primary: '#007bff',
      foo: {
        DEFAULT: '#f00',
        100: '#f0f',
        200: '#0ff',
        300: 'rgb(0 0 0)',
      },
      bar: {
        foo: {
          test: '#f00',
        },
      },
    },
  },
})

function generateParsed(code: string) {
  const source = new MagicString(code)
  const ast = parse(source.original, {
    context: 'declaration',
    positions: true,
    filename: 'test.css',
  }) as Declaration
  return parseDeclarationNode(ast, source)
}

describe('should', () => {
  it('declarations', () => {
    expect(generateParsed('content: ""')).toMatchInlineSnapshot(`
      {
        "meta": [
          {
            "raw": """",
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
            "raw": "red",
            "type": "Identifier",
            "value": "red",
          },
        ],
        "prop": "color",
      }
    `)

    expect(generateParsed('border: 1px solid #fff')).toMatchInlineSnapshot(`
      {
        "meta": [
          {
            "raw": "1px",
            "type": "Dimension",
            "unit": "px",
            "value": "1",
          },
          {
            "raw": "solid",
            "type": "Identifier",
            "value": "solid",
          },
          {
            "raw": "#fff",
            "type": "Hash",
            "value": "#fff",
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
            "raw": "hsl(100% var(--foo) 100 / 1)",
            "type": "Function",
            "value": [
              {
                "raw": "100%",
                "type": "Percentage",
                "value": "100",
              },
              {
                "fname": "var",
                "raw": "var(--foo)",
                "type": "Function",
                "value": [
                  {
                    "raw": "--foo",
                    "type": "Identifier",
                    "value": "--foo",
                  },
                ],
              },
              {
                "raw": "100",
                "type": "Number",
                "value": "100",
              },
              {
                "raw": "/",
                "type": "Operator",
                "value": "/",
              },
              {
                "raw": "1",
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
            "raw": "calc(10px + calc(var(--bar, 1)))",
            "type": "Function",
            "value": [
              {
                "raw": "10px",
                "type": "Dimension",
                "unit": "px",
                "value": "10",
              },
              {
                "raw": "+",
                "type": "Operator",
                "value": " + ",
              },
              {
                "fname": "calc",
                "raw": "calc(var(--bar, 1))",
                "type": "Function",
                "value": [
                  {
                    "fname": "var",
                    "raw": "var(--bar, 1)",
                    "type": "Function",
                    "value": [
                      {
                        "raw": "--bar",
                        "type": "Identifier",
                        "value": "--bar",
                      },
                      {
                        "raw": ",",
                        "type": "Operator",
                        "value": ",",
                      },
                      {
                        "raw": " 1",
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
})

describe('analyzePared', () => {
  const codes = [
    'border-top: 1px solid #eee',
    'border: 1px solid rgb(0 0 0)',
    'margin: 12px',
    'background-color: hsl(100% var(--foo) 100 / 1)',
    'color: #eee',
    'color: var(--bar)',
    'padding: var(--bar, 1)',
    'font-size: 16px',
    'line-height: 1.5',
    'text-align: center',
    'display: flex',
    'justify-content: space-between',
    'align-items: center',
    'width: 100%',
    'height: 50vh',
    'max-width: 1200px',
    'min-height: 300px',
    'padding-top: 20px',
    'padding-right: 10px',
    'padding-bottom: 20px',
    'padding-left: 10px',
    'margin-left: auto',
    'margin-right: auto',
    'border-radius: 5px',
    'border-top-left-radius: 5px',
    'box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1)',
    'opacity: 0.8',
    'transition: all 0.3s ease',
    'transform: translateX(50%)',
    'background: linear-gradient(to right, #ff7e5f, #feb47b)',
    'overflow: hidden',
    'z-index: 10',
    'position: relative',
    'top: 10px',
    'left: 20px',
    'right: 30px',
    'bottom: 40px',
    `background-image: url('https://example.com/image.png')`,
  ]

  it('transfrom parsed', () => {
    const unmatched: string[] = []
    const result = codes.map((code) => {
      const parsed = generateParsed(code)
      if (!parsed) {
        unmatched.push(code)
        return undefined
      }

      return {
        css: code,
        tokens: analyzePared(parsed, uno as any),
        shortTokens: analyzePared(parsed, uno as any, { shortify: true }),
      }
    }).filter(Boolean)

    expect(result).toMatchSnapshot()
    expect(unmatched).toMatchSnapshot()
  })
  it('transfrom parsedsss', () => {
    const code = `background-image: url('https://example.com/image.png')`
    const result = analyzePared(
      generateParsed(code)!,
      uno as any,
      { shortify: true },
    )

    expect(result).toMatchInlineSnapshot(`
      [
        "bg-[url('https://example.com/image.png')]",
      ]
    `)
  })
})
