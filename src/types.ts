import type { CssNode } from 'css-tree'

export type Atomic = string
export type AtomicShort = string
export type AtomicComposed = [Atomic, AtomicShort?]
export type StaticPropAtomicMap = [string, Atomic | AtomicComposed]
export type DynamicPropAtomicMap = [RegExp, (match: RegExpMatchArray) => Atomic | [Atomic, AtomicShort] | undefined]
export type PropsAtomicMap = StaticPropAtomicMap | DynamicPropAtomicMap

// Parser types

export interface CssValueParsedMeta {
  /**
   * Value of the property or function
   */
  value: string | CssValueParsedMeta[]
  /**
   * Unit of the value
   */
  unit?: string
  /**
   * Function name
   */
  fname?: string
  /**
   * Type of the value
   */
  type: CssNode['type']
}

export interface CssValueParsed {
  prop: string
  meta: CssValueParsedMeta[]
}

export interface TransfromOptions {
  /**
   * 是否开启简写模式
   *
   * @default false
   */
  shortify?: boolean
}
