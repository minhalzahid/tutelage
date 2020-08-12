const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const Notification = mongoose.model('notification', new mongoose.Schema({
    topic: {
        type: String,
        maxlength: 50,
        minlength: 3,
        required: true
    },
    status: {
        type: Number,
        min: 0,
        max: 1,
        required: true
    },
    description: {
        type: String,
        maxlength: 500,
        minlength: 0,
        required: true
    },
    link: {
        type: String,
        maxlength: 500,
        minlength: 3,
        required: true
    },
    flag: {
        type: Boolean,
        required: false,
        default: true
    }
}));


function validateNotification(notification) {
    const schema = {
        topic: Joi.string().required(),
        status: Joi.number().min(0).max(1).required(),
        description: Joi.string().required(),
        link: Joi.string().required(),
        _id: Joi.objectId()
    };

    return Joi.validate(notification, schema);
}

exports.Notification = Notification;
exports.validate = validateNotification;