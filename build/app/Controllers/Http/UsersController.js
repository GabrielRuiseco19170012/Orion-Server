"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("App/Models/User"));
const Hash_1 = __importDefault(require("@ioc:Adonis/Core/Hash"));
const Validator_1 = require("@ioc:Adonis/Core/Validator");
class UsersController {
    async index({ response }) {
        const users = await User_1.default.all();
        return response.status(200).json(users);
    }
    async create({ request, response }) {
        const newUserSchema = Validator_1.schema.create({
            email: Validator_1.schema.string(),
            name: Validator_1.schema.string(),
            last_name: Validator_1.schema.string(),
            password: Validator_1.schema.string(),
        });
        const payload = await request.validate({
            schema: newUserSchema,
            data: request.only(['email', 'name', 'last_name', 'password']),
        });
        if (payload) {
            await User_1.default.create(request.only(['email', 'name', 'last_name', 'password']));
            return response.status(201).send({ message: 'User has been created' });
        }
    }
    async show({ request, response }) {
        const user = await User_1.default.findBy('id', request.only(['id']));
        return response.status(200).json(user);
    }
    async update({ request, response }) {
        const newUserSchema = Validator_1.schema.create({
            email: Validator_1.schema.string(),
            name: Validator_1.schema.string(),
            last_name: Validator_1.schema.string(),
        });
        const payload = await request.validate({
            schema: newUserSchema,
            data: request.only(['email', 'name', 'last_name']),
        });
        if (payload) {
            const user = await User_1.default.findBy('id', request.only(['id']));
            await user?.merge(request.only(['email', 'name', 'last_name']));
            return response.status(200).json(user);
        }
    }
    async destroy({ request }) {
        const user = await User_1.default.findBy('id', request.only(['id']));
        await user?.delete();
    }
    async login({ request, response, auth }) {
        const { email, password } = request.only(['email', 'password']);
        const user = await User_1.default.query().where('email', email).firstOrFail();
        if (!(await Hash_1.default.verify(user.password, password))) {
            return response.badRequest('invalid credentials');
        }
        const token = await auth.use('api').generate(user);
        return response.status(200).json(token);
    }
    async logout({ auth, response }) {
        await auth.use('api').revoke();
        const status = auth.use('api').isLoggedOut;
        return response.json(status);
    }
    async isLoggedIn({ auth, response }) {
        await auth.use('api').authenticate();
        const status = auth.use('api').isLoggedIn;
        return response.json(status);
    }
}
exports.default = UsersController;
//# sourceMappingURL=UsersController.js.map