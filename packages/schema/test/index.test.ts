import { zodToJsonSchema } from 'zod-to-json-schema'
import { Schema } from '../src/index'

it('should work', async () => {
  const response: any = await fetch('https://fastly.jsdelivr.net/gh/USF-org/USF/usf.schema.json').then(res => res.json())

  const parsedJsonSchema = zodToJsonSchema(Schema)
  parsedJsonSchema.$schema = response.$schema
  parsedJsonSchema.title = response.title
  expect(parsedJsonSchema).toStrictEqual(response)
})
