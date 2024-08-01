import { Router } from 'express';

const usersRouter = Router();
usersRouter.get('/'); //отримання загальної кількості зареєстрованих у застосунку користувачів
usersRouter.post('/auth/register');
usersRouter.post('/auth/login');

usersRouter.get('/auth/get-oauth-url'); //google
usersRouter.post('/auth/confirm-oauth'); //google

usersRouter.post('/auth/request-reset-email'); //зміна
usersRouter.post('/auth/reset-password'); //пароля

// usersRouter.use(authenticate)
usersRouter.post('/auth/refresh');
usersRouter.post('/auth/logout');
usersRouter.get('/:userId'); //отримання інформації про поточного користувача  ??
usersRouter.patch('/:userId'); //оновлення даних  ?? з multer

export default usersRouter;

// створити публічний ендпоінт реєстрації користувача
// створити публічний ендпоінт логінізації користувача
// написати прошарок авторизації
// створити приватний ендпоінт на отримання інформації про поточного користувача
// створити приватний ендпоінт для оновлення даних авторизованого користувача (ім'я,emailу, статі, ваги, активного часу на спорт, денної норми води та аватарки)
// створити приватний ендпоінт для видачі нової пари токенів (доступу та оновлення)
// створити приватний ендпоінт для логаута користувача
