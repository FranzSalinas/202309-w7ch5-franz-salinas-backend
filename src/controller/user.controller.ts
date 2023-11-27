import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { UserMongoRepo } from '../repo/users/user.mongo.repo.js';
import { Auth } from '../services/auth.js';
import { Controller } from './controller.js';
import { User } from '../entities/user.js';

const debug = createDebug('w7E:user:controller');

export class UserController extends Controller<User> {
  // eslint-disable-next-line no-unused-vars
  constructor(protected repo: UserMongoRepo) {
    super(repo);
    // Inyección de dependenncias. Desacoplamos el controler de un repo concreto.
    debug('Instatiated');
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = req.body.userId
        ? await this.repo.getById(req.body.userId)
        : await this.repo.login(req.body);
      const data = {
        user: result,
        token: Auth.signJWT({ id: result.id, userName: result.userName }),
      };

      res.status(202);
      res.statusMessage = 'Accepted';
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async removeFriend(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.repo.removeFriend(
        req.params.id,
        req.body.userId
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async addFriend(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.repo.addFriend(req.params.id, req.body.userId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async addEnemy(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.repo.addEnemy(req.params.id, req.body.userId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
