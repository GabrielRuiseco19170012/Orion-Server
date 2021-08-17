import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import RegisteredFace from 'App/Models/RegisteredFace'
import { schema } from '@ioc:Adonis/Core/Validator'
import Application from '@ioc:Adonis/Core/Application'
import cuid from 'cuid'
import Env from '@ioc:Adonis/Core/Env'

const mongoose = require('mongoose')
const personSchema = new mongoose.Schema(
  {
    photo: String,
    idUser: String,
  },
  { timestamps: { createdAt: 'created_at' } }
)

const Person = mongoose.model('Person', personSchema)

const axios = require('axios')

export default class RegisteredFacesController {
  public async index({ response }: HttpContextContract) {
    const faces = await RegisteredFace.all()
    return response.status(200).json(faces)
  }

  public async create({ request, response }: HttpContextContract) {
    try {
      const newFaceSchema = schema.create({
        user_id: schema.number(),
        name: schema.string(),
        access: schema.boolean(),
        photo: schema.string.optional(),
      })
      const payload2 = await request.validate({
        schema: newFaceSchema,
        data: request.only(['user_id', 'name', 'access', 'photo']),
      })
      if (payload2) {
        console.log('llegado3')
        const { user_id, name, access, photo, faceset_id, face_token, faceset_token } =
          request.only([
            'user_id',
            'name',
            'access',
            'photo',
            'faceset_id',
            'face_token',
            'faceset_token',
          ])
        console.log('llegado1')
        const result = await axios
          .post('https://api-us.faceplusplus.com/facepp/v3/faceset/addface', null, {
            params: {
              api_key: Env.get('FACEAPIKEY'),
              api_secret: Env.get('FACEAPISECRET'),
              faceset_token: faceset_token,
              face_tokens: face_token,
            },
          })
          .catch(function (error) {
            console.log(error)
          })
        console.log('llegado2')
        await RegisteredFace.create({ user_id, name, access, photo, faceset_id, face_token })
        return response.status(201).send({ message: 'Registered Face', result: result.data })
      }
    } catch (e) {}
  }

  public async serveFile({ request, response }: HttpContextContract) {
    return response.attachment(Application.tmpPath('uploads', request.input('photo')))
  }

  public async show({ request, response }: HttpContextContract) {
    const face = await RegisteredFace.findBy('id', request.only(['id']))
    return response.status(200).json(face)
  }

  public async update({ request, response }: HttpContextContract) {
    const newFaceSchema = schema.create({
      name: schema.string(),
      access: schema.boolean(),
      photo: schema.string(),
    })
    const payload = await request.validate({
      schema: newFaceSchema,
      data: request.only(['name', 'access', 'photo']),
    })
    if (payload) {
      const face = await RegisteredFace.findBy('id', request.only(['id']))
      await face?.merge(request.only(['name', 'access', 'photo']))
      return response.status(200).json(face)
    }
  }

  public async destroy({ request }: HttpContextContract) {
    const face = await RegisteredFace.findBy('id', request.only(['id']))
    await face?.delete()
  }

  public async compare({ request, response }: HttpContextContract) {
    // @ts-ignore
    const { url1, url2 } = request.only(['url1, url2'])
    const result = await axios
      .post('https://api-us.faceplusplus.com/facepp/v3/compare', null, {
        params: {
          api_key: Env.get('FACEAPIKEY'),
          api_secret: Env.get('FACEAPISECRET'),
          image_url1: url1,
          image_url2: url2,
        },
      })
      .catch(function (error) {
        console.log(error)
      })
    return response.status(200).json(result)
  }

  public async search({ request, response }: HttpContextContract) {
    const { imageUrl, faceSetToken } = request.only(['imageUrl', 'faceSetToken'])
    const result = await axios
      .post('https://api-us.faceplusplus.com/facepp/v3/search', null, {
        params: {
          api_key: Env.get('FACEAPIKEY'),
          api_secret: Env.get('FACEAPISECRET'),
          image_url: imageUrl,
          faceset_token: faceSetToken,
        },
      })
      .catch(function (error) {
        console.log(error)
      })
    return response.status(200).json(result.data.results[0])
  }

  public async createFaceSet({ request, response }: HttpContextContract) {
    const { name } = request.only(['name'])
    const result = await axios
      .post('https://api-us.faceplusplus.com/facepp/v3/faceset/create', null, {
        params: {
          api_key: Env.get('FACEAPIKEY'),
          api_secret: Env.get('FACEAPISECRET'),
          display_name: name,
        },
      })
      .catch(function (error) {
        console.log(error)
      })
    return response.status(200).json(result)
  }

