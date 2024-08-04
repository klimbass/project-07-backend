
import { getCurrentDate } from '../db/models/water.js';

export const parseMonthParams = (req, res, next) => {
  const { date } = req.body;
  if(date) {next();
  return;}
  const newDate = getCurrentDate().slice(0, 7);
  req.body.date = newDate;
  next();
  return;
  };

export default parseMonthParams;