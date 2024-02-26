import joi from 'joi';

export const userValidator = joi
    .object({
        name: joi.string().required(),
        age: joi.number().required(),
        adress: joi.string().required(),
    })
    .unknown(true);
