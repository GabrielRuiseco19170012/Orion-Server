"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Env_1 = __importDefault(require("@ioc:Adonis/Core/Env"));
const module_1 = __importDefault(require());
url - parse;
const CLEARDB_DATABASE_URL = new module_1.default(Env_1.default.get(CLEARDB_DATABASE_URL));
const databaseConfig = {
    connection: Env_1.default.get('DB_CONNECTION'),
    connections: {
        mysql: {
            client: 'mysql',
            connection: {
                host: CLEARDB_DATABASE_URL.host,
                port: Number(''),
                user: CLEARDB_DATABASE_URL.username,
                password: CLEARDB_DATABASE_URL.password,
                database: CLEARDB_DATABASE_URL.pathname.substr(1)
            },
            healthCheck: false,
        },
        mongodb: {
            connectionString: Env_1.default.get('MONGO_CONNECTION_STRING', null),
            connection: {
                host: Env_1.default.get('MONGO_HOST', 'localhost'),
                port: Env_1.default.get('MONGO_PORT', 27017),
                user: Env_1.default.get('MONGO_USER', 'admin'),
                pass: Env_1.default.get('MONGO_PASSWORD', ''),
                database: Env_1.default.get('MONGO_DATABASE', 'adonis'),
                options: {},
                debug: false,
            },
        },
    },
};
exports.default = databaseConfig;
//# sourceMappingURL=database.js.map