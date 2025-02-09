export class USFBuilderSpec<TSchemaSpec extends SchemaSpec> {
  private _schema: TSchemaSpec = {
    version: 1,
  } as TSchemaSpec

  build(): TSchemaSpec {
    return this._schema
  }

  setVersion<TVersion extends TSchemaSpec['version']>(version: TVersion): USFBuilderSpec<Omit<TSchemaSpec, 'version'> & { version: TVersion }> {
    this._schema.version = version
    return this as unknown as USFBuilderSpec<Omit<TSchemaSpec, 'version'> & { version: TVersion }>
  }
}

export interface SchemaSpec {
  version: 1 | 2
}

export const USFBuilder = new USFBuilderSpec<SchemaSpec>()
  .setVersion(2)
  .build()
