import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import cors from 'cors';
import { NotFoundError } from './errors/NotFoundError';
import { authRouter } from './routes/auth';
import { errorHandler } from './middleware/errorHandler';
import { restaurantsRouter } from './routes/restaurants';

const app = express();
app.use(cors());
app.set('trust proxy', true);
app.use(json());
app.use(
    cookieSession({ signed: false, secure: process.env.NODE_ENV !== 'test' })  //process.env.NODE_ENV !== 'test'
);

// all routes
app.use(authRouter);
app.use(restaurantsRouter);

app.all('*', async () => {
    throw new NotFoundError('Route not found.');
});

// error handler middleware
app.use(errorHandler);

export { app };
