import type { UnoGenerator } from '@unocss/core'
import type { CssNode } from 'css-tree'

export type Arrayable<T> = T | T[]
export type Objectable<T> = Record<string, T>
export interface Colors {
  [key: string]: Colors & { DEFAULT?: string } | string
}

export interface ProcessorContext {
  uno: UnoGenerator
}

export type Atomic = string
export type AtomicShort = string
export type AtomicComposed = [Atomic, AtomicShort?]
export interface AtomicMeta {
  /**
   * Processor of the atomic key
   */
  keyProcessor?: (key: string) => string

  /**
   * Processor of the atomic value
   */
  valueProcessor?: (value: string, ctx: ProcessorContext) => string

  /**
   * Separator of the atomic
   *
   * @default '-'
   */
  separator?: string

  /**
   * Need transfrom value that from uno theme
   */
  themeKey?: string
}
export type StaticPropAtomicMap = [string, Atomic | AtomicComposed | undefined, AtomicMeta?]
export type DynamicPropAtomicMap = [RegExp, (match: RegExpMatchArray) => Atomic | AtomicComposed | undefined, AtomicMeta?]
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
  /**
   * Raw string of the value
   */
  raw: string
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

  /**
   * 分隔符
   *
   * @default '-'
   */
  separator?: string
}
