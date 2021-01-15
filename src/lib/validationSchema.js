const Joi = require('joi')
const schemas = {

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