  public async createFaceToken({ request, response }: HttpContextContract) {
    try {
      const { photo, url1 } = request.only(['photo', 'url1'])
      const result = await axios
        .post('https://api-us.faceplusplus.com/facepp/v3/detect', null, {
          params: {
            api_key: Env.get('FACEAPIKEY'),
            api_secret: Env.get('FACEAPISECRET'),
            image_url: url1,
          },
        })
        .catch(function (error) {
          console.log(error)
        })
      const data = Person.updateOne(
        { photo: photo },
        { face_token: result.data.faces[0].face_token }
      )
      return response.status(200).json(data.n, data.nModified)
    } catch (e) {
      return response.json(e)
    }
  }

  public async mongoUpdate({ request, response }: HttpContextContract) {
    const { photo } = request.only(['photo'])
    const data = Person.updateOne(
      { photo: photo.toString() },
      { $set: { photo: photo.toString(), face_token: 'updated' } }
    )
    return response.status(200).json(data, data.n)
  }

  public async addFaceToFS({ request, response }: HttpContextContract) {
    const { faceSetToken, faceTokens } = request.only(['faceSetToken', 'faceTokens'])
    const result = await axios
      .post('https://api-us.faceplusplus.com/facepp/v3/faceset/addface', null, {
        params: {
          api_key: Env.get('FACEAPIKEY'),
          api_secret: Env.get('FACEAPISECRET'),
          faceset_token: faceSetToken,
          face_tokens: faceTokens,
        },
      })
      .catch(function (error) {
        console.log(error)
      })
    return response.status(200).json(result)
  }

  public async removeFaceToFS({ request, response }: HttpContextContract) {
    const { faceSetToken, faceTokens } = request.only(['faceSetToken', 'faceTokens'])
    const result = await axios
      .post('https://api-us.faceplusplus.com/facepp/v3/faceset/removeface', null, {
        params: {
          api_key: Env.get('FACEAPIKEY'),
          api_secret: Env.get('FACEAPISECRET'),
          faceset_token: faceSetToken,
          face_tokens: faceTokens,
        },
      })
      .catch(function (error) {
        console.log(error)
      })
    return response.status(200).json(result)
  }

  public async getAll({ response }) {
    const data = await Person.find({})
    try {
      return response.status(200).json(data)
    } catch (e) {
      return response.status(400).send({ Error: e })
    }
  }

  public async mongoCreate({ request, response }: HttpContextContract) {
    try {
      mongoose.connect(Env.get('MONGO_CONNECTION_STRING'), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      const fileSchema = schema.create({
        image: schema.file({
          size: '2mb',
          extnames: ['jpg', 'gif', 'png'],
        }),
      })
      const coverImage = request.file('image', {
        size: '2mb',
        extnames: ['jpg', 'gif', 'png'],
      })
      // @ts-ignore
      const photo = `${cuid()}.${coverImage.extname}`
      const payload = await request.validate({ schema: fileSchema })
      await payload.image.move(Application.tmpPath('uploads'), { name: photo })
      const result = await axios
        .post('https://api-us.faceplusplus.com/facepp/v3/detect', null, {
          params: {
            api_key: Env.get('FACEAPIKEY'),
            api_secret: Env.get('FACEAPISECRET'),
            image_url: 'https://orionserver.herokuapp.com/serveFile?photo=' + photo.toString(),
          },
        })
        .catch(function (error) {
          console.log(error)
        })
      // const data = await Person.create({
      //   photo: photo,
      // })
      return response
        .status(201)
        .json({ photo: photo, face_token: result.data.faces[0].face_token })
    } catch (e) {
      return response.status(400).send({ Error: e.toString() })
    }
  }

  public async mongoIndex({ request, response }: HttpContextContract) {
    try {
      mongoose.connect(Env.get('MONGO_CONNECTION_STRING'), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      const { id } = request.only(['id'])
      const data = await Person.find({ idUser: id.toString() })
      return response.status(200).json(data)
    } catch (e) {
      return response.status(400).send({ Error: e })
    }
  }

  public async mongoDelete({ request, response }: HttpContextContract) {
    try {
      mongoose.connect(Env.get('MONGO_CONNECTION_STRING'), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      const { id } = await request.only(['id'])
      await Person.deleteOne({ _id: id })
    } catch (e) {
      return response.json(e)
    }
  }
}
