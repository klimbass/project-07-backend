import Joi from 'joi';

export const createCardSchema = Joi.object({
  volume: Joi.number().integer().required().min(1).max(5000).messages({
    'number.base': 'Amount should be a number',
    'number.min': 'Amount should be at least 1 ml',
    'number.max': 'Amount should be at most 5000 ml',
    'any.required': 'Amount is required',
  }),
  date: Joi.date().iso().required().messages({
    'any.required': 'Date is required',
  }),
});

export const updateCardSchema = Joi.object({
  volume: Joi.number().integer().min(1).max(5000).messages({
    'number.base': 'Amount should be a number',
    'number.min': 'Amount should be at least 1 ml',
    'number.max': 'Amount should be at most 5000 ml',
  }),
  date: Joi.date().iso(),
})
  .min(1)
  .messages({
    'object.min': 'At least one field is required for update',
  });
