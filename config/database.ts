/**
 * Config source: https://git.io/JesV9
 *
 * Feel free to let us know via PR, if you find something broken in this config
 * file.
 */

import Env from '@ioc:Adonis/Core/Env'
import { DatabaseConfig } from '@ioc:Adonis/Lucid/Database'
import Url from 'url-parse'
const CLEARDB_DATABASE_URL = new Url(Env.get('CLEARDB_DATABASE_URL'))

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
        host: 'us-cdbr-east-04.cleardb.com',
        port: Number(''),
        user: 'b234d485be34cf',
        password: 'd51d176e',
        database: 'heroku_ad4f65d04aebe83',
      },
      healthCheck: false,
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
