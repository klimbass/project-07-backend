import { SORT_ORDER_ARRAY, SORT_BY } from '../constants/index.js';
import { WaterCollection } from '../db/models/water.js';

export const getMonthWater = async (userId, day) => {

  const matchForUserIdandDate = {
    $match: { userId: userId, date: { $regex: day } },
  };
  
  const setDate = {$set: {
        date: { $toDate: '$date' }
    }};

  const sort = { $sort: { [SORT_BY[1]]: SORT_ORDER_ARRAY[0] } };
  const groupByDays = {
    $group: {
      _id: { $dayOfMonth: '$date'},
      dayAmount: { $sum: '$volume' },
      totalForDay: { $sum: 1 },
    },
  };
   
  const setDay= {$set: {
    dayOfMonth: '$_id' 
}};
   const unset = {$unset:["_id"]};

  
   const items = await WaterCollection.aggregate([matchForUserIdandDate]);
  const totalItems = await WaterCollection.countDocuments([matchForUserIdandDate]);
  const waterAmount = await WaterCollection.aggregate([
    matchForUserIdandDate, setDate,
    sort,
    groupByDays, setDay, unset
  ]);

  return {items, totalItems, waterAmount };
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
