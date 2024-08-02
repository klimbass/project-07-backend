import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registerUserSchema, loginUserSchema, } from '../validation/users.js';
import { registerUserController,  loginUserController } from '../controllers/users.js';


const usersRouter = Router();
usersRouter.get('/'); //отримання загальної кількості зареєстрованих у застосунку користувачів

usersRouter.post('/register', validateBody(registerUserSchema), ctrlWrapper(registerUserController),);
usersRouter.post('/login',validateBody(loginUserSchema),ctrlWrapper(loginUserController),);
usersRouter.post('/logout', ctrlWrapper(),);
usersRouter.post('/refresh', ctrlWrapper(),);









export default usersRouter;


