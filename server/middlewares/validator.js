const Joi=require("@hapi/joi")

const schema=Joi.object({
    username:Joi.string().required(),
    email:Joi.string().email().required()
})

module.exports=schema