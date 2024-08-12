import createHttpError from 'http-errors';
// import { SEVEN_DAY } from '../constants/index.js';
import { env } from '../utils/env.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { generateAuthUrl } from '../utils/googleOAuth2.js';
import {
  getTotalUsers,
  registerUser,
  loginUser,
  logoutUser,
  refreshUsersSession,
  requestResetToken,
  resetPassword,
  updateCurrentUser,
  loginOrSignupWithGoogle,
} from '../services/users.js';
import { filterResUser } from '../utils/filterResUser.js';
import { setupSession } from '../utils/createSession.js';

// const setupSession = (res, sessionId, refreshToken) => {
//   res.cookie('refreshToken', refreshToken, {
//     httpOnly: true,
//     expires: new Date(Date.now() + SEVEN_DAY),
//     sameSite: 'none',
//     secure: true,
//   });
//   res.cookie('sessionId', sessionId, {
//     httpOnly: true,
//     expires: new Date(Date.now() + SEVEN_DAY),
//     sameSite: 'none',
//     secure: true,
//   });
// };

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

  // Видалення полів createdAt та updatedAt з користувача
  const userWithoutTimestamps = filterResUser(user);

  setupSession(res, sessionId, refreshToken);

  res.json({
    status: 201,
    message: 'Successfully registered and logged in a user!',
    data: {
      user: userWithoutTimestamps,
      accessToken,
    },
  });
};

export const loginUserController = async (req, res) => {
  const { user, session } = await loginUser(req.body);

  // Видалення полів createdAt та updatedAt з користувача
  const userWithoutTimestamps = filterResUser(user);

  setupSession(res, session._id, session.refreshToken);

  res.json({
    status: 200,
    message: 'Successfully logged in a user!',
    data: {
      user: userWithoutTimestamps,
      accessToken: session.accessToken,
    },
  });
};

export const logoutUserController = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  }

  res.clearCookie('sessionId', {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });
  res.clearCookie('refreshToken', {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });

  res.status(204).send();
};

export const refreshUserSessionController = async (req, res) => {
  const session = await refreshUsersSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  setupSession(res, session._id, session.refreshToken);

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
  const code = req.query.code;
  const { user, session } = await loginOrSignupWithGoogle(code);

  // Видалення полів createdAt та updatedAt з користувача
  const userWithoutTimestamps = filterResUser(user);

  setupSession(res, session._id, session.refreshToken);

  res.json({
    status: 200,
    message: 'Successfully logged in or signed up with Google!',
    data: {
      user: userWithoutTimestamps,
      accessToken: session.accessToken,
    },
  });
};

export const getCurrentUserController = async (req, res, next) => {
  try {
    const user = req.user;
    // Видалення полів createdAt та updatedAt з користувача
    const userWithoutTimestamps = filterResUser(user);

    res.json({
      status: 200,
      message: 'Successfully retrieved current user information.',
      data: { user: userWithoutTimestamps },
    });
  } catch (err) {
    next(err);
  }
};

export const updateCurrentUserController = async (req, res, next) => {
  const { _id: userId } = req.user;
  const data = req.body;
  let photoUrl;

  if (req.file) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(req.file, 'users');
    } else {
      photoUrl = await saveFileToUploadDir(req.file, 'users');
    }
  }

  const updatedResult = await updateCurrentUser(userId, {
    ...data,
    avatar: photoUrl,
  });

  if (!updatedResult) {
    return next(createHttpError(404, 'User not found'));
  }

  // Видалення полів createdAt та updatedAt з оновленого користувача
  const userWithoutTimestamps = filterResUser(updatedResult.user);

  res.json({
    status: 200,
    message: 'User information successfully updated!',
    data: { updatedResult: userWithoutTimestamps },
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
