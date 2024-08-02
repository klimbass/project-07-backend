import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registerUserSchema, loginUserSchema, } from '../validation/users.js';
import { getTotalUsersController, registerUserController, loginUserController, logoutUserController,
    refreshUserSessionController} from '../controllers/users.js';


const usersRouter = Router();
usersRouter.get('/total', ctrlWrapper(getTotalUsersController)); //отримання загальної кількості зареєстрованих у застосунку користувачів
usersRouter.post('/register', validateBody(registerUserSchema), ctrlWrapper(registerUserController),);
usersRouter.post('/login',validateBody(loginUserSchema),ctrlWrapper(loginUserController),);
usersRouter.post('/logout', ctrlWrapper(logoutUserController),);
usersRouter.post('/refresh', ctrlWrapper(refreshUserSessionController),);









export default usersRouter;


