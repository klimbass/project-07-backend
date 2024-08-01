import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';

const isValidId = (req, res, next) => {
  const params = Object.keys(req.params);

  for (const param of params) {
    if (isValidObjectId(req.params[param])) continue;

    return next(createHttpError(400, `Invalid ID: ${param}`));
  }

  next();
};

export default isValidId;
