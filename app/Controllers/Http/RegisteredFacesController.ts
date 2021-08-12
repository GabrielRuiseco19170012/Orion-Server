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
    const newFaceSchema = schema.create({
      user_id: schema.number(),
      name: schema.string(),
      access: schema.boolean(),
      photo: schema.string.optional(),
    })

    // const fileSchema = schema.create({
    //   image: schema.file({
    //     size: '2mb',
    //     extnames: ['jpg', 'gif', 'png'],
    //   }),
    // })
    // const coverImage = request.file('image', {
    //   size: '2mb',
    //   extnames: ['jpg', 'png', 'gif'],
    // })
    // // @ts-ignore
    // const photo = `${cuid()}.${coverImage.extname}`
    // const payload = await request.validate({ schema: fileSchema })
    // if (payload) {
    const payload2 = await request.validate({
      schema: newFaceSchema,
      data: request.only(['user_id', 'name', 'access', 'photo']),
    })
    if (payload2) {
      // await payload.image.move(Application.tmpPath('uploads'), { name: photo })
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { user_id, name, access, photo } = request.only(['user_id', 'name', 'access', 'photo'])
      await RegisteredFace.create({ user_id, name, access, photo })
      return response.status(201).send({ message: 'Registered Face' })
    }
    // }
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
      .post('https://api-us.faceplusplus.com/facepp/v3/compare', {
        api_key: Env.get('FACEAPIKEY'),
        api_secret: Env.get('FACEAPISECRET'),
        image_url1: url1,
        image_url2: url2,
      })
      .catch(function (error) {
        console.log(error)
      })
    return response.status(200).json(result)
  }

  public async search({ request, response }: HttpContextContract) {
    const { imageUrl, faceSetToken } = request.only(['imageUrl', 'faceSetToken'])
    const result = await axios
      .post('https://api-us.faceplusplus.com/facepp/v3/search', {
        api_key: Env.get('FACEAPIKEY'),
        api_secret: Env.get('FACEAPISECRET'),
        image_url: imageUrl,
        faceset_token: faceSetToken,
      })
      .catch(function (error) {
        console.log(error)
      })
    return response.status(200).json(result)
  }

  public async createFaceSet({ request, response }: HttpContextContract) {
    const { name } = request.only(['name'])
    const result = await axios
      .post('https://api-us.faceplusplus.com/facepp/v3/faceset/create', {
        api_key: Env.get('FACEAPIKEY'),
        api_secret: Env.get('FACEAPISECRET'),
        display_name: name,
      })
      .catch(function (error) {
        console.log(error)
      })
    return response.status(200).json(result)
  }

  public async createFaceToken({ request, response }: HttpContextContract) {
    try {
      const { url1 } = request.only(['url1'])
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
      return response.status(200).json(result.data.faces[0].face_token)
    } catch (e) {
      return response.json(e)
    }
  }

  public async addFaceToFS({ request, response }: HttpContextContract) {
    const { faceSetToken, faceTokens } = request.only(['faceSetToken', 'faceTokens'])
    const result = await axios
      .post('https://api-us.faceplusplus.com/facepp/v3/faceset/addface', {
        api_key: Env.get('FACEAPIKEY'),
        api_secret: Env.get('FACEAPISECRET'),
        faceset_token: faceSetToken,
        face_tokens: faceTokens,
      })
      .catch(function (error) {
        console.log(error)
      })
    return response.status(200).json(result)
  }

  public async removeFaceToFS({ request, response }: HttpContextContract) {
    const { faceSetToken, faceTokens } = request.only(['faceSetToken', 'faceTokens'])
    const result = await axios
      .post('https://api-us.faceplusplus.com/facepp/v3/faceset/removeface', {
        api_key: Env.get('FACEAPIKEY'),
        api_secret: Env.get('FACEAPISECRET'),
        faceset_token: faceSetToken,
        face_tokens: faceTokens,
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

  public async mongoCreate({ request, response }) {
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
        extnames: ['jpg', 'png', 'gif'],
      })
      // @ts-ignore
      const photo = `${cuid()}.${coverImage.extname}`
      const payload = await request.validate({ schema: fileSchema })
      await payload.image.move(Application.tmpPath('uploads'), { name: photo })
      // const result = await axios
      //   .post('https://api-us.faceplusplus.com/facepp/v3/detect', {
      //     api_key: Env.get('FACEAPIKEY'),
      //     api_secret: Env.get('FACEAPISECRET'),
      //     image_url: 'https://orionserver.herokuapp.com/serveFile?photo=' + photo.toString(),
      //   })
      //   .catch(function (error) {
      //     console.log(error)
      //   })
      const data = await Person.create({
        photo: photo,
        // face_token: result,
      })
      return response.status(201).json(data)
    } catch (e) {
      return response.status(400).send({ Error: e.toString() })
    }
  }

  public async mongoIndex({ response }) {
    mongoose.connect(Env.get('MONGO_CONNECTION_STRING'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    const data = await Person.find({})
    try {
      return response.status(200).json(data)
    } catch (e) {
      return response.status(400).send({ Error: e })
    }
  }
}
