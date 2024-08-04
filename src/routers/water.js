import { Router } from 'express';

import { authenticate } from '../middlewares/authenticate.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import isValidId from '../middlewares/isValidId.js';

import { createCardSchema, updateCardSchema } from '../validation/water.js';

import {
  createCardController,
  patchCardController,
  deleteCardController,
  getWaterCardsController,
} from '../controllers/water.js';

const waterRouter = Router();

waterRouter.use(authenticate);

waterRouter.post(
  '/',
  validateBody(createCardSchema),
  ctrlWrapper(createCardController),
);

waterRouter.patch(
  '/:cardId',
  isValidId,
  validateBody(updateCardSchema),
  ctrlWrapper(patchCardController),
);

waterRouter.delete('/:cardId', isValidId, ctrlWrapper(deleteCardController));

// створити приватний ендпоінт для отримання даних щодо спожитої користувачем води за день
waterRouter.get('/day', ctrlWrapper(getWaterCardsController)); //'?' - не обов'зковий параметр. Якщо не вказан, дати за поточний день

// створити приватний ендпоінт для отримання даних щодо спожитої користувачем води за місяць
waterRouter.get('/month', ctrlWrapper(getWaterCardsController)); // типу так само як з днем

export default waterRouter;
