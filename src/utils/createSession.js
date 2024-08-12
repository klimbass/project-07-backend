import { FORTY_MINUTES, SEVEN_DAY } from '../constants/index.js';
import { randomBytes } from 'crypto';

export const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FORTY_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + SEVEN_DAY),
  };
};

export const setupSession = (res, sessionId, refreshToken) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + SEVEN_DAY),
    sameSite: 'none',
    secure: true,
  });
  res.cookie('sessionId', sessionId, {
    httpOnly: true,
    expires: new Date(Date.now() + SEVEN_DAY),
    sameSite: 'none',
    secure: true,
  });
};
