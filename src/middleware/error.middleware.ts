import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../types/http.error.js';
import createDebug from 'debug';
import mongoose, { Error } from 'mongoose';
const debug = createDebug('W7E:error:middleware');

debug('Starting');
export const errorMiddleware = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  debug('Middleware Errors');

  if (error instanceof HttpError) {
    res.status(error.status);
    res.statusMessage = error.statusMessage;
  } else if (error instanceof RangeError) {
    res.status(416);
    res.statusMessage = 'Request Range Not Satisfiable';
  } else if (error instanceof Error.ValidationError) {
    res.status(400);
    res.statusMessage = '400 Bad Request';
  } else if (error instanceof mongoose.mongo.MongoServerError) {
    res.status(400);
    res.statusMessage = '400 Bad Request';
  } else {
    res.status(500);
    res.statusMessage = '500 internal server error';
  }

  res.json({});
  debug((error as HttpError).message);
};
