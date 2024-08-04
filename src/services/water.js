import { SORT_ORDER_ARRAY, SORT_BY} from '../constants/index.js';
import { WaterCollection } from '../db/models/water.js';

export const getWaterCards = async (userId, day) => {
  const items = await WaterCollection.find({
    userId: userId,
    date: { $regex: day },
  });
  const totalItems = await WaterCollection.countDocuments({
    userId: userId,
    date: { $regex: day },
  }).sort({ [SORT_BY[0]]: SORT_ORDER_ARRAY[0] });
  const waterAmount = await WaterCollection.aggregate([
    { $match: { date: { $regex: day } } },
    { $group: { _id: day, amount: { $sum: '$volume' } } },
  ]);
  return { items, totalItems, waterAmount};
};

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
