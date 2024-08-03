import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  registerUserSchema,
  loginUserSchema,
  loginWithGoogleOAuthSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
} from '../validation/users.js';
import {
  getTotalUsersController,
  registerUserController,
  getGoogleOAuthUrlController,
  loginUserController,
  logoutUserController,
  refreshUserSessionController,
  loginWithGoogleController,
  requestResetEmailController,
  resetPasswordController,
} from '../controllers/users.js';
import { registerUserSchema, loginUserSchema, loginWithGoogleOAuthSchema, updateUserSchema } from '../validation/users.js';
import { getTotalUsersController, registerUserController, getGoogleOAuthUrlController, loginUserController, logoutUserController, refreshUserSessionController, loginWithGoogleController, getCurrentUserController, updateCurrentUserController
} from '../controllers/users.js';
import {authenticate} from '../middlewares/authenticate.js';
import {upload} from '../middlewares/multer.js';

const usersRouter = Router();
usersRouter.get('/total', ctrlWrapper(getTotalUsersController)); //отримання загальної кількості зареєстрованих у застосунку користувачів
usersRouter.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);
usersRouter.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);
usersRouter.post('/logout', ctrlWrapper(logoutUserController));
usersRouter.post('/refresh', ctrlWrapper(refreshUserSessionController));
//створення посилання для гугл аутентифікації
usersRouter.get('/get-oauth-url', ctrlWrapper(getGoogleOAuthUrlController));
//Створення логіну ueuk
usersRouter.post(
 '/confirm-oauth',
   validateBody(loginWithGoogleOAuthSchema),
   ctrlWrapper(loginWithGoogleController),
);
//Створення роутів на отримання та оновлення даних поточного користувача
usersRouter.get( '/current', authenticate, ctrlWrapper(getCurrentUserController));
usersRouter.patch( '/update', authenticate, upload.single('avatar'), validateBody(updateUserSchema),ctrlWrapper(updateCurrentUserController));usersRouter.post(
  '/request-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmailController),
);

usersRouter.post(
  '/reset-password',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

export default usersRouter;
