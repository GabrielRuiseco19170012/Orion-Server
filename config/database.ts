/**
 * Config source: https://git.io/JesV9
 *
 * Feel free to let us know via PR, if you find something broken in this config
 * file.
 */

import Env from '@ioc:Adonis/Core/Env'
import { DatabaseConfig } from '@ioc:Adonis/Lucid/Database'
// const Url = require('url-parse')
// const DATABASE_URL = new Url(Env.get('DATABASE_URL'))


const databaseConfig: DatabaseConfig = {
  /*
  |--------------------------------------------------------------------------
  | Connection
  |--------------------------------------------------------------------------
  |
  | The primary connection for making database queries across the application
  | You can use any key from the `connections` object defined in this same
  | file.
  |
  */
  connection: Env.get('DB_CONNECTION'),

  connections: {
    /*
    |--------------------------------------------------------------------------
    | MySQL config
    |--------------------------------------------------------------------------
    |
    | Configuration for MySQL database. Make sure to install the driver
    | from npm when using this connection
    |
    | npm i mysql
    |
    */
    mysql: {
      client: 'mysql',
      connection: {
        host: Env.get('MYSQL_HOST'),
        port: Env.get('MYSQL_PORT'),
        user: Env.get('MYSQL_USER'),
        password: Env.get('MYSQL_PASSWORD', ''),
        database: Env.get('MYSQL_DB_NAME'),
      },
      migrations: {
        naturalSort: true,
      },
      healthCheck: false,
      debug: false,
    },
    /*
  |--------------------------------------------------------------------------
  | MongoDB
  |--------------------------------------------------------------------------
  |
  | Here we define connection settings for MongoDB database.
  |
  */
    mongodb: {
      connectionString: Env.get('MONGO_CONNECTION_STRING', null),
      connection: {
        host: Env.get('MONGO_HOST', 'localhost'),
        port: Env.get('MONGO_PORT', 27017),
        user: Env.get('MONGO_USER', 'admin'),
        // @ts-ignore
        pass: Env.get('MONGO_PASSWORD', ''),
        database: Env.get('MONGO_DATABASE', 'adonis'),
        options: {},
        debug: false,
      },
    },
  },
}

export default databaseConfig
