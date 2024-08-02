import { WaterCollection } from '../db/models/water.js';

export const createCard = async (payload) => {
  return await WaterCollection.create(payload);
};

export const patchCard = async (cardId, payload = {}, userId) => {
  const updateOptions = { new: true, includeResultMetadata: true };

  const rawResult = await WaterCollection.findOneAndUpdate(
    { _id: cardId, userId },
    payload,
    updateOptions,
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    card: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upsert),
  };
};

export const deleteCard = async (cardId, userId) => {
  return await WaterCollection.findOneAndDelete({
    _id: cardId,
    userId,
  });
};
