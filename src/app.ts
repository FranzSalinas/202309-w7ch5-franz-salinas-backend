import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { userRouter } from './router/user.router.js';
import createDebug from 'debug';
import { errorMiddleware } from './middleware/error.middleware.js';
const debug = createDebug('W7E:footballers:app');

export const app = express();
debug('Starting');

app.use(cors());
app.use(morgan('dev'));

app.use(express.json()); // Parcea el json que llega en body y lo guarda en el body.
app.use(express.static('public'));
app.use('/users', userRouter);

app.use(errorMiddleware);
