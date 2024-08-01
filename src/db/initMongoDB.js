import mongoose from 'mongoose';
import { env } from '../utils/env.js';
import { MONGO_DB } from '../constants/index.js';

export const initMongoDBConnection = async () => {
  try {
    const user = env(MONGO_DB.MONGODB_USER);
    const pwd = env(MONGO_DB.MONGODB_PASSWORD);
    const url = env(MONGO_DB.MONGODB_URL);
    const db = env(MONGO_DB.MONGODB_DB);
    await mongoose.connect(
      `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority&appName=AquaTrackApp`,
    );
    console.log('Mongo connection successfully established!');
  } catch (err) {
    console.log('Error while setting up mongo connection', err);
    throw err;
  }
};
