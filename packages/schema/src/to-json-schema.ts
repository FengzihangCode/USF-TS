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
  // eslint-disable-next-line ts/ban-ts-comment
  // @ts-expect-error
  parsedJsonSchema.$id = 'https://json.schemastore.org/usf.json'
  parsedJsonSchema.title = options.title ?? 'Universal Schedule Format (USF)'
  return parsedJsonSchema
}
