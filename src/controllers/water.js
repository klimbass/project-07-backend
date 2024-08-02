import { createCard, patchCard, deleteCard } from '../services/water.js';
import createHttpError from 'http-errors';

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
  const userId = req.user._id;

  const patchedCard = await patchCard(cardId, { ...req.body }, userId);

  if (!patchedCard) {
    throw createHttpError(404, 'Card not found');
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

  const deletedCard = await deleteCard(cardId, userId);

  if (!deletedCard) {
    throw createHttpError(404, 'Card not found', {
      data: {
        message: 'Card not found',
      },
    });
  }

  res.status(204).send();
};
