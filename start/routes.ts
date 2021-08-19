/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.post('register', 'UsersController.create')
Route.post('login', 'UsersController.login')
Route.post('logout', 'UsersController.logout')
Route.post('loginCheck', 'UsersController.isLoggedIn')
Route.get('uid', 'UsersController.getUID')
Route.get('user', 'UsersController.show').middleware(['auth'])
Route.get('users', 'UsersController.index').middleware('auth')
Route.put('userUpdate', 'UsersController.update').middleware(['auth'])
Route.delete('userDelete', 'UserControllers.destroy').middleware(['auth'])

Route.post('compare', 'RegisteredFacesController.compare')
Route.post('genAccess', 'RegisteredFacesController.create')
Route.get('faces', 'RegisteredFacesController.index')

Route.get('serveFile', 'RegisteredFacesController.serveFile')

Route.get('mongoindex', 'RegisteredFacesController.mongoIndex')
Route.post('mongocreate', 'RegisteredFacesController.mongoCreate')

Route.post('createFT', 'RegisteredFacesController.createFaceToken')
Route.post('createFS', 'RegisteredFacesController.createFaceSet')

Route.post('mu', 'RegisteredFacesController.mongoUpdate')
Route.post('search', 'RegisteredFacesController.search')

Route.post('storeFS', 'FacesetsController.create')
Route.delete('deleteFS', 'FacesetsController.destroy')

Route.delete('dissmis', 'RegisteredFacesController.mongoDelete')

Route.delete('removeAccess', 'RegisteredFacesController.destroy')

Route.get('sets', 'FacesetsController.index')

Route.get('showSets', 'FacesetsController.show')

Route.get('indexAccess', 'RegisteredFacesController.index')
