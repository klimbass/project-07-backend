import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { env } from './utils/env.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import router from './routers/index.js';
import cookieParser from 'cookie-parser';
import { swaggerDocs } from './middlewares/swaggerDocs.js';
import { MONGO_DB, SEVEN_DAY, UPLOAD_DIR } from './constants/index.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';

const user = env(MONGO_DB.MONGODB_USER);
const pwd = env(MONGO_DB.MONGODB_PASSWORD);
const url = env(MONGO_DB.MONGODB_URL);
const db = env(MONGO_DB.MONGODB_DB);

const store = new MongoStore({
  mongoUrl: `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority&appName=AquaTrackApp`,
  collectionName: 'sessions',
  ttl: SEVEN_DAY,
  autoRemove: 'native',
});

const PORT = Number(env('PORT', 3000));

export const setupServer = () => {
  const app = express();

  app.use(express.json());

  app.use(
    cors({
      origin: (origin, callback) => {
        const allowedOrigins = [
          'http://localhost:5173',
          'https://full-stack-fusion.vercel.app',
          'https://aquatrackerapp.onrender.com',
          'http://localhost:3000',
        ];
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
    }),
  );

  app.use(cookieParser());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use(
    session({
      secret: 'your-secret-key',
      resave: false,
      saveUninitialized: false,
      store: store,
      cookie: { secure: true },
    }),
  );

  app.get('/', (req, res) => {
    res.send('Welcome to the homepage');
  });
  app.use(router);
  app.use('/uploads', express.static(UPLOAD_DIR));
  app.use('/api-docs', swaggerDocs());

  app.use('*', notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
