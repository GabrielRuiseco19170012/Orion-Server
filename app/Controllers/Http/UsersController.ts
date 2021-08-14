import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'
import { schema } from '@ioc:Adonis/Core/Validator'

export default class UsersController {
  public async index({ response }: HttpContextContract) {
    const users = await User.all()
    return response.status(200).json(users)
  }

  public async create({ request, response }: HttpContextContract) {
    const newUserSchema = schema.create({
      email: schema.string(),
      name: schema.string(),
      last_name: schema.string(),
      password: schema.string(),
    })
    const payload = await request.validate({
      schema: newUserSchema,
      data: request.only(['email', 'name', 'last_name', 'password']),
    })
    if (payload) {
      await User.create(request.only(['email', 'name', 'last_name', 'password']))
      return response.status(201).send({ message: 'User has been created' })
    }
  }

  public async show({ request, response }: HttpContextContract) {
    const user = await User.findBy('id', request.only(['id']))
    return response.status(200).json(user)
  }

  public async update({ request, response }: HttpContextContract) {
    const newUserSchema = schema.create({
      email: schema.string(),
      name: schema.string(),
      last_name: schema.string(),
    })
    const payload = await request.validate({
      schema: newUserSchema,
      data: request.only(['email', 'name', 'last_name']),
    })
    if (payload) {
      const user = await User.findBy('id', request.only(['id']))
      await user?.merge(request.only(['email', 'name', 'last_name']))
      return response.status(200).json(user)
    }
  }

  public async destroy({ request }: HttpContextContract) {
    const user = await User.findBy('id', request.only(['id']))
    await user?.delete()
  }

  public async login({ request, response, auth }: HttpContextContract) {
    const { email, password } = request.only(['email', 'password'])
    const user = await User.query().where('email', email).firstOrFail()
    if (!(await Hash.verify(user.password, password))) {
      return response.badRequest('invalid credentials')
    }
    const token = await auth.use('api').generate(user)
    return response.status(200).json(token)
  }

  public async logout({ auth, response }: HttpContextContract) {
    await auth.use('api').revoke()
    const status = auth.use('api').isLoggedOut
    return response.json(status)
  }

  public async isLoggedIn({ auth, response }: HttpContextContract) {
    await auth.use('api').authenticate()
    const status = auth.use('api').isAuthenticated
    return response.json(status)
  }

  public async getUID({ request, response }: HttpContextContract) {
    const { email } = request.only(['email'])
    const user = await User.query().where('email', email).firstOrFail()
    return response.status(200).json(user.id)
  }
}
