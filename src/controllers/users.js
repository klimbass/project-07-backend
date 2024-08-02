import { registerUser } from '../services/users.js ';
import { loginUser } from '../services/users.js';
import {  SEVEN_DAY } from '../constants/index.js';


export const registerUserController = async (req, res) => {
  const { user, accessToken, refreshToken, sessionId } = await registerUser(req.body);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + SEVEN_DAY),
  });
  res.cookie('sessionId', sessionId, {
    httpOnly: true,
    expires: new Date(Date.now() + SEVEN_DAY),
  });

  res.json({
    status: 201,
    message: 'Successfully registered and logged in a user!',
    data: {
      user,
      accessToken,
    },
  });
};

export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + SEVEN_DAY),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + SEVEN_DAY),
  });

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};



