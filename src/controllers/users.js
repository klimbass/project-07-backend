import { registerUser } from '../services/users.js ';
import { getTotalUsers, loginUser, logoutUser, refreshUsersSession } from '../services/users.js';
import { SEVEN_DAY } from '../constants/index.js';


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



