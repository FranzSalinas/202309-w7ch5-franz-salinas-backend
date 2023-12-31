import { NextFunction, Request, Response } from 'express';
import { Repository } from '../repo/repo';

export abstract class Controller<T extends { id: unknown }> {
  // eslint-disable-next-line no-unused-vars, no-useless-constructor
  constructor(protected repo: Repository<T>) {}

  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.repo.getAll(); // No se pone un res.status(200) porque el sistema por defecto nos da ese mensaje.
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
  async search(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.repo.search({
        key: Object.entries(req.query)[0][0] as keyof T,
        value: Object.entries(req.query)[0][1],
      });
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.repo.getById(req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      req.body.avatar = {
        publicId: req.file?.fieldname,
        format: req.file?.mimetype,
        url: req.file?.path,
        size: req.file?.size,
      };

      const result = await this.repo.create(req.body);

      res.status(201);
      res.statusMessage = 'Created';
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.repo.update(req.params.id, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await this.repo.delete(req.params.id);
      res.status(204);
      res.statusMessage = 'No Content';
      res.json({});
    } catch (error) {
      next(error);
    }
  }
}
