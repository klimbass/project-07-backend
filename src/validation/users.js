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
  weight: Joi.number(),
  dailyActivityTime: Joi.number(),
  dailyWaterNorm: Joi.number(),
  avatar: Joi.string().optional(),
});
