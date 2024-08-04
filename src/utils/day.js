
import { getCurrentDate } from '../db/models/water.js';

const parseDayParams = (req, res, next) => {
  const { date } = req.body;
  if(date) {next();
  return;}
  const newDate = getCurrentDate().slice(0, 10);
  req.body.date = newDate;
  next();
  return;
};

export default parseDayParams;
