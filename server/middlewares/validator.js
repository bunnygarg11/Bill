const Joi=require("@hapi/joi")
const paymentDetailsSchema=Joi.object().keys({
    onlineStore:Joi.array().when("isSellOnline",{
        is:Joi.string().equal("yes"),
        then:Joi.string().required()
    })
})

const schema=Joi.object({
    username:Joi.string().required(),
    email:Joi.string().email().required()
})

module.exports=schema