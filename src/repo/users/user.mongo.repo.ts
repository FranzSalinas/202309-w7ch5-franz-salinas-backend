import createDebug from 'debug';
import { Repository } from '../repo.js';
import { LoginUser, User } from '../../entities/user.js';
import { UserModel } from './user.mongo.model.js';
import { HttpError } from '../../types/http.error.js';
import { Auth } from '../../services/auth.js';

const debug = createDebug('W7E:users:mongo:repo');

export class UserMongoRepo implements Repository<User> {
  constructor() {
    debug('Instantiated');
  }

  async create(newItem: Omit<User, 'id'>): Promise<User> {
    newItem.password = await Auth.hash(newItem.password);
    const result: User = await UserModel.create(newItem);
    return result;
  }

  async login(loginUser: LoginUser): Promise<User> {
    const result = await UserModel.findOne({
      userName: loginUser.userName,
    }).exec();
    if (!result || !(await Auth.compare(loginUser.password, result.password)))
      throw new HttpError(401, 'Unauthorized');
    return result;
  }

  async getAll(): Promise<User[]> {
    const result = await UserModel.find().exec();
    return result;
  }

  async getById(id: string): Promise<User> {
    debug(id, 'id value in getById in userMongoRepo');
    const result = await UserModel.findById(id).exec();
    if (!result) throw new HttpError(404, 'Not Found', 'GetById not possible');
    return result;
  }

  async update(id: string, updatedItem: Partial<User>): Promise<User> {
    if (id === updatedItem.id)
      throw new HttpError(
        406,
        '406 Not Acceptable',
        'You can not add yourself'
      );
    const result = await UserModel.findByIdAndUpdate(
      updatedItem.id,
      { $push: { friends: id } },
      {
        new: true,
      }
    ).exec();
    if (!result) throw new HttpError(404, 'Not Found', 'Update not possible');
    return result;
  }

  delete(_id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
