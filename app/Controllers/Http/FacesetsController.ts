import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Faceset from 'App/Models/Faceset'

export default class FacesetsController {
  public async index({}: HttpContextContract) {}

  public async create({ request, response }: HttpContextContract) {
    const { display_name, faceset_token } = request.only(['display_name', 'faceset_token'])
    const faceset = await Faceset.create({
      display_name,
      faceset_token,
    })
    return response.status(201).json(faceset)
  }

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({ request }: HttpContextContract) {
    const faceset = await Faceset.findBy('id', request.only(['id']))
    await faceset?.delete()
  }
}
