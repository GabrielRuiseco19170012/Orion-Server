"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Route_1 = __importDefault(require("@ioc:Adonis/Core/Route"));
Route_1.default.get('/', async () => {
    return { hello: 'world' };
});
Route_1.default.post('register', 'UsersController.create');
Route_1.default.post('login', 'UsersController.login');
Route_1.default.post('logout', 'UsersController.logout');
Route_1.default.post('loginCheck', 'UsersController.isLoggedIn');
Route_1.default.get('user', 'UsersController.show').middleware(['auth']);
Route_1.default.get('users', 'UsersController.index').middleware('auth');
Route_1.default.put('userUpdate', 'UsersController.update').middleware(['auth']);
Route_1.default.delete('userDelete', 'UserControllers.destroy').middleware(['auth']);
Route_1.default.post('compare', 'RegisteredFacesController.compare');
Route_1.default.post('access', 'RegisteredFacesController.create');
Route_1.default.get('faces', 'RegisteredFacesController.index');
Route_1.default.get('serveFile', 'RegisteredFacesController.serveFile');
Route_1.default.get('mongoindex', 'RegisteredFacesController.mongoIndex');
Route_1.default.post('mongocreate', 'RegisteredFacesController.mongoCreate');
//# sourceMappingURL=routes.js.map