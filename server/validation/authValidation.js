import Joi from "joi";

export const registerSchema = Joi.object({
  fullName: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  username: Joi.string().alphanum().min(3).required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.ref("password"),
  terms: Joi.valid(true).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
