import Joi from 'joi';
import { emailRegexp } from '../constants/index.js';

export const registerUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// скид паролю
export const requestResetEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPasswordSchema = Joi.object({
  password: Joi.string().required(),
  token: Joi.string().required(),
});

export const loginWithGoogleOAuthSchema = Joi.object({
  code: Joi.string().required(),
});

export const updateUserSchema = Joi.object({
  name: Joi.string().pattern(/^[a-zA-Z ]+$/).messages({
    'string.pattern.base':'Name can only contain letters',
  }),
  email: Joi.string().pattern(emailRegexp).messages({
    'string.email': 'Email must be a valid email address',
  }),
  gender: Joi.string().valid('woman', 'man'),
  weight: Joi.number().min(10).max(250).messages({
    'number.min': 'Weight should be at least 10 kg',
    'number.max': 'Weight should not exceed 250 kg'
  }),
  dailyActivityTime: Joi.number().min(0).messages({
    'number.min': 'Daily activity time cannot be a negative number',
  }),
  dailyWaterNorm: Joi.number().min(0).messages({
    'number.min': 'Daily water norm cannot be a negative number',
  }),
  avatar: Joi.string(),
});
