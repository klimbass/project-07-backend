import { Router } from 'express';

const waterRouter = Router();

// waterRouter.use(authenticate) //аутентіфікація на всі роути
waterRouter.post('/');
waterRouter.patch('/:cardId');
waterRouter.delete('/:cardId');
waterRouter.get('/consumption/daily/:day?'); //'?' - не обов'зковий параметр. Якщо не вказан, дати за поточний день
waterRouter.get('/consumption/monthly/:month?'); // типу так само як з днем
export default waterRouter;

// створити приватний ендпоінт додавання запису про спожитий обʼєм води
// створити приватний ендпоінт редагування запису про спожитий обʼєм води
// створити приватний ендпоінт видалення запису про спожитий обʼєм води
// створити приватний ендпоінт для отримання даних щодо спожитої користувачем води за день
// створити приватний ендпоінт для отримання даних щодо спожитої користувачем води за місяць
