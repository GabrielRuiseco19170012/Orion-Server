import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Faceset from 'App/Models/Faceset'
import Env from '@ioc:Adonis/Core/Env'
const axios = require('axios')

export default class FacesetsController {
  public async index({ request, response }: HttpContextContract) {
    const { id } = request.only(['id'])
    const sets = await Faceset.findBy('id', id)
    return response.status(200).json(sets)
  }

  public async create({ request, response }: HttpContextContract) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { display_name, user_id } = request.only(['display_name', 'user_id'])
    const result = await axios
      .post('https://api-us.faceplusplus.com/facepp/v3/faceset/create', null, {
        params: {
          api_key: Env.get('FACEAPIKEY'),
          api_secret: Env.get('FACEAPISECRET'),
          display_name: display_name,
        },
      })
      .catch(function (error) {
        console.log(error)
      })
    console.log(user_id)
    console.log(result)
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const faceset_token = result.data.faceset_token
    const faceset = await Faceset.create({
      display_name,
      faceset_token,
      user_id,
    })
    return response.status(201).json(faceset)
  }

  public async store({}: HttpContextContract) {}

  public async show({ request, response }: HttpContextContract) {
    const { id } = request.only(['id'])
    const facesets = await Faceset.findBy('user_id', id)
    return response.status(200).json(facesets)
  }

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({ request }: HttpContextContract) {
    const faceset = await Faceset.findBy('id', request.only(['id']))
    const result = await axios
      .post('https://api-us.faceplusplus.com/facepp/v3/faceset/delete', null, {
        params: {
          api_key: Env.get('FACEAPIKEY'),
          api_secret: Env.get('FACEAPISECRET'),
          faceset_token: faceset?.faceset_token,
        },
      })
      .catch(function (error) {
        console.log(error)
      })
    await faceset?.delete()
    return result
  }
}
