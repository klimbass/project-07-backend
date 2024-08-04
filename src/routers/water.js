import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { validateBody } from '../middlewares/validateBody.js';
import isValidId from '../middlewares/isValidId.js';
import  parseDayParams  from '../utils/day.js';
import parseMonthParams from '../utils/month.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  createCardSchema,
  searchByDayCardSchema,
  searchByMonthCardSchema,
  updateCardSchema
} from '../validation/water.js';

import {
  createCardController,
  patchCardController,
  deleteCardController,
  getMonthWaterController
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

//  приватний ендпоінт для отримання даних щодо спожитої користувачем води за день
waterRouter.get(
  '/day',
  validateBody(searchByDayCardSchema),
  parseDayParams,
  ctrlWrapper(getMonthWaterController));

//  приватний ендпоінт для отримання даних щодо спожитої користувачем води за місяць
waterRouter.get(
  '/month',
  validateBody(searchByMonthCardSchema),
  parseMonthParams,
  ctrlWrapper(getMonthWaterController));

export default waterRouter;
