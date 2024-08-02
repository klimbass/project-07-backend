import Joi from 'joi';
import { dateStringRegex } from '../constants/index.js';

export const createCardSchema = Joi.object({
  volume: Joi.number().integer().required().min(1).max(5000).messages({
    'number.base': 'Amount should be a number',
    'number.min': 'Amount should be at least 1 ml',
    'number.max': 'Amount should be at most 5000 ml',
    'any.required': 'Amount is required',
  }),
  date: Joi.string().required().pattern(dateStringRegex).messages({
    'any.required': 'Date is required',
  }),
});

export const updateCardSchema = Joi.object({
  volume: Joi.number().integer().min(1).max(5000).messages({
    'number.base': 'Amount should be a number',
    'number.min': 'Amount should be at least 1 ml',
    'number.max': 'Amount should be at most 5000 ml',
  }),
  date: Joi.string().pattern(dateStringRegex),
})
  .min(1)
  .messages({
    'object.min': 'At least one field is required for update',
  });
