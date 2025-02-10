import type { USFSchema } from '@usf-org/zod'

export namespace USFBuilder {
  export type AddSubject<_Scrict extends boolean, TSchema extends USFSchema, TName extends string, TSubject extends USFSchema['subjects'][TName]> = Omit<TSchema, 'subjects'> & {
    subjects: Omit<TSchema['subjects'], TName> & {
      [K in TName]: TSubject
    }
  }

  export type AddPeriod<Scrict extends boolean, TSchema extends USFSchema, TStart extends string, TEnd extends string> = Omit<TSchema, 'periods'> & {
    periods: Scrict extends true
      ? Unique<[...ExcludePeriodStringKeywordTupleArray<TSchema['periods']>, [TStart, TEnd]]>
      : [...TSchema['periods'], [TStart, TEnd]]
  }

  export type AddTimetable<
    Strict extends boolean,
    TSchema extends USFSchema,
    TDay extends number,
    TWeekType extends 'all' | 'even' | 'odd',
    TSubjectKey extends keyof TSchema['subjects'],
    TPeriodIndex extends number,
  > = Omit<TSchema, 'timetable'> & {
    timetable: Strict extends true
      ? Unique<[...ExcludeTimetableStringKeywordTupleArray<TSchema['timetable']>, [TDay, TWeekType, TSubjectKey, TPeriodIndex]]>
      : [...TSchema['timetable'], [TDay, TWeekType, TSubjectKey, TPeriodIndex]]
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

  setVersion<TVersion extends TSchema['version']>(version: TVersion): USFBuilder<Scrict, Omit<TSchema, 'version'> & { version: TVersion }>
  setVersion(version: TSchema['version']): this {
    this._schema.version = version
    return this
  }

  addSubject<TName extends string, TSubject extends USFSchema['subjects'][TName]>(name: TName, subject: TSubject): USFBuilder<Scrict, USFBuilder.AddSubject<Scrict, TSchema, TName, TSubject>>
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

  addTimetable<TDay extends number, TWeekType extends 'all' | 'even' | 'odd', TSubjectKey extends keyof TSchema['subjects'], TPeriodIndex extends number>(
    day: TDay,
    weekType: TWeekType,
    subjectKey: TSubjectKey extends keyof TSchema['subjects'] ? TSubjectKey : never,
    periodIndex: TPeriodIndex,
  // eslint-disable-next-line ts/ban-ts-comment
  // @ts-expect-error
  ): USFBuilder<Scrict, USFBuilder.AddTimetable<Scrict, TSchema, TDay, TWeekType, TSubjectKey, TPeriodIndex>> {
    if (this._schema.timetable.some(([d, wt, s, p]) => d === day && wt === weekType && s === subjectKey && p === periodIndex))
      return this as any

    this._schema.timetable.push([day, weekType, subjectKey as string, periodIndex])
    return this as any
  }

  build(): TSchema {
    return this._schema
  }
}

export const usf = new USFBuilder<true>()
  .addSubject('Math', {
    simplified_name: 'Math',
    hello: 'world',
  })
  .addTimetable(1, 'all', 'Math', 0)
  .addPeriod('8:00', '9:00')
  .build()

type IsStringLiteral<T> = T extends string
  ? (string extends T ? false : true)
  : false

type IsNumberLiteral<T> = T extends number
  ? (number extends T ? false : true)
  : false

type IsStringLiteralIntersection<T> = T extends string
  ? ('all' | 'even' | 'odd' extends T ? true : false)
  : false

type ExcludePeriodStringKeywordTupleArray<T> = T extends [infer A, infer B][]
  ? IsStringLiteral<A> extends true
    ? IsStringLiteral<B> extends true
      ? T
      : []
    : []
  : []

type ExcludeTimetableStringKeywordTupleArray<T> = T extends [infer A, infer B, infer C, infer D][]
  ? IsNumberLiteral<A> extends true
    ? IsStringLiteralIntersection<B> extends true
      ? IsStringLiteral<C> extends true
        ? IsNumberLiteral<D> extends true
          ? T
          : []
        : []
      : []
    : []
  : []

/** Same as [...new Set(T)] */
type Unique<T extends any[], U extends any[] = []> = T extends [infer First, ...infer Rest]
  ? First extends U[number]
    ? Unique<Rest, U>
    : Unique<Rest, [...U, First]>
  : U
