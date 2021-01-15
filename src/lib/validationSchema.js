const Joi = require('joi')
const schemas = {
<<<<<<< Updated upstream
=======
  productSchema: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    brand: Joi.string().required(),
    imageUrl: Joi.string(),
    price: Joi.number().required(),
    category: Joi.string().required(),
    sku: Joi.string().required(),
    qt: Joi.number().required(),
  }),
  userSchema: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
};
>>>>>>> Stashed changes

    productSchema = Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string().required(),
        brand: Joi.string().required(),
        imageUrl: Joi.string(),
        price: Joi.number().required(),
        category: Joi.string().required(),
    })

}

module.exports = schemas