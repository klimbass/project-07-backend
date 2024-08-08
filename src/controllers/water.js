import createHttpError from 'http-errors';
import {
  createCard,
  patchCard,
  deleteCard,
  getMonthWater,
} from '../services/water.js';
import {
  DATE_REGEX,
  MONTH_REGEX,
  PARSE_DATE_PARAMS,
} from '../constants/index.js';
import getCurrentDate from '../utils/parseDate.js';
import { actualAmountDayWater } from '../utils/actualAmountDayWater.js';

export const getMonthWaterController = async (req, res) => {
  const parsedDate = getCurrentDate(
    req.query,
    PARSE_DATE_PARAMS[0],
    MONTH_REGEX,
  );
  const { _id: userId } = req.user;
  const data = await getMonthWater(userId, parsedDate);

  res.status(200).json({
    status: 200,
    message: `Successfully found drinks for ${parsedDate}!`,
    data,
  });
};
export const getDayhWaterController = async (req, res) => {
  const parsedDate = getCurrentDate(
    req.query,
    PARSE_DATE_PARAMS[1],
    DATE_REGEX,
  );
  const { _id: userId } = req.user;
  const data = await getMonthWater(userId, parsedDate);

  res.status(200).json({
    status: 200,
    message: `Successfully found drinks for ${parsedDate}!`,
    data,
  });
};

export const createCardController = async (req, res) => {
  const cardData = {
    ...req.body,
    userId: req.user._id,
  };

  const data = await createCard(cardData, req);
  const actualDayWater = await actualAmountDayWater(req.user._id);
  res.status(201).json({
    status: 201,
    message: `Successfully created a card!`,
    data,
    actualDayWater,
  });
};

export const patchCardController = async (req, res) => {
  const { cardId } = req.params;
  const payload = req.body;
  const userId = req.user._id;

  const patchedCard = await patchCard(cardId, payload, userId);

  if (!patchedCard) {
    throw createHttpError(404, 'Card not found', {
      data: {
        message: `Card with ${cardId} not found`,
      },
    });
  }
  const actualDayWater = await actualAmountDayWater(req.user._id);

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a card!',
    data: patchedCard.card,
    actualDayWater,
  });
};

export const deleteCardController = async (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  const result = await deleteCard(cardId, userId);

  if (!result) {
    throw createHttpError(404, 'Card not found', {
      data: {
        message: `Card with ${cardId} not found`,
      },
    });
  }
  const actualDayWater = await actualAmountDayWater(req.user._id);

  res.status(204).json({
    status: 204,
    message: 'Successfully deleted a card!',
    actualDayWater,
  });
};
