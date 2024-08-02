import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/user.js';

import { FORTY_MINUTES, SEVEN_DAY } from '../constants/index.js';
import { SessionsCollection } from '../db/models/session.js';
// import jwt from 'jsonwebtoken';
// import { env } from '../utils/env.js';
// import path from 'node:path';
// import fs from 'node:fs/promises';



export const registerUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (user) throw createHttpError(409, 'Email in use');

  const encryptedPassword = await bcrypt.hash(payload.password, 10);
  const newUser = await UsersCollection.create({
    ...payload,
    password: encryptedPassword,
  });

  // Створення сесії після реєстрації
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  await SessionsCollection.create({
    userId: newUser._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FORTY_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + SEVEN_DAY),
  });

  return {
    user: newUser,
    accessToken,
    refreshToken,

  };
};

export const loginUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const isEqual = await bcrypt.compare(payload.password, user.password);

  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized');
  }

  await SessionsCollection.deleteOne({ userId: user._id });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return await SessionsCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FORTY_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + SEVEN_DAY),
  });

};




