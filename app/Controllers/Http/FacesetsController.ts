import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Faceset from 'App/Models/Faceset'

export default class FacesetsController {

  public async index({ response }: HttpContextContract) {
    const sets = await Faceset.all()
    return response.status(200).json(sets)
  }

  public async create({ request, response }: HttpContextContract) {
    const { display_name, faceset_token, user_id } = request.only(['display_name', 'faceset_token', 'user_id'])
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
    await faceset?.delete()
  }
}
