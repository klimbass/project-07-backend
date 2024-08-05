import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/user.js';

import { FORTY_MINUTES, SEVEN_DAY, TEMPLATES_DIR } from '../constants/index.js';
import { SessionsCollection } from '../db/models/session.js';
import {
  getFullNameFromGoogleTokenPayload,
  validateCode,
} from '../utils/googleOAuth2.js';
import { sendEmail } from '../utils/sendMail.js';
import jwt from 'jsonwebtoken';
import { env } from '../utils/env.js';
import { SMTP } from '../constants/index.js';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';

export const getTotalUsers = async () => {
  return await UsersCollection.countDocuments();
};

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

// export const loginUser = async (payload) => {
//   const user = await UsersCollection.findOne({ email: payload.email });
//   if (!user) {
//     throw createHttpError(404, 'User not found');
//   }
//   const isEqual = await bcrypt.compare(payload.password, user.password);

//   if (!isEqual) {
//     throw createHttpError(401, 'Unauthorized');
//   }

//   await SessionsCollection.deleteOne({ userId: user._id });

//   const accessToken = randomBytes(30).toString('base64');
//   const refreshToken = randomBytes(30).toString('base64');

//   return await SessionsCollection.create({
//     userId: user._id,
//     accessToken,
//     refreshToken,
//     accessTokenValidUntil: new Date(Date.now() + FORTY_MINUTES),
//     refreshTokenValidUntil: new Date(Date.now() + SEVEN_DAY),
//   });
// };

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

  const session = await SessionsCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FORTY_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + SEVEN_DAY),
  });

  return { user, session };
};

export const logoutUser = async (sessionId) => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FORTY_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + SEVEN_DAY),
  };
};

export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }

  const newSession = createSession();

  await SessionsCollection.deleteOne({ _id: sessionId, refreshToken });

  return await SessionsCollection.create({
    userId: session.userId,
    ...newSession,
  });
};

export const loginOrSignupWithGoogle = async (code) => {
  const loginTicket = await validateCode(code);
  const payload = loginTicket.getPayload();
  if (!payload) throw createHttpError(401);

  let user = await UsersCollection.findOne({ email: payload.email });
  if (!user) {
    const password = await bcrypt.hash(randomBytes(10), 10);
    user = await UsersCollection.create({
      email: payload.email,
      name: getFullNameFromGoogleTokenPayload(payload),
      password,
      role: 'parent',
    });
  }

  const newSession = createSession();

  return await SessionsCollection.create({
    userId: user._id,
    ...newSession,
  });
};

export const requestResetToken = async (email) => {
  const user = await UsersCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    env('JWT_SECRET'),
    {
      expiresIn: '15m',
    },
  );

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );

  const name = user.name !== 'User' ? user.name : user.email.split('@')[0];
  const templateSource = await fs.readFile(resetPasswordTemplatePath, 'utf-8');
  const template = handlebars.compile(templateSource);
  const html = template({
    name: name,
    reset_link: `${env('LINK_RESET_PASSWORD')}?token=${resetToken}`,
    email_support: `${env('EMAIL_SUPPORT')}`,
  });

  await sendEmail({
    from: env(SMTP.SMTP_FROM),
    to: email,
    subject: 'Reset your password',
    html,
    attachments: [
      {
        filename: 'AquaTrack.png',
        path: path.resolve('src', 'logo/AquaTrack.png'),
        cid: 'logo',
      },
    ],
  });
};

export const resetPassword = async (payload) => {
  let entries;
  try {
    entries = jwt.verify(payload.token, env('JWT_SECRET'));
  } catch (err) {
    if (err instanceof Error) throw createHttpError(401, err.message);
    throw err;
  }
  const user = await UsersCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const encryptedPassword = await bcrypt.hash(payload.password, 10);
  await UsersCollection.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );
};

export const updateCurrentUser = async (userId, data, options = {}) => {
  const result = await UsersCollection.findOneAndUpdate({ _id: userId }, data, {
    new: true,
    includeResultMetadata: true,
    ...options,
  });

  if (!result || !result.value) return null;

  return {
    contact: result.value,
    isNew: Boolean(result?.lastErrorObject?.upserted),
  };
};
