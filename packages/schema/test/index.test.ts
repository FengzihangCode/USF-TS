import { Schema } from '../src/index'
import { toJsonSchema } from '../src/to-json-schema'

it('should work', async () => {
  const response: any = await fetch('https://fastly.jsdelivr.net/gh/USF-org/USF/usf.schema.json').then(res => res.json())

  const parsedJsonSchema = toJsonSchema(Schema)
  expect(parsedJsonSchema).toStrictEqual(response)
})
