import { WaterCollection } from '../db/models/water.js';

export const actualAmountDayWater = async (userId) => {
  const day = new Date().toISOString().slice(0, 10);
  let pipeline = [];

  pipeline.push(
    { $match: { userId: userId, date: { $regex: day } } },
    {
      $group: {
        _id: null,
        total_value: { $sum: '$volume' },
      },
    },
  );

  const dayWaterValue = await WaterCollection.aggregate(pipeline);
  return dayWaterValue[0].total_value;
};
