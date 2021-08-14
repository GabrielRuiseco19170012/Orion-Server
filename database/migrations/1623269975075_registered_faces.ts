import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class RegisteredFaces extends BaseSchema {
  protected tableName = 'registered_faces'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.string('name').notNullable()
      table.string('photo').nullable()
      table.integer('faceset_id').unsigned().references('id').inTable('facesets')
      table.boolean('access').notNullable()
      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamps()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
