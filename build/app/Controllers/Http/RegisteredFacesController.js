"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RegisteredFace_1 = __importDefault(require("App/Models/RegisteredFace"));
const Validator_1 = require("@ioc:Adonis/Core/Validator");
const Application_1 = __importDefault(require("@ioc:Adonis/Core/Application"));
const cuid_1 = __importDefault(require("cuid"));
const Env_1 = __importDefault(require("@ioc:Adonis/Core/Env"));
const mongoose = require('mongoose');
const personSchema = new mongoose.Schema({
    photo: String,
}, { timestamps: { createdAt: 'created_at' } });
const Person = mongoose.model('Person', personSchema);
const axios = require('axios');
class RegisteredFacesController {
    async index({ response }) {
        const faces = await RegisteredFace_1.default.all();
        return response.status(200).json(faces);
    }
    async create({ request, response }) {
        const newFaceSchema = Validator_1.schema.create({
            user_id: Validator_1.schema.number(),
            name: Validator_1.schema.string(),
            access: Validator_1.schema.boolean(),
            photo: Validator_1.schema.string.optional(),
        });
        const payload2 = await request.validate({
            schema: newFaceSchema,
            data: request.only(['user_id', 'name', 'access', 'photo']),
        });
        if (payload2) {
            const { user_id, name, access, photo } = request.only(['user_id', 'name', 'access', 'photo']);
            await RegisteredFace_1.default.create({ user_id, name, access, photo });
            return response.status(201).send({ message: 'Registered Face' });
        }
    }
    async serveFile({ request, response }) {
        return response.attachment(Application_1.default.tmpPath('uploads', request.input('photo')));
    }
    async show({ request, response }) {
        const face = await RegisteredFace_1.default.findBy('id', request.only(['id']));
        return response.status(200).json(face);
    }
    async update({ request, response }) {
        const newFaceSchema = Validator_1.schema.create({
            name: Validator_1.schema.string(),
            access: Validator_1.schema.boolean(),
            photo: Validator_1.schema.string(),
        });
        const payload = await request.validate({
            schema: newFaceSchema,
            data: request.only(['name', 'access', 'photo']),
        });
        if (payload) {
            const face = await RegisteredFace_1.default.findBy('id', request.only(['id']));
            await face?.merge(request.only(['name', 'access', 'photo']));
            return response.status(200).json(face);
        }
    }
    async destroy({ request }) {
        const face = await RegisteredFace_1.default.findBy('id', request.only(['id']));
        await face?.delete();
    }
    async compare({ request, response }) {
        const { url1, url2 } = request.only(['url1, url2']);
        const result = await axios
            .post('https://api-us.faceplusplus.com/facepp/v3/compare', {
            api_key: Env_1.default.get('FACEAPIKEY'),
            api_secret: Env_1.default.get('FACEAPISECRET'),
            image_url1: url1,
            image_url2: url2,
        })
            .catch(function (error) {
            console.log(error);
        });
        return response.status(200).json(result);
    }
    async getAll({ response }) {
        const data = await Person.find({});
        try {
            return response.status(200).json(data);
        }
        catch (e) {
            return response.status(400).send({ Error: e });
        }
    }
    async mongoCreate({ request, response }) {
        try {
            mongoose.connect(Env_1.default.get('MONGO_CONNECTION_STRING'), {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            const fileSchema = Validator_1.schema.create({
                image: Validator_1.schema.file({
                    size: '2mb',
                    extnames: ['jpg', 'gif', 'png'],
                }),
            });
            const coverImage = request.file('image', {
                size: '2mb',
                extnames: ['jpg', 'png', 'gif'],
            });
            const photo = `${cuid_1.default()}.${coverImage.extname}`;
            const payload = await request.validate({ schema: fileSchema });
            await payload.image.move(Application_1.default.tmpPath('uploads'), { name: photo });
            await Person.create({
                photo: photo,
            });
            return response.status(201).send({ message: 'photo has been stored' });
        }
        catch (e) {
            return response.status(400).send({ Error: e.toString() });
        }
    }
    async mongoIndex({ response }) {
        mongoose.connect(Env_1.default.get('MONGO_CONNECTION_STRING'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const data = await Person.find({});
        try {
            return response.status(200).json(data);
        }
        catch (e) {
            return response.status(400).send({ Error: e });
        }
    }
}
exports.default = RegisteredFacesController;
//# sourceMappingURL=RegisteredFacesController.js.map