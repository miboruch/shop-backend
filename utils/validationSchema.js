const Joi = require('joi');

const registerValidation = body => {
  const validationSchema = {
    login: Joi.string()
      .min(3)
      .required(),
    email: Joi.string()
      .min(6)
      .required()
      .email(),
    password: Joi.string().regex(
      /^(?=.*\d)(?=.*[a-z])[\w~@#$%^&*+=`|{}:;!.?\"()\[\]-]{8,25}$/
    ),
    name: Joi.string()
      .min(2)
      .required(),
    lastName: Joi.string()
      .min(2)
      .required(),
    city: Joi.string()
      .min(2)
      .required(),
    address: Joi.string()
      .min(2)
      .required()
  };
  return Joi.validate(body, validationSchema);
};

const loginValidation = body => {
  const validationSchema = {
    email: Joi.string()
      .min(6)
      .required()
      .email(),
    password: Joi.string().regex(
      /^(?=.*\d)(?=.*[a-z])[\w~@#$%^&*+=`|{}:;!.?\"()\[\]-]{8,25}$/
    )
  };
  return Joi.validate(body, validationSchema);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
