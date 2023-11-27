import { NextFunction, Request, Response } from 'express';
import multer from 'multer';

export class FileInterceptor {
  singleFileStore(fileName = 'file', fileSize = 8_000_000) {
    const options: multer.Options = {
      storage: multer.diskStorage({
        destination: 'uploads', // ./public/uploads
        filename(_req, file, callback) {
          const prefix = crypto.randomUUID();

          callback(null, prefix + '-' + file.originalname);
        },
      }),
      limits: { fileSize }, // dest es el nombre de la carpeta en donde se guardan los ficheros
    };

    const middleware = multer(options).single(fileName); // multer salva en req.file los datos del file y req.body guarda el body.

    return (req: Request, res: Response, next: NextFunction) => {
      const previousBody = req.body;
      middleware(req, res, next);

      req.body = { ...previousBody, ...req.body };
    };
  }
}
