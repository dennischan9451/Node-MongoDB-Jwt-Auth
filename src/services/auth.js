const createError = require('http-errors');
const { ObjectId } = require('mongodb');
const { generatePasswordHash, validatePassword } = require('../utils/helper');
const authValidation = require('../validations/auth');
const UserContainer = require('../containers/user');

class AuthService {
  constructor() {
    this._userContainer = new UserContainer();
  }

  async register(body) {
    const validate = authValidation.register(body);

    if (validate.error) {
      throw createError(422, validate.error);
    }

    const { email } = body;
    if (await this._userContainer.countUsers({ email })) {
      throw createError(409, 'Email has already been taken');
    }

    const { password } = body;
    Object.assign(body, { password: generatePasswordHash(password) });

    return this._userContainer.createUser(body);
  }

  async login(body) {
    const validate = authValidation.login(body);

    if (validate.error) {
      throw createError(422, validate.error);
    }

    const { username } = body;
    const user = await this._userContainer.findUser({ email: username });

    if (!user || !validatePassword(body.password, user.password)) {
      throw createError(401, 'Invalid username or password');
    }

    return user;
  }

  findUserById(id) {
    const validate = authValidation.findUserById({ id });

    if (validate.error) {
      throw createError(422, validate.error);
    }

    return this._userContainer.findUser({ _id: ObjectId(id) }, { projection: { password: 0 } });
  }
}

module.exports = AuthService;
