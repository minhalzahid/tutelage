const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const Chat = mongoose.model('chat', new mongoose.Schema({
    messages: [{
        body: { type: String, required: true },
        user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
        time: { type: Date, default: Date.now(), required: true}
    }],
    
    members: [{
        member: { type: mongoose.Schema.Types.ObjectId, required: true },
    }],

    flag: {
        type: Boolean,
        required: false,
        default: true
    }
}));


function validateLecture(chat) {
    const schema = {
        members: Joi.array().max(2).min(2).required(),
        messages: Joi.string().required(),
        flag: Joi.boolean(),
        _id: Joi.objectId()
    };

    return Joi.validate(chat, schema);
}

exports.Chat = Chat;
exports.validate = validateLecture