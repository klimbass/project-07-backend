import createHttpError from 'http-errors';
import {env} from '../utils/env.js';
import { registerUser } from '../services/users.js ';
import { getTotalUsers, loginUser, logoutUser, refreshUsersSession, updateCurrentUser } from '../services/users.js';
import {
  getTotalUsers,
  loginUser,
  logoutUser,
  refreshUsersSession,
  requestResetToken,
  resetPassword,
} from '../services/users.js';
import { SEVEN_DAY } from '../constants/index.js';
import { generateAuthUrl } from '../utils/googleOAuth2.js';
import { loginOrSignupWithGoogle } from '../services/users.js';

export const getTotalUsersController = async (req, res) => {
  try {
    const totalUsers = await getTotalUsers();
    res.json({
      status: 200,
      message: 'Total number of users retrieved successfully!',
      data: {
        totalUsers,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

export const registerUserController = async (req, res) => {
  const { user, accessToken, refreshToken, sessionId } = await registerUser(
    req.body,
  );

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

export const logoutUserController = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};
const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + SEVEN_DAY),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + SEVEN_DAY),
  });
};

export const refreshUserSessionController = async (req, res) => {
  const session = await refreshUsersSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const getGoogleOAuthUrlController = async (req, res) => {
  const url = generateAuthUrl();
  res.json({
    status: 200,
    message: 'Successfully get Google OAuth url!',
    data: {
      url,
    },
  });
};

export const loginWithGoogleController = async (req, res) => {
  const session = await loginOrSignupWithGoogle(req.body.code);
  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully logged in via Google OAuth!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const getCurrentUserController = async (req, res, next) => {
  try {
    const user = req.user;

    res.json({
    status: 200,
    message: `Current user with ID ${user._id} successfully found`,
    data: user,
  });
} catch (err) {
  next (err);
}
};

export const updateCurrentUserController = async (req, res, next) => {
  const { _id: userId } = req.user;
  const data = req.body;
  let photoUrl;

  if(req.file) {
    if (env('ENABLE_CLOUDINARY')==='true') {
      photoUrl = await saveFileToCloudinary(req.file, 'users');
  } else {
      photoUrl = await saveFileToUploadDir(req.file, 'users');
  }
}

  const updatedResult = await updateCurrentUser(userId, {...data, avatar: photoUrl});

  if (!updatedResult) {
    return next(createHttpError(404, 'User not found'));
}

res.json({
    status: 200,
    message: 'User information successfully updated!',
    data: updatedResult,
});
};

export const requestResetEmailController = async (req, res) => {
  await requestResetToken(req.body.email);
  res.json({
    status: 200,
    message: 'Reset password email was successfully sent!',
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);
  res.json({
    status: 200,
    message: 'Password was successfully reset!',
    data: {},
  });
};
