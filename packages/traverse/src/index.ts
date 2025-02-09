import type { USFSchema } from '@usf-org/zod'

export namespace USFBuilder {
  export type AddSubject<TSchema extends USFSchema, TName extends string, TSubject extends USFSchema['subjects'][TName]> = Omit<TSchema, 'subjects'> & {
    subjects: Omit<TSchema['subjects'], TName> & Record<TName, TSubject>
  }

  export type AddPeriod<Scrict extends boolean, TSchema extends USFSchema, TStart extends string, TEnd extends string> = Omit<TSchema, 'periods'> & {
    periods: Scrict extends true
      ? Unique<[...ExcludeStringKeywordTupleArray<TSchema['periods']>, [TStart, TEnd]]>
      : [...TSchema['periods'], [TStart, TEnd]]
  }
}

/**
 * ## USF Schema Builder
 *
 * @template Scrict - Strict mode, will use unique `periods`, default is `false`
 *
 * ---
 *
 * @example
 * ### Default mode
 * ```ts
 * const usf = new USFBuilder().setVersion(1).addSubject('Math', {}).addPeriod('8:00', '9:00').build()
 * ```
 * ---
 *
 * @example
 * ### Strict mode, will use unique `periods`
 * ```ts
 * const usf = new USFBuilder<true>().setVersion(1).addSubject('Math', {}).addPeriod('8:00', '9:00').build()
 * ```
 */
export class USFBuilder<Scrict extends boolean = false, TSchema extends USFSchema = USFSchema> {
  private _schema: TSchema = {
    version: 1,
    subjects: {},
    periods: [],
    timetable: [],
  } as unknown as TSchema

  setVersion<TVersion extends TSchema['version']>(version: TVersion): USFBuilder<Scrict, Omit<TSchema, 'version'> & { version: TVersion }> {
    this._schema.version = version
    return this as unknown as USFBuilder<Scrict, Omit<TSchema, 'version'> & { version: TVersion }>
  }

  addSubject<TName extends string, TSubject extends USFSchema['subjects'][TName]>(name: TName, subject: TSubject): USFBuilder<Scrict, USFBuilder.AddSubject<TSchema, TName, TSubject>>
  addSubject(name: string, subject: USFSchema['subjects'][string]): this {
    this._schema.subjects[name] = subject
    return this
  }

  // eslint-disable-next-line ts/ban-ts-comment
  // @ts-expect-error
  addPeriod<TStart extends string, TEnd extends string>(start: TStart, end: TEnd): USFBuilder<Scrict, USFBuilder.AddPeriod<Scrict, TSchema, TStart, TEnd>>
  addPeriod(start: string, end: string): any {
    if (this._schema.periods.some(([s, e]) => s === start && e === end))
      return this as any

    this._schema.periods.push([start, end])
    return this as any
  }

  build(): TSchema {
    return this._schema
  }
}

export const USF = new USFBuilder<true>()
  .setVersion(1)
  .addSubject('Math', {
    room: '',
    hello: 1,
  })
  .addPeriod('8:00', '9:00')
  .build()

type IsStringLiteral<T> = T extends string
  ? (string extends T ? false : true)
  : false

type ExcludeStringKeywordTupleArray<T> = T extends [infer A, infer B][]
  ? IsStringLiteral<A> extends true
    ? IsStringLiteral<B> extends true
      ? T
      : []
    : []
  : []

/** Same as [...new Set(T)] */
type Unique<T extends any[], U extends any[] = []> = T extends [infer First, ...infer Rest]
  ? First extends U[number]
    ? Unique<Rest, U>
    : Unique<Rest, [...U, First]>
  : U
