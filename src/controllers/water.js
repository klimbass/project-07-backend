import createHttpError from 'http-errors';
import { createCard, patchCard, deleteCard, getMonthWater } from '../services/water.js';



export const getMonthWaterController = async (req, res) => {
  const {date}= req.body;
  const { _id: userId } = req.user;
  const data = await getMonthWater(userId, date);

  res.status(200).json({
    status: 200,
    message: `Successfully found drinks for ${date}!`,
    data

  });
};

export const createCardController = async (req, res) => {
  const cardData = {
    ...req.body,
    userId: req.user._id,
  };

  const data = await createCard(cardData, req);

  res.status(201).json({
    status: 201,
    message: `Successfully created a card!`,
    data,
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

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a card!',
    data: patchedCard.card,
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

  res.status(204).send();
};
