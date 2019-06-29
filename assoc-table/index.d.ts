import {iOptions} from './options.i'
export function assoc2table(
  assoc: [] | object,
  options?: iOptions,
  space?: string[],
  table?: string[][]
): string[][]

export function table2assoc<T = [] | object>(
  table: string[][],
  assoc?: T
): T

export function repairIndexes<T>(
  source: T
): [] | T
