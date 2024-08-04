import { SORT_ORDER_ARRAY, SORT_BY } from '../constants/index.js';
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
  return { items, totalItems, waterAmount };
};

export const getMonthWater = async (userId, day) => {
  // const items = await WaterCollection.find({
  //   userId: userId,
  //   date: { $regex: day },
  // });
  // const totalItems = await WaterCollection.countDocuments({
  //   userId: userId,
  //   date: { $regex: day },
  // }).sort({ [SORT_BY[0]]: SORT_ORDER_ARRAY[0] });

  const matchForUserIdandDate = {
    $match: { userId: userId, date: { $regex: day } },
  };
  const dateConvert = { $addFields: { convertedDate: { $toDate: '$date' } } };
  const setDate = {$set: {
        date: { $toDate: '$date' }
    }}
  const formOfArray = {
    $project: {
      emit: {
        date: '$date',
        // forYear: { $year: '$convertedDate'},
        // forMonth: { $month: '$convertedDate'},
        // forDay: { $dayOfMonth: '$convertedDate'},
        _id: '$id',
        userId: '$userId',
        volume: '$volume',
      },
    },
  };
  const sort = { $sort: { [SORT_BY[1]]: SORT_ORDER_ARRAY[0] } };
  const groupByDays = {
    $group: {
      _id: { $dayOfMonth: '$date'},
      // forDay: "$date",
      amount: { $sum: '$volume' },
      quantity: { $sum: 1 },
    },
  };

  // const unwind = {
  //   $unwind: {
  //       "path": "$products"
  //   }

  // const sortByDay;

  const waterAmount = await WaterCollection.aggregate([
    matchForUserIdandDate, setDate,
    //dateConvert,
    //formOfArray,
    sort,
    groupByDays,
  ]);
  // const waterAmount = await items.append([groupByDays]);
  //  const {emit:{date}}= waterAmount[0];
  // console.log('===========emit=========================');
  // console.log(typeof(date));
  //   console.log('====================================');

  return { waterAmount };
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
