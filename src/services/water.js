import { WaterCollection } from '../db/models/water.js';

export const createCard = async (payload) => {
  const card = await WaterCollection.create(payload);
  return card;
};

export const patchCard = async (cardId, payload = {}, userId) => {
  const updateOptions = { new: true, includeResultMetadata: true };

  const rawResult = await WaterCollection.findOneAndUpdate(
    { _id: cardId, userId },
    payload,
    updateOptions,
  );

  if (!rawResult || !rawResult.value) return null;

  const patchedCard = {
    card: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upsert),
  };

  return patchedCard;
};

export const deleteCard = async (cardId, userId) => {
  const result = await WaterCollection.findOneAndDelete({
    _id: cardId,
    userId,
  });

  return result;
};
