# @usf-org/zod

Zod schema for USF.

## Usage

```ts
import { Schema } from '@usf-org/zod'

const schema = Schema.safeParse({})
```

You also can use `toJsonSchema` to get the JSON Schema of the schema.

```ts
import { toJsonSchema } from '@usf-org/zod'

const jsonSchema = toJsonSchema(Schema)
```

## License

[MIT](../../LICENSE)
