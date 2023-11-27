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

  async addEnemy(id: string, userId: User['id']): Promise<User> {
    const user = await UserModel.findById(userId).exec();
    if (!user) {
      throw new HttpError(404, 'Not Found', 'User not found');
    }

    if (user.enemies.includes(id as unknown as User)) {
      return user;
    }

    if (user.friends.includes(id as unknown as User)) {
      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        { $pull: { friends: id } },
        {
          new: true,
        }
      ).exec();

      if (!updatedUser) {
        throw new HttpError(404, 'Not Found', 'Update not possible');
      }
    }

    const result = await UserModel.findByIdAndUpdate(
      userId,
      { $push: { enemies: id } },
      {
        new: true,
      }
    ).exec();

    if (!result) {
      throw new HttpError(404, 'Not Found', 'Update not possible');
    }

    return result;
  }

  async addFriend(friendId: User['id'], userId: User['id']): Promise<User> {
    if (friendId === userId)
      throw new HttpError(406, 'Not Acceptable', 'You can´t add yourself');
    const user = await UserModel.findById(userId).exec();
    if (!user) {
      throw new HttpError(404, 'Not Found', 'User not found');
    }

    if (user.friends.includes(friendId as unknown as User)) {
      return user;
    }

    if (user.enemies.includes(friendId as unknown as User)) {
      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        { $pull: { enemies: friendId } },
        {
          new: true,
        }
      ).exec();

      if (!updatedUser) {
        throw new HttpError(404, 'Not Found', 'Update not possible');
      }
    }

    // Actualizar la lista de amigos
    const result = await UserModel.findByIdAndUpdate(
      userId,
      { $push: { friends: friendId } },
      {
        new: true,
      }
    ).exec();

    if (!result) {
      throw new HttpError(404, 'Not Found', 'Update not possible');
    }

    return result;
  }

  async update(id: string, updatedItem: Partial<User>): Promise<User> {
    const result = await UserModel.findByIdAndUpdate(id, updatedItem, {
      new: true,
    }).exec();
    if (!result) throw new HttpError(404, 'Not Found', 'Update not possible');
    return result;
  }

  async delete(id: string): Promise<void> {
    const result = await UserModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new HttpError(404, 'Not Found', 'Delete not possible');
    }
  }

  async search({
    key,
    value,
  }: {
    key: keyof User;
    value: any;
  }): Promise<User[]> {
    const result = await UserModel.find({ [key]: value })
      .populate('author', {
        notes: 0,
      })
      .exec();

    return result;
  }

  async removeFriend(
    userId: string,
    friendIdToRemove: Partial<User>
  ): Promise<User> {
    // eslint-disable-next-line no-useless-catch
    try {
      const user = await UserModel.findById(userId).exec();

      if (!user) {
        throw new HttpError(404, 'Not Found', 'User not found');
      }

      if (!user.friends.includes(friendIdToRemove as unknown as User)) {
        // El amigo no está presente, no es necesario hacer cambios
        return user;
      }

      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        { $pull: { friends: friendIdToRemove } },
        { new: true }
      ).exec();

      if (!updatedUser) {
        throw new HttpError(404, 'Not Found', 'Update not possible');
      }

      return updatedUser;
    } catch (error) {
      // Puedes manejar el error según tus necesidades
      throw error;
    }
  }
}
