import type { Schema } from '.'
import { zodToJsonSchema } from 'zod-to-json-schema'

export interface ToJsonSchemaOptions {
  /** @default "Universal Schedule Format (USF)" */
  title?: string
  /** @default "https://json-schema.org/draft/2020-12/schema" */
  $schema?: string
  /** @default [1] */
  versionEnum?: string[]
}

export function toJsonSchema(schema: typeof Schema, options: ToJsonSchemaOptions = {}): ReturnType<typeof zodToJsonSchema> {
  const parsedJsonSchema = zodToJsonSchema(schema)
  parsedJsonSchema.$schema = options.$schema ?? 'https://json-schema.org/draft/2020-12/schema'
  parsedJsonSchema.title = options.title ?? 'Universal Schedule Format (USF)'
  // eslint-disable-next-line ts/ban-ts-comment
  // @ts-expect-error
  parsedJsonSchema.properties.version.enum = options.versionEnum ?? [1]
  return parsedJsonSchema
}
