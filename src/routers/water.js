import { Router } from 'express';

import { authenticate } from '../middlewares/authenticate.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
//TODO: @akoroliova
import { createCardSchema } from '../validation/water.js'; // цей файл і Joi-схему чекаю від Наталії

import {
  createCardController,
  patchCardController,
  deleteCardController,
} from '../controllers/water.js';

const waterRouter = Router();

waterRouter.use(authenticate);

// приватний ендпоінт додавання запису про спожитий обʼєм води
waterRouter.post(
  '/',
  validateBody(createCardSchema),
  ctrlWrapper(createCardController),
);

// приватний ендпоінт редагування запису про спожитий обʼєм води
waterRouter.patch(
  '/:cardId',
  isValidId,
  validateBody(createCardSchema),
  ctrlWrapper(patchCardController),
);

// приватний ендпоінт видалення запису про спожитий обʼєм води
waterRouter.delete('/:cardId', isValidId, ctrlWrapper(deleteCardController));

// створити приватний ендпоінт для отримання даних щодо спожитої користувачем води за день
waterRouter.get('/consumption/daily/:day?'); //'?' - не обов'зковий параметр. Якщо не вказан, дати за поточний день

// створити приватний ендпоінт для отримання даних щодо спожитої користувачем води за місяць
waterRouter.get('/consumption/monthly/:month?'); // типу так само як з днем
export default waterRouter;
