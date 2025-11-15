const Joi = require('joi');

const updatePixelSchema = Joi.object({
    x: Joi.number().integer().min(0).max(99).required(),
    y: Joi.number().integer().min(0).max(99).required(),
    color: Joi.string().regex(/^#[0-9a-f]{6}$/i).required(),
});

module.exports = {
    updatePixelSchema,
};