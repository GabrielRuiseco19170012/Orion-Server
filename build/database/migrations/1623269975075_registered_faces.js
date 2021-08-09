"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(require("@ioc:Adonis/Lucid/Schema"));
class RegisteredFaces extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'registered_faces';
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.integer('user_id').unsigned().references('id').inTable('users');
            table.string('name').notNullable();
            table.string('photo').nullable();
            table.boolean('access').notNullable();
            table.timestamps();
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = RegisteredFaces;
//# sourceMappingURL=1623269975075_registered_faces.js.map