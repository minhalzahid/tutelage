const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const Request = mongoose.model('request', new mongoose.Schema({
    status: {
        type: Number,
        min: 0,
        max: 2,
        required: true
    },

    lecture_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    flag: {
        type: Boolean,
        required: false,
        default: true
    }

}));


function validateRequest(Request) {
    const schema = {
        lecture_id: Joi.objectId().required(),
        status: Joi.number().min(0).max(2),
        sender: Joi.objectId().required(),
        receiver: Joi.objectId().required(),
        _id: Joi.objectId()
    };

    return Joi.validate(Request, schema);
}

exports.Request = Request;
exports.validate = validateRequest;