import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Facesets extends BaseSchema {
  protected tableName = 'facesets'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.string('display_name').notNullable()
      table.string('faceset_token').notNullable()
      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamps()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
